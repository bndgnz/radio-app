const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function verifyJosieHeapSorting() {
  console.log('=== VERIFYING JOSIE HEAP SORTING ===\n');
  
  try {
    // Find the Josie Heap podcast specifically
    const josieQuery = `*[_type == "amazonPodcast" && title match "*Josie Heap*"]{
      _id,
      title,
      date,
      _createdAt,
      _updatedAt
    }`;
    
    const josieResults = await client.fetch(josieQuery);
    console.log('Josie Heap podcast(s):');
    josieResults.forEach((podcast, i) => {
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Date: ${podcast.date}`);
      console.log(`   Created: ${podcast._createdAt}`);
      console.log(`   Updated: ${podcast._updatedAt}`);
      console.log('');
    });
    
    // Find the Navigator podcast you mentioned
    const navigatorQuery = `*[_type == "amazonPodcast" && title match "*Navigator*Waiheke Peace*"]{
      _id,
      title,
      date,
      _createdAt,
      _updatedAt
    }`;
    
    const navigatorResults = await client.fetch(navigatorQuery);
    console.log('Navigator/Peace Group podcast(s):');
    navigatorResults.forEach((podcast, i) => {
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Date: ${podcast.date}`);
      console.log(`   Created: ${podcast._createdAt}`);
      console.log(`   Updated: ${podcast._updatedAt}`);
      console.log('');
    });
    
    // Get what should be the first result (newest by date)
    const newestQuery = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...5]{
      _id,
      title,
      date,
      _createdAt
    }`;
    
    console.log('What SHOULD be shown first (GROQ order by date desc):');
    const newestResults = await client.fetch(newestQuery);
    newestResults.forEach((podcast, i) => {
      const dateObj = new Date(podcast.date);
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Date: ${podcast.date} (${dateObj.toLocaleDateString()})`);
      console.log(`   Created: ${podcast._createdAt}`);
      console.log('');
    });
    
    // Check if there are any podcasts with null dates that might be interfering
    const nullDateQuery = `*[_type == "amazonPodcast" && !defined(date)]{
      _id,
      title,
      date,
      _createdAt
    } | order(_createdAt desc) [0...5]`;
    
    const nullResults = await client.fetch(nullDateQuery);
    console.log(`Podcasts with NULL dates (${nullResults.length} found):`);
    nullResults.forEach((podcast, i) => {
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Date: ${podcast.date}`);
      console.log(`   Created: ${podcast._createdAt}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
verifyJosieHeapSorting();