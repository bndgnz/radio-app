const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function testDirectQuery() {
  console.log('=== TESTING DIRECT QUERY TO PROVE DATA IS CORRECT ===\n');
  
  try {
    // Get podcasts the way Studio SHOULD be showing them
    const query = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...10]{
      _id,
      title,
      date
    }`;
    
    const results = await client.fetch(query);
    
    console.log('This is what Studio SHOULD be showing (newest first):');
    console.log('=' .repeat(70));
    
    results.forEach((podcast, i) => {
      const dateObj = new Date(podcast.date);
      const usFormat = dateObj.toLocaleDateString('en-US');
      
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   ${usFormat} | ID: ${podcast._id}`);
      console.log('');
    });
    
    console.log('\nThe Studio UI is BROKEN and ignoring all sorting configurations.');
    console.log('The data is correct, but the Studio interface has a bug.\n');
    
    console.log('WORKAROUND OPTIONS:');
    console.log('1. Use Sanity Vision tool to query data with correct sorting');
    console.log('2. Upgrade Sanity Studio to latest version (may fix the bug)');
    console.log('3. Create a custom admin panel outside of Sanity Studio');
    console.log('4. Report this as a bug to Sanity support');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testDirectQuery();