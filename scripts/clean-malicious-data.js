/**
 * SECURITY CLEANUP SCRIPT
 * This script cleans malicious zero-width characters from Sanity CMS data
 * Run with: node scripts/clean-malicious-data.js
 */

const { createClient } = require('@sanity/client');

// Load environment variables
require('dotenv').config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false
});

/**
 * Remove zero-width characters and other potentially malicious Unicode characters
 */
function removeZeroWidthCharacters(input) {
  if (!input || typeof input !== 'string') return input;
  
  // Remove various zero-width and invisible characters
  return input.replace(/[\u200B-\u200D\uFEFF\u00AD\u061C\u2060\u2061\u2062\u2063\u2064\u2065\u2066\u2067\u2068\u2069]/g, '');
}

/**
 * Recursively clean an object of malicious characters
 */
function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? removeZeroWidthCharacters(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = removeZeroWidthCharacters(key);
    cleaned[cleanKey] = cleanObject(value);
  }
  
  return cleaned;
}

async function cleanAllDocuments() {
  try {
    console.log('🔍 Scanning for documents with potential malicious characters...');
    
    // Query all documents that might contain text fields
    const query = '*[defined(_id) && !(_id in path("drafts.**"))]';
    const documents = await client.fetch(query);
    
    console.log(`📄 Found ${documents.length} documents to check`);
    
    let cleanedCount = 0;
    let documentsWithIssues = [];
    
    for (const doc of documents) {
      const cleaned = cleanObject(doc);
      const originalString = JSON.stringify(doc);
      const cleanedString = JSON.stringify(cleaned);
      
      if (originalString !== cleanedString) {
        console.log(`🧹 Cleaning document: ${doc._id} (${doc._type})`);
        documentsWithIssues.push({
          id: doc._id,
          type: doc._type,
          originalLength: originalString.length,
          cleanedLength: cleanedString.length,
          removedChars: originalString.length - cleanedString.length
        });
        
        // Update the document
        try {
          await client.createOrReplace(cleaned);
          cleanedCount++;
          console.log(`✅ Successfully cleaned: ${doc._id}`);
        } catch (error) {
          console.error(`❌ Failed to clean ${doc._id}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Cleanup Summary:');
    console.log(`📊 Documents scanned: ${documents.length}`);
    console.log(`🧹 Documents cleaned: ${cleanedCount}`);
    console.log(`⚠️  Documents with issues found: ${documentsWithIssues.length}`);
    
    if (documentsWithIssues.length > 0) {
      console.log('\n📋 Documents that had malicious characters removed:');
      documentsWithIssues.forEach(doc => {
        console.log(`  - ${doc.type}: ${doc.id} (removed ${doc.removedChars} characters)`);
      });
    }
    
    if (cleanedCount === 0) {
      console.log('✨ Great! No malicious characters found in your content.');
    } else {
      console.log(`\n⚠️  IMPORTANT: ${cleanedCount} documents were cleaned. Please review your content to ensure everything displays correctly.`);
    }
    
  } catch (error) {
    console.error('💥 Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
  cleanAllDocuments().then(() => {
    console.log('\n🔒 Security cleanup completed!');
    process.exit(0);
  });
}

module.exports = { cleanAllDocuments, removeZeroWidthCharacters };