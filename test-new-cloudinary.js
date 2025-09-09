require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

async function createTestDocument() {
  console.log('Creating test document with empty Cloudinary field...')
  
  try {
    const testDoc = {
      _id: 'test-cloudinary-field',
      _type: 'shows',
      title: 'Test Cloudinary Field',
      slug: { current: 'test-cloudinary' },
      // Leave cimage field empty to test if it's editable when null
    }
    
    await client.createOrReplace(testDoc)
    console.log('✅ Test document created: test-cloudinary-field')
    console.log('Check this document in Studio to see if Cloudinary field is editable when empty')
    
  } catch (error) {
    console.error('❌ Failed to create test document:', error)
  }
}

createTestDocument()