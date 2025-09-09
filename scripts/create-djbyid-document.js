const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function createDjByIdDocument() {
  console.log('Creating djById document...\n')
  
  try {
    // First check if a djById document already exists
    const existing = await client.fetch(`*[_type == "djById"][0]`)
    
    if (existing) {
      console.log('A djById document already exists:', existing._id)
      return existing
    }
    
    // Create a new djById document
    const newDoc = await client.create({
      _type: 'djById',
      title: 'DJ Details',
      description: 'Shows DJ details based on query string parameter',
      djId: 'id',
      showAllDjs: true
    })
    
    console.log('Created new djById document:', newDoc._id)
    console.log('Title:', newDoc.title)
    
    // Now find the page that references the old invalid djbyid
    const query = `*[_type == "landingPage" && title == "DJs"][0]{
      _id,
      title,
      components
    }`
    
    const djsPage = await client.fetch(query)
    
    if (djsPage && djsPage.components) {
      console.log('\nFound DJs page, updating components...')
      
      // Update the components to reference the new document
      const updatedComponents = djsPage.components.map(comp => {
        // Check if this is the invalid djbyid reference
        if (comp._ref && comp._type === 'reference') {
          // Get the referenced document to check its type
          return client.fetch(`*[_id == "${comp._ref}"][0]`).then(refDoc => {
            if (!refDoc || refDoc._type === 'djbyid') {
              // Replace with reference to our new document
              console.log('Replacing invalid reference with new djById document')
              return {
                _type: 'reference',
                _ref: newDoc._id,
                _key: comp._key
              }
            }
            return comp
          }).catch(() => {
            // If fetch fails, it's likely an invalid reference
            console.log('Replacing invalid reference with new djById document')
            return {
              _type: 'reference',
              _ref: newDoc._id,
              _key: comp._key
            }
          })
        }
        return Promise.resolve(comp)
      })
      
      const resolvedComponents = await Promise.all(updatedComponents)
      
      // Update the page
      await client
        .patch(djsPage._id)
        .set({ components: resolvedComponents })
        .commit()
      
      console.log('✓ Updated DJs page with valid djById reference')
    }
    
    return newDoc
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
createDjByIdDocument().then(() => {
  console.log('\nDone!')
})