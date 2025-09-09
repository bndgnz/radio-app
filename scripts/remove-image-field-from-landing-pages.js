const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function removeImageField() {
  console.log('Fetching all landing pages with image field...')
  
  try {
    // Fetch all landing pages that have an image field
    const query = `*[_type == "landingPage" && defined(image)]`
    const documents = await client.fetch(query)
    
    console.log(`Found ${documents.length} landing pages with image field`)
    
    if (documents.length === 0) {
      console.log('No landing pages with image field found. Nothing to do.')
      return
    }
    
    // Process each document
    for (const doc of documents) {
      console.log(`Processing: ${doc.title || doc._id}`)
      
      // Create a patch to unset the image field
      await client
        .patch(doc._id)
        .unset(['image'])
        .commit()
        .then(() => {
          console.log(`✓ Removed image field from: ${doc.title || doc._id}`)
        })
        .catch(err => {
          console.error(`✗ Error processing ${doc._id}:`, err.message)
        })
    }
    
    console.log('\nCompleted! All image fields have been removed from landing pages.')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
removeImageField()