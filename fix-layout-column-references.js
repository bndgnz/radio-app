require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function fixLayoutColumnReferences() {
  console.log('🔄 Fixing layout column references...')
  
  try {
    // Get all layout documents that have columns
    const query = `*[_type == 'layout' && defined(columns)]{_id, title, columns}`
    const layouts = await client.fetch(query)
    console.log(`📋 Found ${layouts.length} layout documents with columns`)
    
    let fixedCount = 0
    
    for (const layout of layouts) {
      let needsUpdate = false
      const updatedColumns = []
      
      for (const column of layout.columns) {
        if (column._ref && !column._ref.startsWith('layoutColum-')) {
          // This reference needs to be fixed
          const correctedRef = `layoutColum-${column._ref}`
          
          // Check if this document exists
          const exists = await client.fetch(`*[_id == "${correctedRef}"][0]._id`)
          
          if (exists) {
            console.log(`  ✅ Found column: ${correctedRef}`)
            updatedColumns.push({
              ...column,
              _ref: correctedRef
            })
            needsUpdate = true
          } else {
            console.log(`  ⚠️ Column not found: ${correctedRef}, keeping original`)
            updatedColumns.push(column)
          }
        } else {
          updatedColumns.push(column)
        }
      }
      
      if (needsUpdate) {
        console.log(`🔧 Updating layout: ${layout.title}`)
        await client.patch(layout._id).set({ columns: updatedColumns }).commit()
        console.log(`✅ Fixed layout: ${layout.title}`)
        fixedCount++
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} layout documents!`)
    
    // Also check for any stream references that need fixing
    console.log('\n🔄 Checking stream references in layoutColumns...')
    
    const columnQuery = `*[_type == 'layoutColumn' && defined(layoutComponents)]{_id, title, layoutComponents}`
    const columns = await client.fetch(columnQuery)
    console.log(`📋 Found ${columns.length} layoutColumn documents with components`)
    
    let columnsFixed = 0
    
    for (const column of columns) {
      let needsUpdate = false
      const updatedComponents = []
      
      for (const component of column.layoutComponents) {
        if (component._ref) {
          // Check if this is a stream reference that needs the prefix
          const streamId = component._ref.replace('stream-', '')
          const streamExists = await client.fetch(`*[_id == "stream-${streamId}"][0]._id`)
          
          if (!streamExists) {
            // Try without the prefix
            const plainExists = await client.fetch(`*[_id == "${streamId}"][0]._id`)
            if (plainExists) {
              console.log(`  ✅ Found stream without prefix: ${streamId}`)
              updatedComponents.push({
                ...component,
                _ref: streamId
              })
              needsUpdate = true
            } else {
              updatedComponents.push(component)
            }
          } else {
            updatedComponents.push(component)
          }
        } else {
          updatedComponents.push(component)
        }
      }
      
      if (needsUpdate) {
        console.log(`🔧 Updating column: ${column.title}`)
        await client.patch(column._id).set({ layoutComponents: updatedComponents }).commit()
        console.log(`✅ Fixed column: ${column.title}`)
        columnsFixed++
      }
    }
    
    console.log(`\n🎉 Fixed ${columnsFixed} layoutColumn documents!`)
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixLayoutColumnReferences()