const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function checkDjByIdReferences() {
  console.log('Checking djById references...\n')
  
  try {
    // Check for any existing djById documents
    const djByIdDocs = await client.fetch(`*[_type == "djById"]`)
    console.log(`Found ${djByIdDocs.length} djById documents`)
    if (djByIdDocs.length > 0) {
      djByIdDocs.forEach(doc => {
        console.log(`  - ${doc._id}: ${doc.title || 'Untitled'}`)
      })
    }
    
    // Check landing pages for components
    const query = `*[_type == "landingPage"]{
      _id,
      title,
      "componentDetails": components[]{
        ...,
        _type == "reference" => {
          ...,
          "refDoc": @->
        }
      }
    }`
    
    const pages = await client.fetch(query)
    
    console.log(`\nChecking ${pages.length} landing pages...\n`)
    
    for (const page of pages) {
      if (!page.componentDetails || page.componentDetails.length === 0) continue
      
      console.log(`Page: ${page.title}`)
      page.componentDetails.forEach((comp, index) => {
        if (comp._type === 'djById') {
          console.log(`  [${index}] djById (inline): ${comp.title || 'Untitled'}`)
        } else if (comp._type === 'reference') {
          if (comp.refDoc) {
            console.log(`  [${index}] Reference to ${comp.refDoc._type}: ${comp.refDoc.title || comp.refDoc._id}`)
          } else {
            console.log(`  [${index}] INVALID REFERENCE: ${comp._ref} (document not found)`)
          }
        } else {
          console.log(`  [${index}] ${comp._type}: ${comp.title || 'Untitled'}`)
        }
      })
      console.log('')
    }
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
checkDjByIdReferences()