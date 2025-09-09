const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2022-06-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function fixNavigationAndDeleteDuplicates() {
  try {
    // Get all navigation links that reference duplicate landing pages
    const navigationLinks = await client.fetch(`
      *[_type == "navigationLink" && (
        internalLink._ref match "landingPage-*" ||
        sublinks[]._ref match "landingPage-*"
      )] {
        _id,
        linkText,
        internalLink,
        sublinks
      }
    `);

    console.log(`Found ${navigationLinks.length} navigation links to fix:`);
    
    const updates = [];
    
    for (const navLink of navigationLinks) {
      const navUpdates = { _id: navLink._id, changes: {} };
      let hasChanges = false;
      
      // Fix main internalLink if it references a duplicate
      if (navLink.internalLink && navLink.internalLink._ref.startsWith('landingPage-')) {
        const duplicateRef = navLink.internalLink._ref;
        const originalRef = duplicateRef.replace('landingPage-', '');
        
        // Check if original exists
        const originalExists = await client.fetch('*[_id == $id][0]', { id: originalRef });
        if (originalExists) {
          navUpdates.changes.internalLink = {
            _type: 'reference',
            _ref: originalRef
          };
          hasChanges = true;
          console.log(`  ${navLink.linkText}: ${duplicateRef} → ${originalRef}`);
        }
      }
      
      // Fix sublinks if they reference duplicates
      if (navLink.sublinks && navLink.sublinks.length > 0) {
        const updatedSublinks = [];
        for (const sublink of navLink.sublinks) {
          if (sublink._ref && sublink._ref.startsWith('landingPage-')) {
            const duplicateRef = sublink._ref;
            const originalRef = duplicateRef.replace('landingPage-', '');
            
            // Check if original exists
            const originalExists = await client.fetch('*[_id == $id][0]', { id: originalRef });
            if (originalExists) {
              updatedSublinks.push({
                _key: sublink._key,
                _type: 'reference',
                _ref: originalRef
              });
              hasChanges = true;
              console.log(`    Sublink: ${duplicateRef} → ${originalRef}`);
            } else {
              updatedSublinks.push(sublink);
            }
          } else {
            updatedSublinks.push(sublink);
          }
        }
        
        if (hasChanges) {
          navUpdates.changes.sublinks = updatedSublinks;
        }
      }
      
      if (hasChanges) {
        updates.push(navUpdates);
      }
    }
    
    if (updates.length === 0) {
      console.log('\nNo navigation links need updating');
    } else {
      console.log(`\nUpdating ${updates.length} navigation links...`);
      
      for (const update of updates) {
        try {
          await client
            .patch(update._id)
            .set(update.changes)
            .commit();
          
          console.log(`✓ Updated navigation link: ${update._id}`);
        } catch (error) {
          console.error(`✗ Failed to update ${update._id}:`, error.message);
        }
      }
    }
    
    // Now delete the duplicate landing pages
    console.log('\nFetching remaining duplicate landing pages...');
    const duplicates = await client.fetch('*[_type == "landingPage" && _id match "landingPage-*"] {_id, title}');
    
    if (duplicates.length === 0) {
      console.log('No duplicate landing pages found to delete');
      return;
    }
    
    console.log(`\nDeleting ${duplicates.length} duplicate landing pages...`);
    
    for (const duplicate of duplicates) {
      try {
        await client.delete(duplicate._id);
        console.log(`✓ Deleted: ${duplicate._id} - ${duplicate.title}`);
      } catch (error) {
        console.error(`✗ Failed to delete ${duplicate._id}:`, error.message);
      }
    }
    
    console.log('\nAll duplicates processed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check if we have the token
if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

fixNavigationAndDeleteDuplicates();