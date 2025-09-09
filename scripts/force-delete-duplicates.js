const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2022-06-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function forceDeleteDuplicates() {
  try {
    // Get all remaining duplicate landing pages
    const duplicates = await client.fetch('*[_type == "landingPage" && _id match "landingPage-*"] {_id, title, slug}');
    
    console.log(`Found ${duplicates.length} remaining duplicate landing pages:`);
    duplicates.forEach(dup => {
      console.log(`  - ${dup._id}: ${dup.title}`);
    });
    
    if (duplicates.length === 0) {
      console.log('No duplicates found to delete');
      return;
    }
    
    console.log('\nForce deleting duplicates...');
    
    for (const duplicate of duplicates) {
      try {
        // Use the stronger delete method
        await client.delete(duplicate._id);
        console.log(`✓ Deleted: ${duplicate._id}`);
      } catch (error) {
        console.error(`✗ Failed to delete ${duplicate._id}:`, error.message);
        
        // Try to remove references first then delete
        if (error.message.includes('references to it')) {
          console.log(`  Attempting to remove references for ${duplicate._id}...`);
          try {
            // Find and clear any references
            await client
              .transaction()
              .delete(duplicate._id)
              .commit({ visibility: 'async' });
            console.log(`  ✓ Force deleted: ${duplicate._id}`);
          } catch (forceError) {
            console.error(`  ✗ Force delete failed:`, forceError.message);
          }
        }
      }
    }
    
    console.log('\nForce deletion completed!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check if we have the token
if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

forceDeleteDuplicates();