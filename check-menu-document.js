const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkMenuDocument() {
  try {
    console.log('Checking for menu document with ID: 7mL4gjMnrIxL0dF6vOm3z6...\n');
    
    // First, let's get all menu documents to see what exists
    const allMenus = await sanityClient.fetch('*[_type == "menu"]');
    console.log(`Found ${allMenus.length} menu document(s) total:\n`);
    
    allMenus.forEach((menu, index) => {
      console.log(`Menu ${index + 1}:`);
      console.log(`  ID: ${menu._id}`);
      console.log(`  Title: ${menu.title || 'No title'}`);
      console.log(`  Created: ${menu._createdAt}`);
      console.log(`  Updated: ${menu._updatedAt}`);
      console.log(`  Links: ${menu.links ? menu.links.length : 0} link references`);
      console.log('');
    });
    
    // Now check specifically for the requested document
    const specificMenu = await sanityClient.fetch('*[_type == "menu" && _id == "7mL4gjMnrIxL0dF6vOm3z6"][0]');
    
    if (specificMenu) {
      console.log('✅ Found the specific menu document with ID: 7mL4gjMnrIxL0dF6vOm3z6\n');
      console.log('Menu Document Structure:');
      console.log(JSON.stringify(specificMenu, null, 2));
      
      // Now let's fetch the full menu with populated navigation links
      const fullMenu = await sanityClient.fetch(`
        *[_type == "menu" && _id == "7mL4gjMnrIxL0dF6vOm3z6"][0]{
          _id,
          _createdAt,
          _updatedAt,
          title,
          logo,
          links[]->{
            _id,
            linkText,
            linkType,
            internalLink->{
              _id,
              title,
              slug
            },
            externalUrl,
            sublinks[]->{
              _id,
              linkText,
              linkType,
              internalLink->{
                _id,
                title,
                slug
              },
              externalUrl
            }
          },
          featuredButton->{
            _id,
            title,
            content
          }
        }
      `);
      
      console.log('\n=== FULL MENU WITH POPULATED LINKS ===\n');
      console.log(JSON.stringify(fullMenu, null, 2));
      
      // Analyze the structure
      console.log('\n=== MENU ANALYSIS ===');
      console.log(`Title: ${fullMenu.title || 'No title'}`);
      console.log(`Has Logo: ${fullMenu.logo ? 'Yes' : 'No'}`);
      console.log(`Number of Navigation Links: ${fullMenu.links ? fullMenu.links.length : 0}`);
      console.log(`Has Featured Button: ${fullMenu.featuredButton ? 'Yes' : 'No'}`);
      
      if (fullMenu.links && fullMenu.links.length > 0) {
        console.log('\nNavigation Links:');
        fullMenu.links.forEach((link, index) => {
          console.log(`  ${index + 1}. ${link.linkText} (${link.linkType})`);
          if (link.linkType === 'internal' && link.internalLink) {
            console.log(`     → ${link.internalLink.title} (/${link.internalLink.slug?.current || 'no-slug'})`);
          } else if (link.linkType === 'external' && link.externalUrl) {
            console.log(`     → ${link.externalUrl}`);
          }
          if (link.sublinks && link.sublinks.length > 0) {
            console.log(`     Has ${link.sublinks.length} sublink(s):`);
            link.sublinks.forEach((sublink, subIndex) => {
              console.log(`       ${subIndex + 1}. ${sublink.linkText} (${sublink.linkType})`);
            });
          }
        });
      }
      
    } else {
      console.log('❌ No menu document found with ID: 7mL4gjMnrIxL0dF6vOm3z6');
    }
    
  } catch (error) {
    console.error('Error checking menu document:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.statusCode,
      details: error.details
    });
  }
}

checkMenuDocument();