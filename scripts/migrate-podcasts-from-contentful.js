require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('contentful');
const sanityClient = require('@sanity/client').createClient;
const { v4: uuidv4 } = require('uuid');

// Contentful client
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// Sanity client
const sanity = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Helper to convert Cloudinary image data to proper Sanity format
function convertCloudinaryImage(image) {
  if (!image) return null;
  
  // Handle if it's already an array (from previous migrations)
  const imageData = Array.isArray(image) ? image[0] : image;
  
  if (!imageData || !imageData.public_id) return null;
  
  // Create proper Cloudinary asset structure for Sanity
  return {
    _type: 'cloudinary.asset',
    public_id: imageData.public_id,
    resource_type: imageData.resource_type || 'image',
    type: imageData.type || 'upload',
    format: imageData.format,
    version: imageData.version,
    url: imageData.url,
    secure_url: imageData.secure_url,
    width: imageData.width,
    height: imageData.height,
    bytes: imageData.bytes,
    duration: imageData.duration || null,
    tags: imageData.tags || [],
    metadata: imageData.metadata || {},
    created_at: imageData.created_at || new Date().toISOString(),
    raw_transformation: imageData.raw_transformation || 'f_auto/q_auto',
    original_url: imageData.original_url || imageData.url,
    original_secure_url: imageData.original_secure_url || imageData.secure_url
  };
}

// Helper to generate Sanity document ID from Contentful ID
function generateSanityId(contentfulId) {
  return `amazonPodcast-${contentfulId}`;
}

// Helper to create slug from title
function createSlug(title) {
  if (!title) return null;
  return {
    current: title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  };
}

async function getExistingPodcasts() {
  console.log('Fetching existing Amazon Podcasts from Sanity...');
  const existing = await sanity.fetch(`*[_type == "amazonPodcast"]{
    _id,
    title,
    _createdAt,
    _updatedAt
  }`);
  
  // Extract contentful ID from Sanity ID manually
  const withContentfulIds = existing.map(podcast => ({
    ...podcast,
    contentfulId: podcast._id.startsWith('amazonPodcast-') 
      ? podcast._id.substring(14) 
      : null
  }));
  
  console.log(`Found ${existing.length} existing podcasts`);
  return withContentfulIds;
}

async function getShowsMapping() {
  console.log('Creating shows mapping...');
  const shows = await sanity.fetch(`*[_type == "shows"]{
    _id,
    title
  }`);
  
  const mapping = new Map();
  shows.forEach(show => {
    // Extract contentful ID from show ID
    const contentfulId = show._id.startsWith('shows-') 
      ? show._id.substring(6) 
      : null;
    if (contentfulId) {
      mapping.set(contentfulId, show._id);
    }
  });
  
  console.log(`Created mapping for ${mapping.size} shows`);
  return mapping;
}

