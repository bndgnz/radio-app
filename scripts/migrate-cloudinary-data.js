require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN, // Updated to use correct env var
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function migrateCloudinaryData() {
  console.log('Starting Cloudinary data migration...')
  
  try {
    // Fetch all documents with legacy Cloudinary arrays
    const query = `
      *[defined(cloudinaryImage) || defined(cimage) || defined(bannerImage)] {
        _id,
        _type,
        cloudinaryImage,
        cimage,
        bannerImage
      }
    `
    
    const documents = await client.fetch(query)
    console.log(`Found ${documents.length} documents with Cloudinary data`)
    
    for (const doc of documents) {
      const patches = []
      
      // Convert cloudinaryImage (landingPage)
      if (doc.cloudinaryImage && Array.isArray(doc.cloudinaryImage) && doc.cloudinaryImage.length > 0) {
        const legacy = doc.cloudinaryImage[0] // Take first item from array
        const newFormat = {
          _type: 'cloudinary.asset',
          public_id: legacy.public_id,
          version: legacy.version,
          format: legacy.format,
          resource_type: legacy.resource_type || 'image',
          type: legacy.type || 'upload',
          width: legacy.width,
          height: legacy.height,
          bytes: legacy.bytes,
          url: legacy.secure_url || legacy.url,
          secure_url: legacy.secure_url
        }
        patches.push({ set: { cloudinaryImage: newFormat } })
      }
      
      // Convert cimage (shows)
      if (doc.cimage && Array.isArray(doc.cimage) && doc.cimage.length > 0) {
        const legacy = doc.cimage[0] // Take first item from array
        const newFormat = {
          _type: 'cloudinary.asset',
          public_id: legacy.public_id,
          version: legacy.version,
          format: legacy.format,
          resource_type: legacy.resource_type || 'image',
          type: legacy.type || 'upload',
          width: legacy.width,
          height: legacy.height,
          bytes: legacy.bytes,
          url: legacy.secure_url || legacy.url,
          secure_url: legacy.secure_url
        }
        patches.push({ set: { cimage: newFormat } })
      }
      
      // Convert bannerImage (banner)
      if (doc.bannerImage && Array.isArray(doc.bannerImage) && doc.bannerImage.length > 0) {
        const legacy = doc.bannerImage[0] // Take first item from array
        const newFormat = {
          _type: 'cloudinary.asset',
          public_id: legacy.public_id,
          version: legacy.version,
          format: legacy.format,
          resource_type: legacy.resource_type || 'image',
          type: legacy.type || 'upload',
          width: legacy.width,
          height: legacy.height,
          bytes: legacy.bytes,
          url: legacy.secure_url || legacy.url,
          secure_url: legacy.secure_url
        }
        patches.push({ set: { bannerImage: newFormat } })
      }
      
      // Apply patches if any
      if (patches.length > 0) {
        for (const patch of patches) {
          await client.patch(doc._id).set(patch.set).commit()
        }
        console.log(`✅ Migrated ${doc._type} document: ${doc._id}`)
      }
    }
    
    console.log('✅ Migration completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run migration
migrateCloudinaryData()