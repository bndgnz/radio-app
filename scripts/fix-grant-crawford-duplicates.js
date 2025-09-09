const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function fixGrantCrawfordDuplicates() {
  console.log('Fixing Grant Crawford podcast duplicates...\n')
  
  try {
    // Get all Grant Crawford podcasts
    const query = `*[_type == "amazonPodcast" && title match "*Grant Crawford*"]{
      _id,
      title,
      podcastImage,
      slug,
      description,
      date,
      amazonUrl,
      show
    } | order(title asc)`
    
    const podcasts = await client.fetch(query)
    
    // Group by title to find duplicates
    const titleGroups = {}
    podcasts.forEach(podcast => {
      if (!titleGroups[podcast.title]) {
        titleGroups[podcast.title] = []
      }
      titleGroups[podcast.title].push(podcast)
    })
    
    // Process each group of duplicates
    for (const [title, group] of Object.entries(titleGroups)) {
      if (group.length > 1) {
        console.log(`Processing duplicates for: "${title}"`)
        
        // Sort by ID to keep the one with proper ID format (starts with "amazonPodcast-")
        const sorted = group.sort((a, b) => {
          // Prefer the one that starts with "amazonPodcast-"
          if (a._id.startsWith('amazonPodcast-') && !b._id.startsWith('amazonPodcast-')) return -1
          if (!a._id.startsWith('amazonPodcast-') && b._id.startsWith('amazonPodcast-')) return 1
          return 0
        })
        
        const keepDoc = sorted[0]
        const deleteDoc = sorted[1]
        
        console.log(`  Keeping: ${keepDoc._id} (has ${keepDoc.podcastImage ? 'image' : 'no image'})`)
        console.log(`  Deleting: ${deleteDoc._id} (has ${deleteDoc.podcastImage ? 'broken image' : 'no image'})`)
        
        // First, check if the document to delete is referenced anywhere
        const referencesQuery = `*[references("${deleteDoc._id}")]{_id, _type, title}`
        const references = await client.fetch(referencesQuery)
        
        if (references.length > 0) {
          console.log(`  Found ${references.length} references to the duplicate, updating them...`)
          
          // Update all references to point to the kept document
          for (const ref of references) {
            console.log(`    Updating reference in ${ref._type}: ${ref.title || ref._id}`)
            
            // Find and replace the reference
            const doc = await client.fetch(`*[_id == "${ref._id}"][0]`)
            const updatedDoc = JSON.parse(
              JSON.stringify(doc).replace(new RegExp(deleteDoc._id, 'g'), keepDoc._id)
            )
            
            await client
              .patch(ref._id)
              .set(updatedDoc)
              .commit()
          }
        }
        
        // Delete the duplicate
        await client.delete(deleteDoc._id)
        console.log(`  ✓ Deleted duplicate: ${deleteDoc._id}\n`)
      }
    }
    
    // Now fix any remaining podcasts with broken image format (array instead of object)
    console.log('Checking for remaining broken image formats...\n')
    
    const remainingQuery = `*[_type == "amazonPodcast" && defined(podcastImage)]{
      _id,
      title,
      podcastImage
    }`
    
    const remaining = await client.fetch(remainingQuery)
    
    for (const podcast of remaining) {
      if (Array.isArray(podcast.podcastImage)) {
        console.log(`Fixing image format for: ${podcast.title}`)
        
        // Extract the first item from the array
        const imageData = podcast.podcastImage[0]
        
        // Create proper Cloudinary image object
        const fixedImage = {
          _type: 'cloudinary.asset',
          public_id: imageData.public_id,
          resource_type: imageData.resource_type || 'image',
          type: imageData.type || 'upload',
          format: imageData.format,
          version: imageData.version,
          url: imageData.url,
          secure_url: imageData.secure_url,
          width: imageData.width,
          height: imageData.height,
          bytes: imageData.bytes,
          duration: imageData.duration || null,
          tags: imageData.tags || [],
          metadata: imageData.metadata || {},
          created_at: imageData.created_at
        }
        
        await client
          .patch(podcast._id)
          .set({ podcastImage: fixedImage })
          .commit()
        
        console.log(`  ✓ Fixed image format\n`)
      }
    }
    
    console.log('Done! All Grant Crawford duplicates have been resolved.')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
fixGrantCrawfordDuplicates()