async function migratePodcasts() {
  console.log('\n=== PODCAST MIGRATION FROM CONTENTFUL ===\n');
  
  try {
    // Get existing data
    const existingPodcasts = await getExistingPodcasts();
    const existingMap = new Map();
    existingPodcasts.forEach(p => {
      if (p.contentfulId) {
        existingMap.set(p.contentfulId, p);
      }
    });
    
    const showsMapping = await getShowsMapping();
    
    // Fetch all amazonPodcast entries from Contentful
    console.log('Fetching Amazon Podcasts from Contentful...');
    const response = await contentfulClient.getEntries({
      content_type: 'amazonPodcast',
      include: 2,
      limit: 1000, // Increase limit to get all entries
    });
    
    console.log(`Found ${response.items.length} podcasts in Contentful`);
    
    const documents = [];
    const updates = [];
    const duplicates = [];
    
    // Track titles to detect duplicates
    const titleTracker = new Map();
    
    for (const entry of response.items) {
      const contentfulId = entry.sys.id;
      const sanityId = generateSanityId(contentfulId);
      
      // Check for title duplicates
      const title = entry.fields.title;
      if (titleTracker.has(title)) {
        duplicates.push({
          title,
          contentfulId,
          sanityId,
          existing: titleTracker.get(title)
        });
        console.log(`⚠ Duplicate title detected: "${title}"`);
        continue; // Skip duplicates
      }
      titleTracker.set(title, { contentfulId, sanityId });
      
      // Convert Cloudinary image
      const podcastImage = convertCloudinaryImage(entry.fields.podcastImage);
      
      // Handle show reference
      let showReference = null;
      if (entry.fields.show && entry.fields.show.sys && entry.fields.show.sys.id) {
        const showSanityId = showsMapping.get(entry.fields.show.sys.id);
        if (showSanityId) {
          showReference = {
            _type: 'reference',
            _ref: showSanityId,
          };
        } else {
          console.log(`⚠ Show not found for podcast "${title}": ${entry.fields.show.sys.id}`);
        }
      }
      
      // Create the document with all date fields
      const document = {
        _id: sanityId,
        _type: 'amazonPodcast',
        title: title,
        slug: entry.fields.slug ? { current: entry.fields.slug } : createSlug(title),
        podcastImage: podcastImage,
        description: entry.fields.description || '',
        date: entry.fields.date ? new Date(entry.fields.date).toISOString() : null,
        amazonUrl: entry.fields.amazonUrl || '',
        show: showReference,
        // Preserve Contentful system dates
        _createdAt: entry.sys.createdAt,
        _updatedAt: entry.sys.updatedAt,
      };
      
      // Check if this is new or updated
      const existing = existingMap.get(contentfulId);
      if (existing) {
        // Compare for changes (excluding system dates for comparison)
        const hasChanges = (
          existing.title !== document.title ||
          existing.description !== document.description ||
          existing.date !== document.date ||
          existing.amazonUrl !== document.amazonUrl ||
          JSON.stringify(existing.podcastImage) !== JSON.stringify(document.podcastImage)
        );
        
        if (hasChanges) {
          updates.push(document);
          console.log(`📝 Update needed: "${title}"`);
        } else {
          console.log(`✓ No changes: "${title}"`);
        }
      } else {
        documents.push(document);
        console.log(`➕ New podcast: "${title}"`);
      }
    }
    
    console.log(`\n=== MIGRATION SUMMARY ===`);
    console.log(`New podcasts: ${documents.length}`);
    console.log(`Updates needed: ${updates.length}`);
    console.log(`Duplicates skipped: ${duplicates.length}`);
    
    // Show duplicates
    if (duplicates.length > 0) {
      console.log(`\n=== DUPLICATES DETECTED ===`);
      duplicates.forEach(dup => {
        console.log(`"${dup.title}"`);
        console.log(`  Existing: ${dup.existing.contentfulId}`);
        console.log(`  Duplicate: ${dup.contentfulId} (skipped)`);
      });
    }
    
    // Process new documents
    if (documents.length > 0) {
      console.log(`\n=== CREATING NEW PODCASTS ===`);
      const batchSize = 50;
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const transaction = sanity.transaction();
        
        batch.forEach(doc => {
          // Create with preserved dates
          transaction.createOrReplace(doc);
        });
        
        await transaction.commit();
        console.log(`✓ Created ${Math.min(i + batchSize, documents.length)}/${documents.length} new podcasts`);
      }
    }
    
    // Process updates
    if (updates.length > 0) {
      console.log(`\n=== UPDATING EXISTING PODCASTS ===`);
      for (const doc of updates) {
        await sanity.createOrReplace(doc);
        console.log(`✓ Updated: "${doc.title}"`);
      }
    }
    
    console.log(`\n=== MIGRATION COMPLETE ===`);
    console.log(`✓ Created ${documents.length} new podcasts`);
    console.log(`✓ Updated ${updates.length} existing podcasts`);
    console.log(`⚠ Skipped ${duplicates.length} duplicates`);
    
    return {
      created: documents.length,
      updated: updates.length,
      skipped: duplicates.length,
      total: response.items.length
    };
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
migratePodcasts()
  .then(result => {
    console.log('\nPodcast migration completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nPodcast migration failed:', error);
    process.exit(1);
  });