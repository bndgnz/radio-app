const { createClient } = require('@sanity/client')
require('dotenv').config()
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function removeLegacyFields() {
  try {
    // Fetch all landing page documents with legacy fields
    const documents = await client.fetch(`
      *[_type == "landingPage" && (defined(components) || defined(showBanner) || defined(showContent) || defined(showIntroduction))] {
        _id,
        _rev,
        title,
        components,
        showBanner,
        showContent,
        showIntroduction
      }
    `)

    if (documents.length === 0) {
      console.log('✅ No documents with legacy fields found!')
      return
    }

    console.log(`Found ${documents.length} document(s) with legacy fields:\n`)
    
    documents.forEach(doc => {
      console.log(`• ${doc.title || 'Untitled'} (ID: ${doc._id})`)
      const legacyFields = []
      if (doc.components !== undefined) legacyFields.push('components')
      if (doc.showBanner !== undefined) legacyFields.push('showBanner')
      if (doc.showContent !== undefined) legacyFields.push('showContent')
      if (doc.showIntroduction !== undefined) legacyFields.push('showIntroduction')
      console.log(`  Legacy fields: ${legacyFields.join(', ')}`)
    })

    console.log('\n⚠️  About to remove legacy fields from these documents')
    console.log('Press Enter to continue or Ctrl+C to cancel...')
    
    await new Promise((resolve) => {
      process.stdin.once('data', resolve)
    })

    // Process each document
    for (const doc of documents) {
      try {
        // Use patch to unset the legacy fields
        await client
          .patch(doc._id)
          .unset(['components', 'showBanner', 'showContent', 'showIntroduction'])
          .commit()
        
        console.log(`✓ Cleaned: ${doc.title || 'Untitled'} (${doc._id})`)
      } catch (error) {
        console.error(`✗ Failed to clean ${doc._id}:`, error.message)
      }
    }

    console.log('\n✅ Cleanup complete!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit(0)
  }
}

console.log('Legacy Fields Cleanup Tool')
console.log('==========================')
console.log('This will remove legacy fields (components, showBanner, showContent, showIntroduction)')
console.log('from Landing Page documents.\n')

removeLegacyFields()