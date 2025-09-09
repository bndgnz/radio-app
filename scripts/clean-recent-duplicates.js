const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function cleanRecentDuplicates() {
  console.log('=== CLEANING RECENT DUPLICATES ===\n');
  
  try {
    // Find all August 2025 podcasts that have duplicates
    const query = `*[_type == "amazonPodcast" && date >= "2025-08-01"]{
      _id,
      title,
      date,
      _createdAt
    } | order(date desc, title asc)`;
    
    const podcasts = await client.fetch(query);
    console.log(`Found ${podcasts.length} August 2025 podcasts`);
    
    // Group by title
    const titleGroups = {};
    podcasts.forEach(podcast => {
      const title = podcast.title;
      if (!titleGroups[title]) {
        titleGroups[title] = [];
      }
      titleGroups[title].push(podcast);
    });
    
    // Find duplicates
    const duplicates = [];
    Object.entries(titleGroups).forEach(([title, group]) => {
      if (group.length > 1) {
        duplicates.push({ title, podcasts: group });
      }
    });
    
    console.log(`\nFound ${duplicates.length} duplicate titles in August 2025:`);
    
    const toDelete = [];
    
    duplicates.forEach(duplicate => {
      console.log(`\n"${duplicate.title}" has ${duplicate.podcasts.length} copies:`);
      
      let keepIndex = -1;
      duplicate.podcasts.forEach((podcast, i) => {
        const createdDate = new Date(podcast._createdAt).toLocaleString();
        const isAmazonPodcastId = podcast._id.startsWith('amazonPodcast-');
        console.log(`  ${i + 1}. ID: ${podcast._id} (${isAmazonPodcastId ? 'NEW' : 'OLD'}) (Created: ${createdDate})`);
        
        // Prefer keeping the amazonPodcast- prefixed IDs (newer migration format)
        if (isAmazonPodcastId && keepIndex === -1) {
          keepIndex = i;
        }
      });
      
      // If no amazonPodcast- ID found, keep the first one
      if (keepIndex === -1) {
        keepIndex = 0;
      }
      
      console.log(`  -> Keeping: ${duplicate.podcasts[keepIndex]._id}`);
      
      // Mark all others for deletion
      duplicate.podcasts.forEach((podcast, i) => {
        if (i !== keepIndex) {
          toDelete.push(podcast._id);
        }
      });
    });
    
    console.log(`\n=== DELETION PLAN ===`);
    console.log(`Will delete ${toDelete.length} duplicate podcasts`);
    
    if (toDelete.length > 0) {
      console.log('\nDeleting duplicates...');
      
      for (const id of toDelete) {
        try {
          await client.delete(id);
          console.log(`✓ Deleted ${id}`);
        } catch (error) {
          console.log(`⚠ Could not delete ${id}: ${error.message}`);
        }
      }
      
      console.log(`\n✓ Completed deletion process`);
    } else {
      console.log('\n✓ No duplicates found to delete');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
cleanRecentDuplicates();