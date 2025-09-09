require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function fixAllInlineComponents() {
  console.log('🔄 Creating documents for all inline components...')
  
  try {
    // Get all layoutColumn documents with inline components
    const query = `*[_type == 'layoutColumn' && defined(layoutComponents)]{_id, title, layoutComponents}`
    const columns = await client.fetch(query)
    console.log(`📋 Found ${columns.length} layoutColumn documents`)
    
    const documentsToCreate = []
    const updates = {}
    
    for (const column of columns) {
      const updatedComponents = []
      let needsUpdate = false
      
      for (const component of column.layoutComponents) {
        if (component._type && !component._ref && component._originalId) {
          // This is an inline component with an original ID
          
          // Check if document exists
          const exists = await client.fetch(`*[_id == "${component._originalId}"][0]._id`)
          
          if (!exists) {
            // Need to create this document
            if (component._type === 'playlist') {
              documentsToCreate.push({
                _id: component._originalId,
                _type: 'playlist',
                title: component.title || 'Untitled Playlist',
                url: component.url,
                showTitle: component.showTitle
              })
            } else if (component._type === 'accordion') {
              documentsToCreate.push({
                _id: component._originalId,
                _type: 'accordion',
                title: component.title || 'Untitled Accordion',
                items: component.items || []
              })
            } else if (component._type === 'message') {
              documentsToCreate.push({
                _id: component._originalId,
                _type: 'message',
                title: component.title || 'Untitled Message',
                headline: component.headline,
                messageType: component.messageType,
                overview: component.overview
              })
            }
          }
          
          // Convert to reference
          updatedComponents.push({
            _type: 'reference',
            _ref: component._originalId,
            _key: component._key
          })
          needsUpdate = true
        } else {
          updatedComponents.push(component)
        }
      }
      
      if (needsUpdate) {
        updates[column._id] = {
          title: column.title,
          layoutComponents: updatedComponents
        }
      }
    }
    
    // Create missing documents
    if (documentsToCreate.length > 0) {
      console.log(`\n📝 Creating ${documentsToCreate.length} missing documents...`)
      for (const doc of documentsToCreate) {
        try {
          await client.createOrReplace(doc)
          console.log(`✅ Created ${doc._type}: ${doc.title}`)
        } catch (error) {
          console.log(`⚠️ Could not create ${doc._type}: ${doc._id}`)
        }
      }
    }
    
    // Update columns with references
    const updateCount = Object.keys(updates).length
    if (updateCount > 0) {
      console.log(`\n🔧 Updating ${updateCount} columns to use references...`)
      for (const [id, data] of Object.entries(updates)) {
        await client.patch(id).set({ layoutComponents: data.layoutComponents }).commit()
        console.log(`✅ Updated: ${data.title}`)
      }
    }
    
    console.log('\n🎉 All inline components converted to references!')
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixAllInlineComponents()