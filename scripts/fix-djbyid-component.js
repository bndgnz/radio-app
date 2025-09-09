const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function fixDjByIdComponent() {
  console.log('Fetching landing pages with djById components...')
  
  try {
    // First, let's check if there are any djById documents that were incorrectly created
    const djByIdDocs = await client.fetch(`*[_type == "djById"]`)
    console.log(`Found ${djByIdDocs.length} djById documents (these shouldn't exist as documents)`)
    
    // Fetch all landing pages
    const query = `*[_type == "landingPage"]{
      _id,
      title,
      components
    }`
    const documents = await client.fetch(query)
    
    console.log(`Checking ${documents.length} landing pages for djById components...`)
    
    let fixedCount = 0
    
    for (const doc of documents) {
      if (!doc.components || doc.components.length === 0) continue
      
      let hasInvalidDjById = false
      const fixedComponents = []
      
      for (const component of doc.components) {
        // Check if this is an invalid reference to djById
        if (component._ref && djByIdDocs.some(dj => dj._id === component._ref)) {
          console.log(`Found invalid djById reference in: ${doc.title}`)
          hasInvalidDjById = true
          
          // Find the referenced djById document
          const djByIdDoc = djByIdDocs.find(dj => dj._id === component._ref)
          
          // Convert to inline object
          fixedComponents.push({
            _type: 'djById',
            _key: component._key || Math.random().toString(36).substring(7),
            title: djByIdDoc.title || 'DJ Details',
            description: djByIdDoc.description,
            djId: djByIdDoc.djId,
            showAllDjs: djByIdDoc.showAllDjs || false
          })
        } else if (component._type === 'djById') {
          // Already a proper inline djById, keep it
          fixedComponents.push(component)
        } else {
          // Keep other components as-is
          fixedComponents.push(component)
        }
      }
      
      if (hasInvalidDjById) {
        // Update the document with fixed components
        await client
          .patch(doc._id)
          .set({ components: fixedComponents })
          .commit()
        
        console.log(`✓ Fixed djById component in: ${doc.title}`)
        fixedCount++
      }
    }
    
    // Clean up any djById documents that shouldn't exist
    if (djByIdDocs.length > 0) {
      console.log('\nCleaning up invalid djById documents...')
      for (const djDoc of djByIdDocs) {
        await client.delete(djDoc._id)
        console.log(`✓ Deleted invalid djById document: ${djDoc._id}`)
      }
    }
    
    console.log(`\nCompleted! Fixed ${fixedCount} landing pages.`)
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
fixDjByIdComponent()