#!/usr/bin/env node

/**
 * Podcast Reference Update Script
 * 
 * This companion script handles updating references to podcasts
 * after deduplication. It finds all documents that reference
 * old podcast IDs and updates them to point to the new IDs.
 */

const { createClient } = require('@sanity/client');
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
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2023-01-01'
});

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Find all references to a specific podcast ID
 */
async function findAllReferences(podcastId) {
  // Query for documents that reference this podcast
  const referencingDocuments = await client.fetch(`
    *[references("${podcastId}")]{
      _type,
      _id,
      title,
      // Get the specific fields that might contain the reference
      featuredPodcast,
      podcasts,
      // For latestPodcasts documents
      "hasDirectReference": defined(featuredPodcast) && featuredPodcast._ref == "${podcastId}",
      "podcastsArray": podcasts[]._ref,
      "hasPodcastsReference": "${podcastId}" in podcasts[]._ref
    }
  `);
  
  return referencingDocuments;
}

/**
 * Update a single document's references
 */
async function updateDocumentReferences(doc, oldId, newId) {
  const patches = [];
  
  // Check if featuredPodcast field references the old ID
  if (doc.featuredPodcast && doc.featuredPodcast._ref === oldId) {
    patches.push({
      patch: {
        id: doc._id,
        set: {
          featuredPodcast: {
            _type: 'reference',
            _ref: newId
          }
        }
      }
    });
  }
  
  // Check if podcasts array contains the old ID
  if (doc.podcasts && Array.isArray(doc.podcasts)) {
    const updatedPodcasts = doc.podcasts.map(podcast => {
      if (podcast._ref === oldId) {
        return {
          ...podcast,
          _ref: newId
        };
      }
      return podcast;
    });
    
    // Only add patch if there was a change
    const hasChanges = doc.podcasts.some((podcast, index) => 
      podcast._ref !== updatedPodcasts[index]._ref
    );
    
    if (hasChanges) {
      patches.push({
        patch: {
          id: doc._id,
          set: {
            podcasts: updatedPodcasts
          }
        }
      });
    }
  }
  
  return patches;
}

/**
 * Execute patches to update references
 */
async function applyPatches(patches) {
  if (patches.length === 0) {
    return { success: 0, failed: 0 };
  }
  
  let success = 0;
  let failed = 0;
  
  for (const patchInfo of patches) {
    try {
      if (DRY_RUN) {
        console.log(`     DRY RUN: Would update document ${patchInfo.patch.id}`);
        console.log(`       Set:`, JSON.stringify(patchInfo.patch.set, null, 2));
        success++;
      } else {
        await client.patch(patchInfo.patch.id).set(patchInfo.patch.set).commit();
        success++;
      }
    } catch (error) {
      console.error(`     ❌ Failed to update ${patchInfo.patch.id}:`, error.message);
      failed++;
    }
  }
  
  return { success, failed };
}

/**
 * Update all references from oldId to newId
 */
async function updateAllReferences(oldId, newId, podcastTitle = '') {
  console.log(`\n🔄 Updating references: ${oldId} → ${newId}`);
  if (podcastTitle) {
    console.log(`   Podcast: "${podcastTitle}"`);
  }
  
  try {
    // Find all documents that reference the old ID
    const referencingDocs = await findAllReferences(oldId);
    
    if (referencingDocs.length === 0) {
      console.log(`   ✅ No references found for ${oldId}`);
      return { success: 0, failed: 0 };
    }
    
    console.log(`   📎 Found ${referencingDocs.length} documents with references:`);
    
    let totalPatches = [];
    
    for (const doc of referencingDocs) {
      console.log(`      - ${doc._type}: ${doc.title || doc._id}`);
      
      // Generate patches for this document
      const patches = await updateDocumentReferences(doc, oldId, newId);
      totalPatches = totalPatches.concat(patches);
    }
    
    if (totalPatches.length === 0) {
      console.log(`   ⚠️  No updateable references found (may require manual review)`);
      return { success: 0, failed: 0 };
    }
    
    console.log(`   🔧 Applying ${totalPatches.length} patches...`);
    const results = await applyPatches(totalPatches);
    
    console.log(`   ✅ Updated ${results.success} references successfully`);
    if (results.failed > 0) {
      console.log(`   ❌ Failed to update ${results.failed} references`);
    }
    
    return results;
    
  } catch (error) {
    console.error(`   💥 Error updating references for ${oldId}:`, error.message);
    return { success: 0, failed: 1 };
  }
}

/**
 * Process a list of reference updates
 */
async function processReferenceUpdates(updates) {
  console.log(`🚀 Processing ${updates.length} reference updates...\n`);
  
  let totalSuccess = 0;
  let totalFailed = 0;
  
  for (const update of updates) {
    const results = await updateAllReferences(
      update.oldId, 
      update.newId, 
      update.podcastTitle
    );
    
    totalSuccess += results.success;
    totalFailed += results.failed;
  }
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ ${totalSuccess} references updated successfully`);
  console.log(`   ❌ ${totalFailed} references failed to update`);
  
  return { totalSuccess, totalFailed };
}

/**
 * Main function - can be called with reference updates or run interactively
 */
async function main() {
  console.log(`🔄 Podcast Reference Update Script ${DRY_RUN ? '(DRY RUN)' : ''}`);
  console.log('=============================================\n');
  
  // Check for auth token
  const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!token && !DRY_RUN) {
    console.error('❌ SANITY_AUTH_TOKEN or SANITY_API_WRITE_TOKEN environment variable is required.');
    console.log('   Run with --dry-run to see what would be changed.\n');
    process.exit(1);
  }
  
  // Example usage - in practice, this would be called by the main deduplication script
  // with the actual oldId/newId pairs that need updating
  
  // For now, we'll make this a utility that can be imported
  console.log('💡 This script is designed to be used by the deduplication script.');
  console.log('   To use it standalone, modify the script to include specific updates.');
  console.log('   Example format:');
  console.log('   [');
  console.log('     { oldId: "old-podcast-id", newId: "new-podcast-id", podcastTitle: "Title" }');
  console.log('   ]');
}

// Export functions for use by other scripts
module.exports = {
  updateAllReferences,
  processReferenceUpdates,
  findAllReferences
};

// Run standalone if called directly
if (require.main === module) {
  main().catch(console.error);
}