#!/usr/bin/env node

/**
 * Podcast Deduplication Script for Waiheke Radio
 * 
 * This script identifies and removes duplicate podcasts from the Sanity dataset,
 * and updates any references to point to the kept podcast.
 * 
 * Usage: node scripts/deduplicate-podcasts.js [--dry-run]
 */

const { createClient } = require('@sanity/client');
const { updateAllReferences } = require('./update-podcast-references');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvLocal() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        if (key.trim() && !process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    }
  } catch (error) {
    // .env.local not found or couldn't be read
  }
}

// Load .env.local if it exists
loadEnvLocal();

// Sanity client configuration
const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN, // Required for write operations
  apiVersion: '2023-01-01'
});

const DRY_RUN = process.argv.includes('--dry-run');

console.log(`🚀 Podcast Deduplication Script ${DRY_RUN ? '(DRY RUN MODE)' : ''}`);
console.log('=====================================\n');

/**
 * Normalize title for comparison (removes extra spaces, converts to lowercase)
 */
function normalizeTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Calculate similarity score between two titles
 */
function calculateSimilarity(title1, title2) {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);
  
  if (norm1 === norm2) return 1.0; // Exact match
  
  // Simple Levenshtein distance for similarity
  const longer = norm1.length > norm2.length ? norm1 : norm2;
  const shorter = norm1.length > norm2.length ? norm2 : norm1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Levenshtein distance calculation
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Find all documents that reference a specific podcast
 */
async function findReferences(podcastId) {
  const query = `*[references("${podcastId}")]{_type, _id, title}`;
  const references = await client.fetch(query);
  return references;
}

/**
 * Get all podcasts from Sanity
 */
async function getAllPodcasts() {
  const query = `*[_type == "amazonPodcast"]{
    _id,
    title,
    slug,
    date,
    amazonUrl,
    show->{_id, title},
    description,
    _createdAt,
    _updatedAt
  } | order(date desc)`;
  
  return await client.fetch(query);
}

/**
 * Find duplicate podcasts based on title similarity and other criteria
 */
function findDuplicates(podcasts) {
  const duplicateGroups = [];
  const processed = new Set();
  
  console.log(`📊 Analyzing ${podcasts.length} podcasts for duplicates...\n`);
  
  for (let i = 0; i < podcasts.length; i++) {
    if (processed.has(podcasts[i]._id)) continue;
    
    const currentPodcast = podcasts[i];
    const duplicateGroup = [currentPodcast];
    processed.add(currentPodcast._id);
    
    // Find similar podcasts
    for (let j = i + 1; j < podcasts.length; j++) {
      if (processed.has(podcasts[j]._id)) continue;
      
      const otherPodcast = podcasts[j];
      const similarity = calculateSimilarity(currentPodcast.title, otherPodcast.title);
      
      // Consider duplicates if:
      // 1. Very high title similarity (>= 0.9)
      // 2. Same show and similar date (within 7 days)
      const sameShow = currentPodcast.show?._id === otherPodcast.show?._id;
      const dateA = new Date(currentPodcast.date);
      const dateB = new Date(otherPodcast.date);
      const daysDiff = Math.abs((dateA - dateB) / (1000 * 60 * 60 * 24));
      
      const isDuplicate = 
        similarity >= 0.9 || 
        (similarity >= 0.7 && sameShow && daysDiff <= 7);
      
      if (isDuplicate) {
        duplicateGroup.push(otherPodcast);
        processed.add(otherPodcast._id);
      }
    }
    
    // Only add groups with actual duplicates
    if (duplicateGroup.length > 1) {
      duplicateGroups.push(duplicateGroup);
    }
  }
  
  return duplicateGroups;
}

/**
 * Choose which podcast to keep from a duplicate group
 * Priority: 1) Most recent date, 2) Has slug, 3) Longer description, 4) Earlier created
 */
