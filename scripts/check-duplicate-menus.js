const { createClient } = require('@sanity/client')
require('dotenv').config()

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function checkDuplicateMenus() {
  try {
    // Fetch all menu documents
    const menus = await client.fetch(`
      *[_type == "menu"] {
        _id,
        _rev,
        title,
        _createdAt,
        _updatedAt
      } | order(title, _createdAt)
    `)

    console.log(`Found ${menus.length} menu documents:\n`)
    
    // Group by title to identify duplicates
    const menusByTitle = {}
    menus.forEach(menu => {
      const title = menu.title || 'Untitled'
      if (!menusByTitle[title]) {
        menusByTitle[title] = []
      }
      menusByTitle[title].push(menu)
    })

    // Report duplicates
    let hasDuplicates = false
    Object.keys(menusByTitle).forEach(title => {
      if (menusByTitle[title].length > 1) {
        hasDuplicates = true
        console.log(`\nDuplicate found: "${title}" (${menusByTitle[title].length} instances)`)
        menusByTitle[title].forEach((menu, index) => {
          console.log(`  ${index + 1}. ID: ${menu._id}`)
          console.log(`     Created: ${new Date(menu._createdAt).toLocaleString()}`)
          console.log(`     Updated: ${new Date(menu._updatedAt).toLocaleString()}`)
        })
      } else {
        console.log(`✓ "${title}" - Single instance (ID: ${menusByTitle[title][0]._id})`)
      }
    })

    if (!hasDuplicates) {
      console.log('\n✅ No duplicate menus found!')
    } else {
      console.log('\n⚠️  Duplicate menus detected. Consider removing duplicates.')
      console.log('To delete duplicates, keep the most recently updated one and delete older ones.')
    }

  } catch (error) {
    console.error('Error fetching menus:', error)
  }
}

checkDuplicateMenus()