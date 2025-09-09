require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

console.log('Token loaded:', process.env.SANITY_API_WRITE_TOKEN ? 'Yes' : 'No')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function testSingleUpdate() {
  console.log('Testing single document update...')
  
  try {
    // Get one document with legacy Cloudinary data
    const query = `
      *[
        (defined(cloudinaryImage) && cloudinaryImage._type != "cloudinary.asset") ||
        (defined(cimage) && cimage._type != "cloudinary.asset") ||
        (defined(bannerImage) && bannerImage._type != "cloudinary.asset")
      ][0] {
        _id,
        _type,
        cloudinaryImage,
        cimage,
        bannerImage
      }
    `
    
    const doc = await client.fetch(query)
    
    if (!doc) {
      console.log('No documents found with legacy format!')
      return
    }
    
    console.log(`Found document: ${doc._type} - ${doc._id}`)
    
    const updates = {}
    
    // Convert cloudinaryImage if it's in legacy format
    if (doc.cloudinaryImage && Array.isArray(doc.cloudinaryImage) && doc.cloudinaryImage.length > 0) {
      const legacy = doc.cloudinaryImage[0]
      updates.cloudinaryImage = {
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
      console.log('Converting cloudinaryImage field')
    }
    
    // Convert cimage if it's in legacy format  
    if (doc.cimage && Array.isArray(doc.cimage) && doc.cimage.length > 0) {
      const legacy = doc.cimage[0]
      updates.cimage = {
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
      console.log('Converting cimage field')
    }
    
    // Convert bannerImage if it's in legacy format
    if (doc.bannerImage && Array.isArray(doc.bannerImage) && doc.bannerImage.length > 0) {
      const legacy = doc.bannerImage[0]
      updates.bannerImage = {
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
      console.log('Converting bannerImage field')
    }
    
    if (Object.keys(updates).length > 0) {
      await client.patch(doc._id).set(updates).commit()
      console.log('✅ Successfully updated document!')
    } else {
      console.log('No updates needed')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testSingleUpdate()