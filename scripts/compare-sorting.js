require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('contentful');
const sanityClient = require('@sanity/client').createClient;

// Contentful client
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// Sanity client
const sanity = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function compareSorting() {
  console.log('=== COMPARING CONTENTFUL VS SANITY SORTING ===\n');
  
  try {
    // Get latest 15 from Contentful sorted by date desc
    console.log('Fetching from Contentful (sorted by date desc)...');
    const contentfulResponse = await contentfulClient.getEntries({
      content_type: 'amazonPodcast',
      order: '-fields.date', // Descending by date
      limit: 15,
    });
    
    console.log('\nCONTENTFUL TOP 15 (by date desc):');
    console.log('=' .repeat(80));
    contentfulResponse.items.forEach((entry, i) => {
      const date = entry.fields.date ? new Date(entry.fields.date) : null;
      console.log(`${i + 1}. ${entry.fields.title}`);
      console.log(`   Date: ${date ? date.toLocaleDateString() : 'No date'} (${entry.fields.date || 'null'})`);
      console.log(`   Contentful ID: ${entry.sys.id}`);
    });
    
    // Get latest 15 from Sanity sorted by date desc
    console.log('\n\nFetching from Sanity (sorted by date desc)...');
    const sanityPodcasts = await sanity.fetch(`
      *[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...15]{
        title,
        date,
        _id
      }
    `);
    
    console.log('\nSANITY TOP 15 (by date desc):');
    console.log('=' .repeat(80));
    sanityPodcasts.forEach((podcast, i) => {
      const date = new Date(podcast.date);
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Date: ${date.toLocaleDateString()} (${podcast.date})`);
      console.log(`   Sanity ID: ${podcast._id}`);
    });
    
    // Compare the first 10 titles
    console.log('\n\n=== COMPARISON ===');
    console.log('Checking if the first 10 titles match...\n');
    
    const contentfulTitles = contentfulResponse.items.slice(0, 10).map(item => item.fields.title);
    const sanityTitles = sanityPodcasts.slice(0, 10).map(item => item.title);
    
    let matches = 0;
    for (let i = 0; i < 10; i++) {
      const contentfulTitle = contentfulTitles[i] || 'N/A';
      const sanityTitle = sanityTitles[i] || 'N/A';
      const match = contentfulTitle === sanityTitle ? '✓' : '✗';
      
      console.log(`${i + 1}. ${match} ${contentfulTitle === sanityTitle ? 'MATCH' : 'DIFFERENT'}`);
      console.log(`   Contentful: "${contentfulTitle}"`);
      console.log(`   Sanity: "${sanityTitle}"`);
      
      if (contentfulTitle === sanityTitle) matches++;
    }
    
    console.log(`\nRESULT: ${matches}/10 titles match in the same order`);
    
    if (matches < 8) {
      console.log('\n⚠ SORTING ISSUE DETECTED - Orders do not match!');
    } else {
      console.log('\n✓ Sorting appears to be working correctly');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the comparison
compareSorting();