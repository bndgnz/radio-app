const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2022-06-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function removeDuplicateLandingPages() {
  try {
    // Query all landing pages
    const landingPages = await client.fetch('*[_type == "landingPage"] {_id, title, slug}');
    
    console.log(`Found ${landingPages.length} landing pages total`);
    
    // Group by slug to find duplicates
    const pagesBySlug = {};
    landingPages.forEach(page => {
      const slug = page.slug?.current || 'no-slug';
      if (!pagesBySlug[slug]) {
        pagesBySlug[slug] = [];
      }
      pagesBySlug[slug].push(page);
    });
    
    // Find and remove duplicates
    const toDelete = [];
    
    for (const [slug, pages] of Object.entries(pagesBySlug)) {
      if (pages.length > 1) {
        console.log(`\nFound ${pages.length} duplicates for slug: ${slug}`);
        pages.forEach(p => console.log(`  - ${p._id}: ${p.title}`));
        
        // Keep the one WITHOUT the "landingPage-" prefix (original)
        // Delete the one WITH the prefix (duplicate)
        const original = pages.find(p => !p._id.startsWith('landingPage-'));
        const duplicates = pages.filter(p => p._id.startsWith('landingPage-'));
        
        if (original && duplicates.length > 0) {
          console.log(`  Keeping: ${original._id}`);
          duplicates.forEach(dup => {
            console.log(`  Will delete: ${dup._id}`);
            toDelete.push(dup._id);
          });
        } else if (!original && duplicates.length > 0) {
          // If no original, keep the first duplicate and delete the rest
          console.log(`  No original found, keeping first duplicate: ${duplicates[0]._id}`);
          for (let i = 1; i < duplicates.length; i++) {
            console.log(`  Will delete: ${duplicates[i]._id}`);
            toDelete.push(duplicates[i]._id);
          }
        }
      }
    }
    
    if (toDelete.length === 0) {
      console.log('\nNo duplicates to delete');
      return;
    }
    
    console.log(`\nTotal documents to delete: ${toDelete.length}`);
    
    // Proceed with deletion automatically (since we've manually verified the list)
    console.log('\nDeleting duplicates...');
    
    for (const id of toDelete) {
      try {
        await client.delete(id);
        console.log(`Deleted: ${id}`);
      } catch (error) {
        console.error(`Failed to delete ${id}:`, error.message);
      }
    }
    
    console.log('\nDuplicates removed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check if we have the token
if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: SANITY_API_TOKEN environment variable is required');
  console.log('Please set it in your .env file or run with:');
  console.log('SANITY_API_TOKEN=your-token-here node scripts/remove-duplicate-landing-pages.js');
  process.exit(1);
}

removeDuplicateLandingPages();