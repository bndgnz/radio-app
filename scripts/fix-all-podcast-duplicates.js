const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function fixAllPodcastDuplicates() {
  console.log('Finding and fixing all podcast duplicates...\n')
  
  try {
    // Get all Amazon Podcasts
    const query = `*[_type == "amazonPodcast"]{
      _id,
      _createdAt,
      title,
      slug,
      podcastImage,
      description,
      date,
      amazonUrl,
      show
    } | order(title asc, _createdAt asc)`
    
    const podcasts = await client.fetch(query)
    console.log(`Found ${podcasts.length} total Amazon Podcasts\n`)
    
    // Group by title to find duplicates
    const titleGroups = {}
    podcasts.forEach(podcast => {
      if (!podcast.title) {
        console.log(`Warning: Podcast ${podcast._id} has no title, skipping...`)
        return
      }
      const normalizedTitle = podcast.title.trim()
      if (!titleGroups[normalizedTitle]) {
        titleGroups[normalizedTitle] = []
      }
      titleGroups[normalizedTitle].push(podcast)
    })
    
    // Find all groups with duplicates
    const duplicateGroups = Object.entries(titleGroups)
      .filter(([title, group]) => group.length > 1)
      .sort((a, b) => b[1].length - a[1].length) // Sort by number of duplicates
    
    console.log(`Found ${duplicateGroups.length} titles with duplicates:\n`)
    
    // Process each group of duplicates
    for (const [title, group] of duplicateGroups) {
      console.log(`\nProcessing: "${title}" (${group.length} copies)`)
      
      // Sort to determine which to keep
      // Prefer: 1) Has valid image, 2) Starts with "amazonPodcast-", 3) Most recent
      const sorted = group.sort((a, b) => {
        // Check for valid images
        const aHasValidImage = a.podcastImage && !Array.isArray(a.podcastImage) && a.podcastImage.secure_url
        const bHasValidImage = b.podcastImage && !Array.isArray(b.podcastImage) && b.podcastImage.secure_url
        
        if (aHasValidImage && !bHasValidImage) return -1
        if (!aHasValidImage && bHasValidImage) return 1
        
        // Check ID format
        if (a._id.startsWith('amazonPodcast-') && !b._id.startsWith('amazonPodcast-')) return -1
        if (!a._id.startsWith('amazonPodcast-') && b._id.startsWith('amazonPodcast-')) return 1
        
        // Use creation date as last resort
        return new Date(b._createdAt) - new Date(a._createdAt)
      })
      
      const keepDoc = sorted[0]
      const duplicatesToDelete = sorted.slice(1)
      
      console.log(`  Keeping: ${keepDoc._id}`)
      console.log(`           Created: ${keepDoc._createdAt}`)
      console.log(`           Image: ${keepDoc.podcastImage ? (Array.isArray(keepDoc.podcastImage) ? 'Array (broken)' : 'Valid') : 'None'}`)
      
      for (const deleteDoc of duplicatesToDelete) {
        console.log(`  Deleting: ${deleteDoc._id}`)
        console.log(`            Created: ${deleteDoc._createdAt}`)
        console.log(`            Image: ${deleteDoc.podcastImage ? (Array.isArray(deleteDoc.podcastImage) ? 'Array (broken)' : 'Valid') : 'None'}`)
        
        // Check for references
        const referencesQuery = `*[references("${deleteDoc._id}")]{_id, _type, title}`
        const references = await client.fetch(referencesQuery)
        
        if (references.length > 0) {
          console.log(`    Found ${references.length} references, updating them...`)
          
          for (const ref of references) {
            // Get the full document
            const doc = await client.fetch(`*[_id == "${ref._id}"][0]`)
            
            // Replace references in all fields
            const docString = JSON.stringify(doc)
            const updatedDocString = docString.replace(
              new RegExp(deleteDoc._id, 'g'),
              keepDoc._id
            )
            const updatedDoc = JSON.parse(updatedDocString)
            
            // Update the document
            await client
              .patch(ref._id)
              .set(updatedDoc)
              .commit()
              
            console.log(`      Updated ${ref._type}: ${ref.title || ref._id}`)
          }
        }
        
        // Delete the duplicate
        await client.delete(deleteDoc._id)
        console.log(`    ✓ Deleted`)
      }
    }
    
    console.log('\n\nAll duplicates have been resolved!')
    
    // Summary
    const remainingQuery = `count(*[_type == "amazonPodcast"])`
    const remainingCount = await client.fetch(remainingQuery)
    console.log(`\nFinal count: ${remainingCount} Amazon Podcasts (was ${podcasts.length})`)
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
fixAllPodcastDuplicates()