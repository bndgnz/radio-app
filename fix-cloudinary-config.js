require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function fixCloudinaryConfig() {
  console.log('Fixing Cloudinary configuration...')
  
  try {
    // Delete any existing cloudinary config documents
    const existingConfigs = await client.fetch('*[_type match "cloudinary*"]')
    console.log('Found existing configs:', existingConfigs.length)
    
    for (const config of existingConfigs) {
      await client.delete(config._id)
      console.log(`Deleted config: ${config._id}`)
    }
    
    // Create the config document with different possible IDs/types the plugin might expect
    const configOptions = [
      {
        _id: 'cloudinary.config',
        _type: 'cloudinary.config',
        cloudName: 'waiheke-radio',
        apiKey: '555896439173575',
        apiSecret: process.env.SANITY_STUDIO_CLOUDINARY_API_SECRET
      },
      {
        _id: 'cloudinaryConfig',
        _type: 'cloudinaryConfig', 
        cloudName: 'waiheke-radio',
        apiKey: '555896439173575',
        apiSecret: process.env.SANITY_STUDIO_CLOUDINARY_API_SECRET
      },
      {
        _id: 'sanity-plugin-cloudinary.config',
        _type: 'sanity-plugin-cloudinary.config',
        cloudName: 'waiheke-radio',
        apiKey: '555896439173575',
        apiSecret: process.env.SANITY_STUDIO_CLOUDINARY_API_SECRET
      }
    ]
    
    for (const config of configOptions) {
      try {
        await client.createOrReplace(config)
        console.log(`✅ Created config: ${config._id} (${config._type})`)
      } catch (error) {
        console.log(`❌ Failed to create ${config._id}:`, error.message)
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to fix config:', error)
  }
}

fixCloudinaryConfig()