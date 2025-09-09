/**
 * Comprehensive zero-width character cleanup script for Sanity CMS
 * This version properly loads environment variables from .env.local
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client')

console.log('🔧 Environment Variables Check:');
console.log('NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('SANITY_API_WRITE_TOKEN present:', !!process.env.SANITY_API_WRITE_TOKEN);
console.log('SANITY_API_WRITE_TOKEN length:', process.env.SANITY_API_WRITE_TOKEN?.length || 0);

// Initialize Sanity client with proper environment variables
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
});

/**
 * Ultra-comprehensive text sanitization function
 */
function deepSanitizeText(text) {
  if (typeof text !== 'string') return text;
  if (!text) return '';

  return text
    .replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, '')
    .replace(/[\u202A-\u202E]/g, '')
    .replace(/[\u2060-\u2069]/g, '')
    .replace(/[\uFFF9-\uFFFB]/g, '')
    .replace(/[\u180E\u061C\u115F\u1160\u17B4\u17B5\u3164]/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[\u2028\u2029]/g, '')
    .replace(/[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0]/g, '')
    .replace(/&zwnj;|&zwj;|&#x?200[B-F];|&#x?202[A-E];|&#x?206[0-9A-F];|&#x?FEFF;/gi, '')
    .replace(/&#8203;|&#8204;|&#8205;|&#8206;|&#8207;|&#65279;/g, '')
    .normalize('NFC')
    .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '')
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
      const cleanKey = typeof key === 'string' ? deepSanitizeText(key) : key;
      sanitized[cleanKey] = deepSanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Clean amazonPodcast documents only (our main focus)
 */
async function cleanAmazonPodcasts() {
  console.log('\n🧹 Starting zero-width character cleanup for Amazon Podcasts...\n');
  
  try {
    console.log('📡 Fetching Amazon Podcast documents...');
    
    const query = '*[_type == "amazonPodcast"]{...} | order(date desc)';
    const podcasts = await client.fetch(query);
    
    console.log(`Found ${podcasts.length} Amazon Podcast documents\n`);
    
    let processed = 0;
    let changed = 0;
    let failed = 0;
    
    for (const podcast of podcasts) {
      const originalId = podcast._id;
      
      console.log(`Processing: ${originalId}`);
      console.log(`  Title: "${podcast.title?.substring(0, 50)}..."`);
      
      // Deep sanitize the entire document
      const cleaned = deepSanitizeObject(podcast);
      
      // Preserve essential system fields
      cleaned._id = originalId;
      cleaned._type = podcast._type;
      
      // Check if document was actually changed
      const hasChanges = JSON.stringify(cleaned) !== JSON.stringify(podcast);
      
      if (hasChanges) {
        try {
          console.log(`  → Updating document`);
          await client.createOrReplace(cleaned);
          console.log(`  ✅ Successfully updated`);
          changed++;
        } catch (error) {
          console.log(`  ❌ Failed to update: ${error.message}`);
          failed++;
        }
      } else {
        console.log(`  → No changes needed`);
      }
      
      processed++;
      
      // Add delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n=== CLEANUP SUMMARY ===');
    console.log(`📊 Total processed: ${processed}`);
    console.log(`✅ Successfully cleaned: ${changed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success rate: ${Math.round((changed / (changed + failed)) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All Amazon Podcasts cleaned successfully!');
    } else {
      console.log(`\n⚠️  ${failed} documents failed to update (likely permission issues)`);
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Run cleanup
if (require.main === module) {
  cleanAmazonPodcasts();
}

module.exports = { cleanAmazonPodcasts, deepSanitizeText, deepSanitizeObject };