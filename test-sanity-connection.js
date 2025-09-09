const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function testConnection() {
  try {
    console.log('Testing Sanity connection...');
    
    // Test basic connection
    const result = await sanityClient.fetch('*[_type == "menu"] | order(_updatedAt desc) [0]');
    console.log('Connection successful!');
    console.log('Latest menu document:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Connection failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.statusCode,
      details: error.details
    });
  }
}

testConnection();