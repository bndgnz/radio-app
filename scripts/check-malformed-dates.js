const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function checkMalformedDates() {
  console.log('=== CHECKING FOR MALFORMED DATES ===\n');
  
  try {
    // Get all podcasts with their raw date values
    const query = `*[_type == "amazonPodcast"]{
      _id,
      title,
      date
    } | order(date desc) [0...20]`;
    
    const podcasts = await client.fetch(query);
    console.log(`Checking first 20 podcasts sorted by date desc:\n`);
    
    let issues = [];
    
    podcasts.forEach((podcast, i) => {
      console.log(`${i + 1}. "${podcast.title}"`);
      console.log(`   Raw date: ${JSON.stringify(podcast.date)} (${typeof podcast.date})`);
      
      if (podcast.date) {
        const jsDate = new Date(podcast.date);
        const isValidDate = !isNaN(jsDate.getTime());
        
        if (isValidDate) {
          console.log(`   ✓ Valid: ${jsDate.toISOString()}`);
          console.log(`   ✓ Year: ${jsDate.getFullYear()}`);
        } else {
          console.log(`   ✗ INVALID DATE!`);
          issues.push({
            id: podcast._id,
            title: podcast.title,
            rawDate: podcast.date,
            issue: 'Invalid date format'
          });
        }
      } else {
        console.log(`   ✗ NULL/UNDEFINED DATE`);
        issues.push({
          id: podcast._id,
          title: podcast.title,
          rawDate: podcast.date,
          issue: 'Null/undefined date'
        });
      }
      console.log('');
    });
    
    if (issues.length > 0) {
      console.log('ISSUES FOUND:');
      console.log('=' .repeat(50));
      issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.title}`);
        console.log(`   ID: ${issue.id}`);
        console.log(`   Raw: ${JSON.stringify(issue.rawDate)}`);
        console.log(`   Issue: ${issue.issue}`);
        console.log('');
      });
    } else {
      console.log('✓ No date format issues found in the first 20 results');
    }
    
    // Check if dates are being stored as strings vs ISO dates
    console.log('=== DATE FORMAT ANALYSIS ===');
    const formatQuery = `*[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...10]{
      date
    }`;
    
    const dateFormats = await client.fetch(formatQuery);
    const formats = {};
    
    dateFormats.forEach(doc => {
      const dateStr = doc.date.toString();
      if (dateStr.includes('T')) {
        formats['ISO DateTime'] = (formats['ISO DateTime'] || 0) + 1;
      } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        formats['Date Only YYYY-MM-DD'] = (formats['Date Only YYYY-MM-DD'] || 0) + 1;
      } else {
        formats['Other format'] = (formats['Other format'] || 0) + 1;
      }
    });
    
    console.log('Date formats found:');
    Object.entries(formats).forEach(([format, count]) => {
      console.log(`  ${format}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
checkMalformedDates();