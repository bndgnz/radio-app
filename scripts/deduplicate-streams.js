const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2023-01-01'
});

async function deduplicateStreams() {
  try {
    console.log('🔍 Finding duplicate stream documents...');
    
    // Get all stream documents
    const allStreams = await client.fetch(`
      *[_type == "stream"] {
        _id,
        title,
        url,
        playingNow,
        _createdAt
      }
    `);

    console.log(`Found ${allStreams.length} stream documents`);

    // Group streams by title and URL
    const streamGroups = {};
    allStreams.forEach(stream => {
      const key = `${stream.title}-${stream.url}`;
      if (!streamGroups[key]) {
        streamGroups[key] = [];
      }
      streamGroups[key].push(stream);
    });

    // Find duplicates
    const duplicateGroups = Object.values(streamGroups).filter(group => group.length > 1);
    
    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicate streams found');
      return;
    }

    console.log(`🔧 Found ${duplicateGroups.length} duplicate stream groups`);
    
    for (const group of duplicateGroups) {
      console.log(`\n📻 Processing duplicate group: "${group[0].title}"`);
      
      // Sort by creation date (keep the oldest)
      group.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
      const keepStream = group[0];
      const duplicatesToRemove = group.slice(1);
      
      console.log(`   ✅ Keeping: ${keepStream._id} (created: ${keepStream._createdAt})`);
      
      for (const duplicate of duplicatesToRemove) {
        console.log(`   🗑️  Removing: ${duplicate._id} (created: ${duplicate._createdAt})`);
        
        // Check for any references to this duplicate stream before deleting
        const references = await client.fetch(`
          *[references($duplicateId)] {
            _id,
            _type,
            title
          }
        `, { duplicateId: duplicate._id });
        
        if (references.length > 0) {
          console.log(`   🔗 Found ${references.length} references to duplicate stream:`);
          references.forEach(ref => {
            console.log(`      - ${ref._type}: ${ref.title || ref._id}`);
          });
          
          console.log(`   ⚠️  Cannot safely delete ${duplicate._id} - it has references. Skipping deletion.`);
          console.log(`   💡 Manual intervention required to update references and delete duplicate.`);
          continue;
        }
        
        // Delete the duplicate
        await client.delete(duplicate._id);
        console.log(`   ✅ Deleted duplicate stream: ${duplicate._id}`);
      }
    }
    
    console.log('\n🎉 Stream deduplication completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during stream deduplication:', error);
  }
}

// Recursively update stream references in a document
function updateStreamReferences(obj, oldId, newId) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => updateStreamReferences(item, oldId, newId));
  }
  
  const updated = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === '_ref' && value === oldId) {
      updated[key] = newId;
    } else if (key === '_id' && value === oldId) {
      updated[key] = newId;
    } else {
      updated[key] = updateStreamReferences(value, oldId, newId);
    }
  }
  
  return updated;
}

deduplicateStreams();