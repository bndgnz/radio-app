// Migration to remove the deprecated 'image' field from landing pages
// Run with: npx sanity migration run remove-image-from-landing-pages

import {defineMigration, at, unset} from 'sanity/migrate'

export default defineMigration({
  title: 'Remove image field from landing pages',
  
  migrate: {
    document(doc, context) {
      // Only process landingPage documents that have an image field
      if (doc._type === 'landingPage' && doc.image) {
        console.log(`Removing image field from landing page: ${doc.title || doc._id}`)
        
        return [
          at('image', unset())
        ]
      }
      
      // Return empty array if no changes needed
      return []
    }
  }
})