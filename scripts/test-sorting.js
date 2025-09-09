const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function checkSorting() {
  console.log('Testing Amazon Podcast sorting...\n');
  
  // Test descending order (newest first)
  const descQuery = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...10]{
    title,
    date,
    _createdAt
  }`;
  
  const descPodcasts = await client.fetch(descQuery);
  
  console.log('Top 10 podcasts by date (DESCENDING - newest first):');
  console.log('=' .repeat(80));
  descPodcasts.forEach((p, i) => {
    const date = new Date(p.date);
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Date: ${date.toLocaleDateString()} (${p.date})`);
  });
  
  console.log('\n' + '=' .repeat(80));
  
  // Test ascending order (oldest first)
  const ascQuery = `*[_type == "amazonPodcast" && defined(date)] | order(date asc) [0...10]{
    title,
    date
  }`;
  
  const ascPodcasts = await client.fetch(ascQuery);
  
  console.log('\nTop 10 podcasts by date (ASCENDING - oldest first):');
  console.log('=' .repeat(80));
  ascPodcasts.forEach((p, i) => {
    const date = new Date(p.date);
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Date: ${date.toLocaleDateString()} (${p.date})`);
  });
}

checkSorting().catch(console.error);