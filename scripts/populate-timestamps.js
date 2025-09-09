const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function populateTimestamps() {
  console.log('=== POPULATING TIMESTAMP FIELDS ===\n');
  
  try {
    // Get all podcasts that don't have the timestamp fields populated
    const query = `*[_type == "amazonPodcast" && (!defined(createdAt) || !defined(updatedAt))]{
      _id,
      title,
      _createdAt,
      _updatedAt,
      createdAt,
      updatedAt
    }`;
    
    const podcasts = await client.fetch(query);
    console.log(`Found ${podcasts.length} podcasts that need timestamp fields populated`);
    
    if (podcasts.length === 0) {
      console.log('✓ All podcasts already have timestamp fields');
      return;
    }
    
    console.log('Updating podcasts...\n');
    
    // Update in batches
    const batchSize = 50;
    for (let i = 0; i < podcasts.length; i += batchSize) {
      const batch = podcasts.slice(i, i + batchSize);
      
      const transaction = client.transaction();
      batch.forEach(podcast => {
        transaction.patch(podcast._id, {
          set: {
            createdAt: podcast._createdAt,
            updatedAt: podcast._updatedAt
          }
        });
      });
      
      await transaction.commit();
      
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(podcasts.length / batchSize);
      console.log(`✓ Updated batch ${batchNum}/${totalBatches} (${batch.length} podcasts)`);
    }
    
    console.log(`\\n✓ Successfully populated timestamp fields for ${podcasts.length} podcasts`);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
populateTimestamps();