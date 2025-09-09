const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2022-06-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function fixNavigationReferences() {
  try {
    // Get all navigation links that reference landingPage- documents
    const navigationLinks = await client.fetch(`
      *[_type == "navigationLink" && references(*[_id match "landingPage-*"])] {
        _id,
        title,
        linkReference->{
          _id,
          title,
          slug
        }
      }
    `);

    console.log(`Found ${navigationLinks.length} navigation links to fix:`);
    
    const fixes = [];
    
    for (const navLink of navigationLinks) {
      if (navLink.linkReference && navLink.linkReference._id.startsWith('landingPage-')) {
        const duplicateId = navLink.linkReference._id;
        const originalId = duplicateId.replace('landingPage-', '');
        
        console.log(`\n${navLink.title}:`);
        console.log(`  Currently references: ${duplicateId}`);
        console.log(`  Should reference: ${originalId}`);
        
        // Check if the original document exists
        const originalExists = await client.fetch('*[_id == $id][0]', { id: originalId });
        if (originalExists) {
          fixes.push({
            navLinkId: navLink._id,
            from: duplicateId,
            to: originalId,
            title: navLink.title
          });
        } else {
          console.log(`  WARNING: Original document ${originalId} not found!`);
        }
      }
    }
    
    if (fixes.length === 0) {
      console.log('\nNo navigation links need fixing');
      return;
    }
    
    console.log(`\nWill update ${fixes.length} navigation links:`);
    fixes.forEach(fix => {
      console.log(`  - ${fix.title}: ${fix.from} → ${fix.to}`);
    });
    
    console.log('\nUpdating navigation links...');
    
    for (const fix of fixes) {
      try {
        await client
          .patch(fix.navLinkId)
          .set({
            linkReference: {
              _type: 'reference',
              _ref: fix.to
            }
          })
          .commit();
        
        console.log(`✓ Updated ${fix.title}`);
      } catch (error) {
        console.error(`✗ Failed to update ${fix.title}:`, error.message);
      }
    }
    
    console.log('\nNavigation references updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check if we have the token
if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

fixNavigationReferences();