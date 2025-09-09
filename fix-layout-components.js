require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function fixLayoutComponents() {
  console.log('🔄 Fixing layoutColumn components field...')
  
  try {
    // Get all layoutColumn documents
    const query = `*[_type == 'layoutColumn']{_id, title, layoutComponent, layoutComponents}`
    const documents = await client.fetch(query)
    console.log(`📋 Found ${documents.length} layoutColumn documents`)
    
    let fixedCount = 0
    
    for (const doc of documents) {
      // Check if layoutComponent exists but layoutComponents doesn't
      if (doc.layoutComponent && !doc.layoutComponents) {
        console.log(`🔧 Fixing ${doc.title} (${doc._id})`)
        
        // The layoutComponent field contains references to streams or other components
        // We need to convert them to the correct format for layoutComponents
        const updates = {
          layoutComponents: doc.layoutComponent
        }
        
        // Also unset the old field
        await client
          .patch(doc._id)
          .set(updates)
          .unset(['layoutComponent'])
          .commit()
          
        console.log(`✅ Fixed: ${doc.title}`)
        fixedCount++
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} layoutColumn documents!`)
    
    // Now let's also check for banners with inline ctaLayout that should be references
    console.log('\n🔄 Checking banner ctaLayout fields...')
    
    const bannerQuery = `*[_type == 'banner' && defined(ctaLayout)]{
      _id, 
      title, 
      "hasReference": ctaLayout._ref != null,
      "hasInline": ctaLayout._type == 'layout',
      ctaLayout
    }`
    
    const banners = await client.fetch(bannerQuery)
    console.log(`📋 Found ${banners.length} banners with ctaLayout`)
    
    let bannersFixed = 0
    
    for (const banner of banners) {
      if (banner.hasInline && banner.ctaLayout._originalId) {
        console.log(`🔧 Fixing banner: ${banner.title}`)
        
        // Convert inline layout to reference
        const updates = {
          ctaLayout: {
            _type: 'reference',
            _ref: banner.ctaLayout._originalId
          }
        }
        
        await client.patch(banner._id).set(updates).commit()
        console.log(`✅ Fixed banner: ${banner.title}`)
        bannersFixed++
      }
    }
    
    console.log(`\n🎉 Fixed ${bannersFixed} banner documents!`)
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixLayoutComponents()