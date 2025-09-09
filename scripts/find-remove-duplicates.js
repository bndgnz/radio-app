const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

async function findAndRemoveDuplicates() {
  console.log('=== FINDING AND REMOVING DUPLICATES ===\n');
  
  try {
    // Find all podcasts and group by title
    const query = `*[_type == "amazonPodcast"]{
      _id,
      title,
      date,
      _createdAt
    }`;
    
    const podcasts = await client.fetch(query);
    console.log(`Total podcasts found: ${podcasts.length}`);
    
    // Group by title to find duplicates
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
    
    console.log(`\nFound ${duplicates.length} duplicate titles:`);
    
    const toDelete = [];
    
    duplicates.forEach(duplicate => {
      console.log(`\n"${duplicate.title}" has ${duplicate.podcasts.length} copies:`);
      
      // Sort by _createdAt to keep the oldest one
      duplicate.podcasts.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
      
      duplicate.podcasts.forEach((podcast, i) => {
        const createdDate = new Date(podcast._createdAt).toLocaleString();
        console.log(`  ${i + 1}. ID: ${podcast._id} (Created: ${createdDate})`);
        
        // Mark all but the first (oldest) for deletion
        if (i > 0) {
          toDelete.push(podcast._id);
        }
      });
    });
    
    console.log(`\n=== DELETION PLAN ===`);
    console.log(`Will delete ${toDelete.length} duplicate podcasts (keeping oldest of each)`);
    
    if (toDelete.length > 0) {
      console.log('\nDeleting duplicates...');
      
      // Delete in batches
      const batchSize = 10;
      for (let i = 0; i < toDelete.length; i += batchSize) {
        const batch = toDelete.slice(i, i + batchSize);
        const transaction = client.transaction();
        
        batch.forEach(id => {
          transaction.delete(id);
        });
        
        await transaction.commit();
        console.log(`✓ Deleted batch ${Math.ceil((i + 1) / batchSize)}/${Math.ceil(toDelete.length / batchSize)}`);
      }
      
      console.log(`\n✓ Successfully deleted ${toDelete.length} duplicate podcasts`);
    } else {
      console.log('\n✓ No duplicates found to delete');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
findAndRemoveDuplicates();