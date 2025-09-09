const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function findGrantCrawfordPodcasts() {
  console.log('Searching for Grant Crawford podcast entries...\n')
  
  try {
    // Search for all Amazon Podcasts with Grant Crawford in the title
    const query = `*[_type == "amazonPodcast" && title match "*Grant Crawford*"]{
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      date,
      amazonUrl,
      "showRef": show->title,
      podcastImage
    } | order(title asc)`
    
    const podcasts = await client.fetch(query)
    
    console.log(`Found ${podcasts.length} Grant Crawford podcast entries:\n`)
    
    podcasts.forEach((podcast, index) => {
      console.log(`${index + 1}. ${podcast.title}`)
      console.log(`   ID: ${podcast._id}`)
      console.log(`   Created: ${podcast._createdAt}`)
      console.log(`   Updated: ${podcast._updatedAt}`)
      console.log(`   Date: ${podcast.date || 'Not set'}`)
      console.log(`   Show: ${podcast.showRef || 'Not linked'}`)
      console.log(`   Amazon URL: ${podcast.amazonUrl || 'Not set'}`)
      
      // Check podcast image
      if (podcast.podcastImage) {
        if (podcast.podcastImage.secure_url) {
          console.log(`   Image: ✓ Valid Cloudinary image`)
          console.log(`          URL: ${podcast.podcastImage.secure_url}`)
        } else if (podcast.podcastImage.public_id) {
          console.log(`   Image: ⚠ Has public_id but no secure_url`)
          console.log(`          Public ID: ${podcast.podcastImage.public_id}`)
        } else {
          console.log(`   Image: ✗ Invalid/broken Cloudinary image structure`)
          console.log(`          Data: ${JSON.stringify(podcast.podcastImage, null, 2)}`)
        }
      } else {
        console.log(`   Image: ✗ No image`)
      }
      
      console.log('')
    })
    
    // Check for exact duplicates
    const titleGroups = {}
    podcasts.forEach(podcast => {
      if (!titleGroups[podcast.title]) {
        titleGroups[podcast.title] = []
      }
      titleGroups[podcast.title].push(podcast)
    })
    
    console.log('Duplicate Analysis:')
    Object.keys(titleGroups).forEach(title => {
      if (titleGroups[title].length > 1) {
        console.log(`\n"${title}" has ${titleGroups[title].length} entries:`)
        titleGroups[title].forEach((podcast, index) => {
          console.log(`  ${index + 1}. ID: ${podcast._id}`)
          console.log(`     Image: ${podcast.podcastImage ? (podcast.podcastImage.secure_url ? '✓' : '✗') : '✗'}`)
        })
      }
    })
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
findGrantCrawfordPodcasts()