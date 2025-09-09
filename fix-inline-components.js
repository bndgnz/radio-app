require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function fixInlineComponents() {
  console.log('🔄 Converting inline components to references...')
  
  try {
    // Get all layoutColumn documents with inline components
    const query = `*[_type == 'layoutColumn' && defined(layoutComponents)]{_id, title, layoutComponents}`
    const columns = await client.fetch(query)
    console.log(`📋 Found ${columns.length} layoutColumn documents`)
    
    let fixedCount = 0
    
    for (const column of columns) {
      let needsUpdate = false
      const updatedComponents = []
      
      for (const component of column.layoutComponents) {
        if (component._type && !component._ref) {
          // This is an inline component that should be a reference
          console.log(`  📦 Found inline ${component._type} in ${column.title}`)
          
          if (component._type === 'list' && component._originalId) {
            // Convert to reference using the original ID
            updatedComponents.push({
              _type: 'reference',
              _ref: component._originalId,
              _key: component._key
            })
            needsUpdate = true
            console.log(`    ↳ Converting to reference: ${component._originalId}`)
          } else if (component._type === 'showList') {
            // This is correct as an inline object
            updatedComponents.push(component)
          } else if (component._type === 'showsOnToday') {
            // This is correct as an inline object
            updatedComponents.push(component)
          } else {
            // Keep as is for now
            updatedComponents.push(component)
          }
        } else {
          // Already a reference or other type
          updatedComponents.push(component)
        }
      }
      
      if (needsUpdate) {
        console.log(`🔧 Updating column: ${column.title}`)
        await client.patch(column._id).set({ layoutComponents: updatedComponents }).commit()
        console.log(`✅ Fixed column: ${column.title}`)
        fixedCount++
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} layoutColumn documents!`)
    
    // Now check if we need to create any missing list documents
    console.log('\n🔄 Checking for missing list documents...')
    
    const listQuery = `*[_id == 'JQoVjSqMD1nwM5ciw7nMo'][0]`
    const existingList = await client.fetch(listQuery)
    
    if (!existingList) {
      console.log('📝 Creating missing "Shows on Today" list document...')
      
      const newList = {
        _id: 'JQoVjSqMD1nwM5ciw7nMo',
        _type: 'list',
        title: 'Shows on Today',
        type: 'Show List',
        showStatus: 'Show on Today'
      }
      
      await client.createOrReplace(newList)
      console.log('✅ Created "Shows on Today" list document')
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixInlineComponents()