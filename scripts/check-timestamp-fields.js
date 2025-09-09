const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function checkTimestampFields() {
  console.log('=== CHECKING TIMESTAMP FIELDS ===\n');
  
  try {
    // Get a few recent podcasts to check the fields
    const query = `*[_type == "amazonPodcast"] | order(_createdAt desc) [0...3]{
      _id,
      title,
      date,
      _createdAt,
      _updatedAt,
      createdAt,
      updatedAt
    }`;
    
    const podcasts = await client.fetch(query);
    console.log(`Checking timestamp fields on ${podcasts.length} recent podcasts:\n`);
    
    podcasts.forEach((podcast, i) => {
      console.log(`${i + 1}. "${podcast.title}"`);
      console.log(`   Date: ${podcast.date}`);
      console.log(`   System _createdAt: ${podcast._createdAt}`);
      console.log(`   System _updatedAt: ${podcast._updatedAt}`);
      console.log(`   Custom createdAt: ${podcast.createdAt || 'MISSING'}`);
      console.log(`   Custom updatedAt: ${podcast.updatedAt || 'MISSING'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
checkTimestampFields();