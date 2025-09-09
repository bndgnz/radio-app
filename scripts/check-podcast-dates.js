const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function checkPodcastDates() {
  console.log('Checking Amazon Podcast date fields...\n')
  
  try {
    // Get a sample of podcasts sorted by creation date
    const query = `*[_type == "amazonPodcast"] | order(_createdAt desc) [0...5]{
      _id,
      title,
      _createdAt,
      _updatedAt,
      date
    }`
    
    const podcasts = await client.fetch(query)
    
    console.log('Sample of 5 most recently created podcasts:\n')
    console.log('='.repeat(100))
    
    podcasts.forEach((podcast, index) => {
      console.log(`\n${index + 1}. ${podcast.title}`)
      console.log('   ID:', podcast._id)
      console.log('   Created:', podcast._createdAt ? new Date(podcast._createdAt).toLocaleString() : 'Not set')
      console.log('   Updated:', podcast._updatedAt ? new Date(podcast._updatedAt).toLocaleString() : 'Not set')
      console.log('   Podcast Date:', podcast.date ? new Date(podcast.date).toLocaleString() : 'Not set')
    })
    
    // Check if sorting is working
    console.log('\n' + '='.repeat(100))
    console.log('\nVerifying sort order by _createdAt:')
    
    const sortedByCreated = await client.fetch(`
      *[_type == "amazonPodcast"] | order(_createdAt desc) [0...3]{
        title,
        _createdAt
      }
    `)
    
    console.log('\nNewest 3 by creation date:')
    sortedByCreated.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title}`)
      console.log(`     Created: ${new Date(p._createdAt).toLocaleString()}`)
    })
    
    const sortedByDate = await client.fetch(`
      *[_type == "amazonPodcast" && defined(date)] | order(date desc) [0...3]{
        title,
        date
      }
    `)
    
    console.log('\nNewest 3 by podcast date field:')
    sortedByDate.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title}`)
      console.log(`     Date: ${p.date ? new Date(p.date).toLocaleString() : 'Not set'}`)
    })
    
    // Check for any podcasts missing dates
    const missingDates = await client.fetch(`
      count(*[_type == "amazonPodcast" && !defined(date)])
    `)
    
    console.log(`\n${missingDates} podcasts are missing the 'date' field`)
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
checkPodcastDates()