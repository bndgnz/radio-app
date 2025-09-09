// This script converts legacy Cloudinary array format to the new cloudinary.asset format
// Run with: npx sanity exec migrations/convert-cloudinary-format.js --with-user-token

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const convertLegacyToCloudinaryAsset = (legacyArray) => {
  if (!Array.isArray(legacyArray) || legacyArray.length === 0) {
    return null
  }
  
  const legacy = legacyArray[0] // Take first item from array
  
  return {
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
}

export default async function migrateCloudinaryData() {
  console.log('🔄 Starting Cloudinary data migration...')
  
  try {
    // Get all documents with legacy Cloudinary arrays
    const query = `
      *[
        (defined(cloudinaryImage) && cloudinaryImage._type != "cloudinary.asset") ||
        (defined(cimage) && cimage._type != "cloudinary.asset") ||
        (defined(bannerImage) && bannerImage._type != "cloudinary.asset")
      ] {
        _id,
        _type,
        cloudinaryImage,
        cimage,
        bannerImage
      }
    `
    
    const documents = await client.fetch(query)
    console.log(`📋 Found ${documents.length} documents with legacy Cloudinary data`)
    
    if (documents.length === 0) {
      console.log('✅ No documents need migration!')
      return
    }
    
    const transaction = client.transaction()
    
    for (const doc of documents) {
      console.log(`🔧 Processing ${doc._type} document: ${doc._id}`)
      
      const updates = {}
      
      // Convert cloudinaryImage (landingPage)
      if (doc.cloudinaryImage && Array.isArray(doc.cloudinaryImage)) {
        const newFormat = convertLegacyToCloudinaryAsset(doc.cloudinaryImage)
        if (newFormat) {
          updates.cloudinaryImage = newFormat
          console.log(`  ↳ Converting cloudinaryImage field`)
        }
      }
      
      // Convert cimage (shows) 
      if (doc.cimage && Array.isArray(doc.cimage)) {
        const newFormat = convertLegacyToCloudinaryAsset(doc.cimage)
        if (newFormat) {
          updates.cimage = newFormat
          console.log(`  ↳ Converting cimage field`)
        }
      }
      
      // Convert bannerImage (banner)
      if (doc.bannerImage && Array.isArray(doc.bannerImage)) {
        const newFormat = convertLegacyToCloudinaryAsset(doc.bannerImage)
        if (newFormat) {
          updates.bannerImage = newFormat
          console.log(`  ↳ Converting bannerImage field`)
        }
      }
      
      // Apply updates
      if (Object.keys(updates).length > 0) {
        transaction.patch(doc._id, { set: updates })
      }
    }
    
    console.log('💾 Committing transaction...')
    await transaction.commit()
    
    console.log('✅ Migration completed successfully!')
    console.log(`📊 Migrated ${documents.length} documents`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}