const { createClient } = require('@sanity/client')
require('dotenv').config()

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function removeDuplicateMenus() {
  try {
    // Fetch all menu documents
    const menus = await client.fetch(`
      *[_type == "menu"] {
        _id,
        _rev,
        title,
        _createdAt,
        _updatedAt,
        links,
        featuredButton
      } | order(title, _updatedAt desc)
    `)

    console.log(`Found ${menus.length} menu documents\n`)
    
    // Group by title to identify duplicates
    const menusByTitle = {}
    menus.forEach(menu => {
      const title = menu.title || 'Untitled'
      if (!menusByTitle[title]) {
        menusByTitle[title] = []
      }
      menusByTitle[title].push(menu)
    })

    // Process duplicates
    const toDelete = []
    Object.keys(menusByTitle).forEach(title => {
      if (menusByTitle[title].length > 1) {
        console.log(`\nProcessing duplicates for: "${title}"`)
        
        // Keep the first one (most recently updated based on our sort)
        const toKeep = menusByTitle[title][0]
        const duplicates = menusByTitle[title].slice(1)
        
        console.log(`  ✓ Keeping: ${toKeep._id} (Updated: ${new Date(toKeep._updatedAt).toLocaleString()})`)
        
        duplicates.forEach(dup => {
          console.log(`  × Will delete: ${dup._id} (Updated: ${new Date(dup._updatedAt).toLocaleString()})`)
          toDelete.push(dup)
        })
      }
    })

    if (toDelete.length === 0) {
      console.log('\n✅ No duplicates to remove!')
      return
    }

    // Confirm deletion
    console.log(`\n⚠️  About to delete ${toDelete.length} duplicate menu(s)`)
    console.log('Press Enter to continue or Ctrl+C to cancel...')
    
    await new Promise((resolve) => {
      process.stdin.once('data', resolve)
    })

    // Delete duplicates
    for (const menu of toDelete) {
      try {
        await client.delete(menu._id)
        console.log(`✓ Deleted: ${menu._id} (${menu.title})`)
      } catch (error) {
        console.error(`✗ Failed to delete ${menu._id}:`, error.message)
      }
    }

    console.log('\n✅ Cleanup complete!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit(0)
  }
}

console.log('Duplicate Menu Cleanup Tool')
console.log('===========================')
console.log('This will remove duplicate menu documents, keeping the most recently updated version.')
console.log('')

removeDuplicateMenus()