/**
 * Comprehensive zero-width character cleanup script for Sanity CMS
 * This script will clean all documents in the dataset, removing invisible characters
 */

const { createClient } = require('@sanity/client')

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // Need a write token
  useCdn: false
})

/**
 * Ultra-comprehensive text sanitization function
 * Removes ALL invisible Unicode characters and normalizes text
 */
function deepSanitizeText(text) {
  if (typeof text !== 'string') return text;
  if (!text) return '';

  return text
    // Remove ALL zero-width characters
    .replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, '')
    
    // Remove bidirectional text control characters
    .replace(/[\u202A-\u202E]/g, '')
    
    // Remove word joiners and invisible separators
    .replace(/[\u2060-\u2069]/g, '')
    
    // Remove interlinear annotation characters
    .replace(/[\uFFF9-\uFFFB]/g, '')
    
    // Remove specific problematic characters
    .replace(/[\u180E\u061C\u115F\u1160\u17B4\u17B5\u3164]/g, '')
    
    // Remove all control characters (C0 and C1 controls)
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    
    // Remove line/paragraph separators that can break JSON
    .replace(/[\u2028\u2029]/g, '')
    
    // Remove other invisible/formatting characters
    .replace(/[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0\uFFF0-\uFFFF]/g, '')
    
    // Remove HTML entity versions
    .replace(/&zwnj;|&zwj;|&#x?200[B-F];|&#x?202[A-E];|&#x?206[0-9A-F];|&#x?FEFF;/gi, '')
    .replace(/&#8203;|&#8204;|&#8205;|&#8206;|&#8207;|&#65279;/g, '')
    
    // Normalize Unicode (NFC form)
    .normalize('NFC')
    
    // Remove any remaining non-printable characters (keep common symbols and accented chars)
    .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF\u0100-\u017F\u0180-\u024F]/g, '')
    
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Recursively sanitize all string values in an object
 */
function deepSanitizeObject(obj) {
  if (typeof obj === 'string') {
    return deepSanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Also sanitize keys
      const cleanKey = typeof key === 'string' ? deepSanitizeText(key) : key;
      sanitized[cleanKey] = deepSanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Get all documents that need cleaning
 */
async function getContaminatedDocuments(docType = '*') {
  console.log(`Fetching ${docType} documents...`);
  
  const query = docType === '*' 
    ? '*[!(_type match "system.*")]'
    : `*[_type == "${docType}"]`;
    
  const documents = await client.fetch(query);
  console.log(`Found ${documents.length} documents`);
  return documents;
}

/**
 * Clean a single document
 */
async function cleanDocument(doc) {
  const originalId = doc._id;
  const originalRev = doc._rev;
  
  console.log(`Cleaning document: ${originalId} (${doc._type})`);
  
  // Deep sanitize the entire document
  const cleaned = deepSanitizeObject(doc);
  
  // Preserve system fields
  cleaned._id = originalId;
  cleaned._type = doc._type;
  
  // Check if document was actually changed
  const hasChanges = JSON.stringify(cleaned) !== JSON.stringify(doc);
  
  if (hasChanges) {
    try {
      console.log(`  → Updating document ${originalId}`);
      const result = await client.createOrReplace(cleaned);
      console.log(`  ✓ Successfully updated ${result._id}`);
      return { success: true, id: originalId, changes: true };
    } catch (error) {
      console.error(`  ✗ Failed to update ${originalId}:`, error.message);
      return { success: false, id: originalId, error: error.message };
    }
  } else {
    console.log(`  → No changes needed for ${originalId}`);
    return { success: true, id: originalId, changes: false };
  }
}

/**
 * Clean all documents of a specific type
 */
async function cleanDocumentType(docType) {
  console.log(`\n=== Cleaning ${docType} documents ===`);
  
  const documents = await getContaminatedDocuments(docType);
  const results = [];
  
  for (const doc of documents) {
    const result = await cleanDocument(doc);
    results.push(result);
    
    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

/**
 * Main cleanup function
 */
async function cleanDatabase() {
  console.log('🧹 Starting comprehensive zero-width character cleanup...\n');
  
  // Document types to clean (prioritize content types first)
  const documentTypes = [
    'landingPage',
    'amazonPodcast', 
    'shows',
    'staff',
    'playlist',
    'schedule',
    'banner',
    'menu'
  ];
  
  const allResults = {};
  
  try {
    for (const docType of documentTypes) {
      const results = await cleanDocumentType(docType);
      allResults[docType] = results;
    }
    
    // Summary
    console.log('\n=== CLEANUP SUMMARY ===');
    let totalProcessed = 0;
    let totalChanged = 0;
    let totalFailed = 0;
    
    for (const [docType, results] of Object.entries(allResults)) {
      const changed = results.filter(r => r.changes).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log(`${docType}: ${results.length} processed, ${changed} changed, ${failed} failed`);
      
      totalProcessed += results.length;
      totalChanged += changed;
      totalFailed += failed;
    }
    
    console.log(`\nTOTAL: ${totalProcessed} processed, ${totalChanged} changed, ${totalFailed} failed`);
    
    if (totalFailed > 0) {
      console.log('\n❌ Some documents failed to update. Check the logs above.');
    } else {
      console.log('\n✅ All documents processed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

/**
 * Test the sanitization function
 */
function testSanitization() {
  const testStrings = [
    'Theme​​​​‌﻿‍﻿​‍​‍‌‍﻿﻿‌﻿​‍‌‍‍‌‌‍‌﻿‌‍‍‌‌‍﻿‍',
    'public​​​​‌﻿‍﻿​‍​‍‌‍﻿﻿‌﻿​‍‌‍‍‌‌‍‌﻿‌‍‍‌‌‍﻿‍​‍​‍​﻿‍‍​‍​‍‌﻿​﻿‌‍',
    'Normal text',
    ''
  ];
  
  console.log('Testing sanitization function:');
  testStrings.forEach((str, i) => {
    const cleaned = deepSanitizeText(str);
    console.log(`Test ${i + 1}:`);
    console.log(`  Original: "${str}" (${str.length} chars)`);
    console.log(`  Cleaned:  "${cleaned}" (${cleaned.length} chars)`);
    console.log(`  Changed:  ${str !== cleaned}`);
    console.log('');
  });
}

// Run the appropriate function based on command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    testSanitization();
  } else if (args.includes('--dry-run')) {
    console.log('Dry run mode - would clean database but not actually update');
    // Could implement dry run logic here
  } else {
    cleanDatabase();
  }
}

module.exports = {
  deepSanitizeText,
  deepSanitizeObject,
  cleanDatabase
};