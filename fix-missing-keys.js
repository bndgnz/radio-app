require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

function generateKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

async function fixMissingKeys() {
  console.log('🔄 Fixing missing _key properties in layoutComponents...')
  
  try {
    // Get all layoutColumn documents with layoutComponents
    const query = `*[_type == 'layoutColumn' && defined(layoutComponents)]{_id, title, layoutComponents}`
    const columns = await client.fetch(query)
    console.log(`📋 Found ${columns.length} layoutColumn documents`)
    
    let fixedCount = 0
    
    for (const column of columns) {
      let needsUpdate = false
      const updatedComponents = []
      
      for (const component of column.layoutComponents) {
        if (!component._key) {
          // Add missing _key
          updatedComponents.push({
            ...component,
            _key: generateKey()
          })
          needsUpdate = true
          console.log(`  ➕ Added _key to component in ${column.title}`)
        } else {
          updatedComponents.push(component)
        }
      }
      
      if (needsUpdate) {
        console.log(`🔧 Updating column: ${column.title}`)
        await client.patch(column._id).set({ layoutComponents: updatedComponents }).commit()
        console.log(`✅ Fixed: ${column.title}`)
        fixedCount++
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} layoutColumn documents!`)
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixMissingKeys()