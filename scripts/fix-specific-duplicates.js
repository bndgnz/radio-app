const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function fixSpecificDuplicates() {
  console.log('Finding and fixing specific duplicates...\n')
  
  const targetNames = [
    'Wayne McIntosh Local Board Candidate Interview 2025',
    'Kerrin Leoni'
  ]
  
  try {
    for (const name of targetNames) {
      console.log(`\nSearching for: "${name}"`)
      
      // Search for podcasts with this name in the title
      const query = `*[_type == "amazonPodcast" && title match "*${name}*"]{
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
      console.log(`Found ${podcasts.length} matching podcasts:`)
      
      if (podcasts.length === 0) continue
      
      // Group by exact title
      const titleGroups = {}
      podcasts.forEach(podcast => {
        const title = podcast.title
        if (!titleGroups[title]) {
          titleGroups[title] = []
        }
        titleGroups[title].push(podcast)
      })
      
      // Process duplicates
      for (const [title, group] of Object.entries(titleGroups)) {
        if (group.length > 1) {
          console.log(`\n  "${title}" has ${group.length} duplicates:`)
          
          // Show all duplicates
          group.forEach((podcast, index) => {
            const hasImage = podcast.podcastImage && !Array.isArray(podcast.podcastImage) && podcast.podcastImage.secure_url
            console.log(`    ${index + 1}. ${podcast._id}`)
            console.log(`       Created: ${podcast._createdAt}`)
            console.log(`       Image: ${hasImage ? '✓ Valid' : (podcast.podcastImage ? '✗ Broken' : '✗ None')}`)
          })
          
          // Sort to determine which to keep
          const sorted = group.sort((a, b) => {
            // Prefer valid image
            const aHasValidImage = a.podcastImage && !Array.isArray(a.podcastImage) && a.podcastImage.secure_url
            const bHasValidImage = b.podcastImage && !Array.isArray(b.podcastImage) && b.podcastImage.secure_url
            
            if (aHasValidImage && !bHasValidImage) return -1
            if (!aHasValidImage && bHasValidImage) return 1
            
            // Prefer proper ID format
            if (a._id.startsWith('amazonPodcast-') && !b._id.startsWith('amazonPodcast-')) return -1
            if (!a._id.startsWith('amazonPodcast-') && b._id.startsWith('amazonPodcast-')) return 1
            
            return new Date(b._createdAt) - new Date(a._createdAt)
          })
          
          const keepDoc = sorted[0]
          const deleteDoc = sorted[1]
          
          console.log(`\n    Keeping: ${keepDoc._id}`)
          console.log(`    Deleting: ${deleteDoc._id}`)
          
          // Check for references
          const referencesQuery = `*[references("${deleteDoc._id}")]{_id, _type, title}`
          const references = await client.fetch(referencesQuery)
          
          if (references.length > 0) {
            console.log(`    Found ${references.length} references, updating them...`)
            
            for (const ref of references) {
              // Get the full document
              const doc = await client.fetch(`*[_id == "${ref._id}"][0]`)
              
              // Replace references
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
          console.log(`    ✓ Deleted duplicate`)
        }
      }
    }
    
    console.log('\nDone!')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
fixSpecificDuplicates()