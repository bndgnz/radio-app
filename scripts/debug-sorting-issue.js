const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function debugSortingIssue() {
  console.log('=== DEBUGGING SORTING ISSUE ===\n');
  
  try {
    // Get podcasts sorted by date desc (what should be newest first)
    const descQuery = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...10]{
      _id,
      title,
      date
    }`;
    
    console.log('GROQ Query: ORDER BY date DESC (should be newest first)');
    console.log('=' .repeat(70));
    const descPodcasts = await client.fetch(descQuery);
    
    descPodcasts.forEach((podcast, i) => {
      const jsDate = new Date(podcast.date);
      const isoString = podcast.date;
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Raw date: ${isoString}`);
      console.log(`   Parsed: ${jsDate.toLocaleString()}`);
      console.log(`   US Format: ${jsDate.toLocaleDateString('en-US')}`);
      console.log(`   ISO Format: ${jsDate.toISOString()}`);
      console.log('');
    });
    
    // Check what Studio ordering should be seeing
    console.log('\n=== WHAT STUDIO SEES ===');
    console.log('Checking raw date values for comparison...\n');
    
    // Get some specific problematic dates
    const problemQuery = `*[_type == "amazonPodcast" && date match "*2009*"] | order(date desc) [0...5]{
      _id,
      title,
      date,
      _createdAt
    }`;
    
    const problemPodcasts = await client.fetch(problemQuery);
    console.log('Podcasts with 2009 dates:');
    problemPodcasts.forEach((podcast, i) => {
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Date: ${podcast.date}`);
      console.log(`   Date as object: ${JSON.stringify(new Date(podcast.date))}`);
      console.log(`   Created: ${podcast._createdAt}`);
      console.log('');
    });
    
    // Check the actual newest podcasts
    const newestQuery = `*[_type == "amazonPodcast" && defined(date)] | order(_createdAt desc) [0...5]{
      _id,
      title,
      date,
      _createdAt
    }`;
    
    console.log('Actually newest podcasts (by _createdAt):');
    const newestPodcasts = await client.fetch(newestQuery);
    newestPodcasts.forEach((podcast, i) => {
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
debugSortingIssue();