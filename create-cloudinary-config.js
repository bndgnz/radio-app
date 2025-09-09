require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function createCloudinaryConfig() {
  console.log('Creating Cloudinary configuration document...')
  
  try {
    const configDoc = {
      _id: 'cloudinary-settings',
      _type: 'cloudinary.settings',
      cloudName: 'waiheke-radio',
      apiKey: '555896439173575'
    }
    
    await client.createOrReplace(configDoc)
    console.log('✅ Cloudinary configuration created successfully!')
    
  } catch (error) {
    console.error('❌ Failed to create config:', error)
  }
}

createCloudinaryConfig()