function choosePodcastToKeep(duplicateGroup) {
  return duplicateGroup.reduce((best, current) => {
    // Prefer newer date
    const bestDate = new Date(best.date || 0);
    const currentDate = new Date(current.date || 0);
    
    if (currentDate > bestDate) return current;
    if (bestDate > currentDate) return best;
    
    // If dates are equal, prefer podcast with slug
    if (current.slug?.current && !best.slug?.current) return current;
    if (best.slug?.current && !current.slug?.current) return best;
    
    // Prefer longer description
    const bestDescLength = (best.description || '').length;
    const currentDescLength = (current.description || '').length;
    
    if (currentDescLength > bestDescLength) return current;
    if (bestDescLength > currentDescLength) return best;
    
    // Finally, prefer earlier created (original)
    const bestCreated = new Date(best._createdAt || 0);
    const currentCreated = new Date(current._createdAt || 0);
    
    return currentCreated < bestCreated ? current : best;
  });
}

/**
 * Update references from old podcast ID to new podcast ID
 */
async function updateReferences(oldId, newId, podcastTitle = '') {
  try {
    const results = await updateAllReferences(oldId, newId, podcastTitle);
    return results.success;
  } catch (error) {
    console.error(`     ❌ Failed to update references for ${oldId}:`, error.message);
    return 0;
  }
}

/**
 * Delete a podcast document
 */
async function deletePodcast(podcastId) {
  if (DRY_RUN) {
    console.log(`     (DRY RUN: Would delete podcast ${podcastId})`);
    return true;
  }
  
  try {
    await client.delete(podcastId);
    return true;
  } catch (error) {
    console.error(`     ❌ Failed to delete podcast ${podcastId}:`, error.message);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Check if we have the required token for write operations
    const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
    if (!token && !DRY_RUN) {
      console.error('❌ SANITY_AUTH_TOKEN or SANITY_API_WRITE_TOKEN environment variable is required for write operations.');
      console.log('   Get your token from: https://sanity.io/manage');
      console.log('   Or run with --dry-run to see what would be changed.\n');
      process.exit(1);
    }
    
    // Get all podcasts
    console.log('📥 Fetching all podcasts from Sanity...');
    const podcasts = await getAllPodcasts();
    console.log(`✅ Found ${podcasts.length} podcasts\n`);
    
    // Find duplicates
    const duplicateGroups = findDuplicates(podcasts);
    
    if (duplicateGroups.length === 0) {
      console.log('🎉 No duplicates found! Your podcast database is clean.');
      return;
    }
    
    console.log(`🔍 Found ${duplicateGroups.length} groups of duplicates:\n`);
    
    let totalToDelete = 0;
    let totalReferencesToUpdate = 0;
    
    // Process each duplicate group
    for (let i = 0; i < duplicateGroups.length; i++) {
      const group = duplicateGroups[i];
      const keepPodcast = choosePodcastToKeep(group);
      const toDelete = group.filter(p => p._id !== keepPodcast._id);
      
      console.log(`📑 Group ${i + 1}: "${group[0].title}"`);
      console.log(`   ✅ KEEP: ${keepPodcast.title} (${keepPodcast.date}) [${keepPodcast._id}]`);
      
      totalToDelete += toDelete.length;
      
      for (const podcast of toDelete) {
        console.log(`   ❌ DELETE: ${podcast.title} (${podcast.date}) [${podcast._id}]`);
        
        // Check for references and update them
        const referencesUpdated = await updateReferences(podcast._id, keepPodcast._id, podcast.title);
        totalReferencesToUpdate += referencesUpdated;
        
        // Delete the duplicate
        const deleted = await deletePodcast(podcast._id);
        if (deleted) {
          console.log(`     ✅ Deleted successfully`);
        }
      }
      
      console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   • ${duplicateGroups.length} duplicate groups found`);
    console.log(`   • ${totalToDelete} podcasts ${DRY_RUN ? 'would be' : 'were'} deleted`);
    console.log(`   • ${totalReferencesToUpdate} references ${DRY_RUN ? 'need' : 'were'} updated`);
    
    if (DRY_RUN) {
      console.log('\n💡 This was a dry run. To actually perform the cleanup:');
      console.log('   1. Set your SANITY_AUTH_TOKEN environment variable');
      console.log('   2. Run: node scripts/deduplicate-podcasts.js');
    } else {
      console.log('\n✅ Deduplication complete!');
      console.log('   Please review your content to ensure everything looks correct.');
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();