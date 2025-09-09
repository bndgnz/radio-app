const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function verifyContentfulMatch() {
  console.log('=== VERIFYING SANITY MATCHES CONTENTFUL ORDER ===\n');
  
  try {
    // Get the exact same order that should match Contentful
    const query = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...20]{
      title,
      date,
      description
    }`;
    
    const sanityResults = await client.fetch(query);
    
    console.log('SANITY ORDER (by date desc - should match Contentful):');
    console.log('=' .repeat(80));
    
    sanityResults.forEach((podcast, i) => {
      const dateObj = new Date(podcast.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      console.log(`${i + 1}. ${podcast.title}`);
      console.log(`   Date: ${formattedDate} (${podcast.date})`);
      if (podcast.description) {
        const desc = typeof podcast.description === 'string' 
          ? podcast.description.substring(0, 80) + '...'
          : 'Rich text description';
        console.log(`   Description: ${desc}`);
      }
      console.log('');
    });
    
    // Verify the top ones match Contentful exactly
    const expectedOrder = [
      'Josie Heap Rainer Local Board Candidate Interview 2025',
      'Genevieve Sage: Waitematā/Gulf Islands Council Candidate Interview 2025', 
      'Wayne McIntosh Local Board Candidate Interview 2025',
      'Grant Crawford Local Board Candidate Interview 2025',
      'Mayoral Candidate Kerrin Leoni Interview'
    ];
    
    console.log('\\n=== VERIFICATION AGAINST CONTENTFUL ===');
    let matches = 0;
    expectedOrder.forEach((expectedTitle, i) => {
      const sanityTitle = sanityResults[i]?.title || 'NOT FOUND';
      const match = sanityTitle.includes(expectedTitle.split(' ').slice(0, 3).join(' '));
      console.log(`${i + 1}. ${match ? '✓' : '✗'} Expected: ${expectedTitle}`);
      console.log(`   Got: ${sanityTitle}`);
      if (match) matches++;
    });
    
    console.log(`\\nRESULT: ${matches}/${expectedOrder.length} matches with Contentful order`);
    
    if (matches === expectedOrder.length) {
      console.log('\\n🎉 SUCCESS: Sanity data order matches Contentful perfectly!');
      console.log('If Studio UI still shows wrong order, it is a UI caching issue.');
      console.log('Try: Hard refresh (Ctrl+F5) or clear browser cache');
    } else {
      console.log('\\n⚠ MISMATCH: Sanity data does not match Contentful order');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
verifyContentfulMatch();