require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function fixMigratedCloudinaryData() {
  console.log('🔄 Fixing migrated Cloudinary data for plugin compatibility...')
  
  try {
    // Get all documents with cloudinary.asset fields
    const query = `
      *[
        (defined(cloudinaryImage) && cloudinaryImage._type == "cloudinary.asset") ||
        (defined(cimage) && cimage._type == "cloudinary.asset") ||
        (defined(bannerImage) && bannerImage._type == "cloudinary.asset")
      ] {
        _id,
        _type,
        cloudinaryImage,
        cimage,
        bannerImage
      }
    `
    
    const documents = await client.fetch(query)
    console.log(`📋 Found ${documents.length} documents with migrated Cloudinary data`)
    
    let fixedCount = 0
    
    for (const doc of documents) {
      console.log(`🔧 Processing ${doc._type}: ${doc._id}`)
      
      const updates = {}
      
      // Fix cloudinaryImage field
      if (doc.cloudinaryImage && doc.cloudinaryImage._type === 'cloudinary.asset') {
        const fixed = {
          _type: 'cloudinary.asset',
          public_id: doc.cloudinaryImage.public_id,
          version: doc.cloudinaryImage.version,
          format: doc.cloudinaryImage.format,
          resource_type: doc.cloudinaryImage.resource_type || 'image',
          type: doc.cloudinaryImage.type || 'upload',
          width: doc.cloudinaryImage.width,
          height: doc.cloudinaryImage.height,
          bytes: doc.cloudinaryImage.bytes,
          url: doc.cloudinaryImage.url,
          secure_url: doc.cloudinaryImage.secure_url,
          // Add plugin-required fields
          _key: `cloudinary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _sanityAsset: `image@${doc.cloudinaryImage.public_id}`,
        }
        updates.cloudinaryImage = fixed
        console.log(`  ↳ Fixed cloudinaryImage field`)
      }
      
      // Fix cimage field
      if (doc.cimage && doc.cimage._type === 'cloudinary.asset') {
        const fixed = {
          _type: 'cloudinary.asset',
          public_id: doc.cimage.public_id,
          version: doc.cimage.version,
          format: doc.cimage.format,
          resource_type: doc.cimage.resource_type || 'image',
          type: doc.cimage.type || 'upload',
          width: doc.cimage.width,
          height: doc.cimage.height,
          bytes: doc.cimage.bytes,
          url: doc.cimage.url,
          secure_url: doc.cimage.secure_url,
          // Add plugin-required fields
          _key: `cloudinary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _sanityAsset: `image@${doc.cimage.public_id}`,
        }
        updates.cimage = fixed
        console.log(`  ↳ Fixed cimage field`)
      }
      
      // Fix bannerImage field
      if (doc.bannerImage && doc.bannerImage._type === 'cloudinary.asset') {
        const fixed = {
          _type: 'cloudinary.asset',
          public_id: doc.bannerImage.public_id,
          version: doc.bannerImage.version,
          format: doc.bannerImage.format,
          resource_type: doc.bannerImage.resource_type || 'image',
          type: doc.bannerImage.type || 'upload',
          width: doc.bannerImage.width,
          height: doc.bannerImage.height,
          bytes: doc.bannerImage.bytes,
          url: doc.bannerImage.url,
          secure_url: doc.bannerImage.secure_url,
          // Add plugin-required fields
          _key: `cloudinary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _sanityAsset: `image@${doc.bannerImage.public_id}`,
        }
        updates.bannerImage = fixed
        console.log(`  ↳ Fixed bannerImage field`)
      }
      
      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await client.patch(doc._id).set(updates).commit()
        console.log(`✅ Fixed ${doc._type}: ${doc._id}`)
        fixedCount++
      }
    }
    
    console.log(`🎉 Fixed ${fixedCount} documents for plugin compatibility!`)
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixMigratedCloudinaryData()