const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function testDateFormats() {
  console.log('=== TESTING DATE FORMATS ===\n');
  
  try {
    // Get first 5 podcasts with all date fields
    const query = `*[_type == "amazonPodcast"] | order(date desc) [0...5]{
      _id,
      title,
      date,
      _createdAt,
      _updatedAt
    }`;
    
    const podcasts = await client.fetch(query);
    console.log(`Found ${podcasts.length} podcasts:\n`);
    
    podcasts.forEach((podcast, i) => {
      console.log(`${i + 1}. "${podcast.title}"`);
      console.log(`   Date: ${podcast.date} (${typeof podcast.date})`);
      console.log(`   Created: ${podcast._createdAt} (${typeof podcast._createdAt})`);
      console.log(`   Updated: ${podcast._updatedAt} (${typeof podcast._updatedAt})`);
      
      // Test parsing dates
      try {
        const dateObj = new Date(podcast.date);
        const createdObj = new Date(podcast._createdAt);
        console.log(`   Parsed Date: ${dateObj.toLocaleString()}`);
        console.log(`   Parsed Created: ${createdObj.toLocaleString()}`);
      } catch (err) {
        console.log(`   Error parsing dates: ${err.message}`);
      }
      console.log('');
    });
    
    // Test sorting query
    console.log('=== TESTING SORTING ===');
    const sortQuery = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...10]{
      title,
      date
    }`;
    
    const sorted = await client.fetch(sortQuery);
    console.log('\nTop 10 by date (desc):');
    sorted.forEach((p, i) => {
      const dateStr = new Date(p.date).toLocaleDateString();
      console.log(`${i + 1}. ${dateStr} - ${p.title}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
testDateFormats();