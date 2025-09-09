const { createClient } = require('@sanity/client');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.SANITY_STUDIO_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.SANITY_STUDIO_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.SANITY_STUDIO_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

// Configure Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv', 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN, // Need write permissions
  useCdn: false,
});

async function migrateEmbeddedImages() {
  console.log('🔍 Finding documents with embedded images...');
  
  // Find all landing pages with content that might have embedded images
  const documents = await sanityClient.fetch(`
    *[_type == "landingPage" && defined(content)] {
      _id,
      _rev,
      title,
      content[] {
        ...,
        _type == "image" => {
          _key,
          _type,
          asset->{
            _id,
            url,
            originalFilename,
            mimeType,
            size,
            metadata
          },
          alt,
          caption
        }
      }
    }
  `);

  console.log(`Found ${documents.length} documents to check`);

  for (const doc of documents) {
    console.log(`\n📄 Processing: ${doc.title}`);
    
    if (!doc.content || !Array.isArray(doc.content)) {
      console.log('  ⏭️  No content array found, skipping');
      continue;
    }

    const imageBlocks = doc.content.filter(block => block._type === 'image');
    
    if (imageBlocks.length === 0) {
      console.log('  ✅ No embedded images found');
      continue;
    }

    console.log(`  🖼️  Found ${imageBlocks.length} embedded image(s)`);
    
    let updatedContent = [...doc.content];
    let hasChanges = false;

    for (const imageBlock of imageBlocks) {
      try {
        console.log(`    📥 Migrating image: ${imageBlock.asset?.originalFilename || imageBlock._key}`);
        
        if (!imageBlock.asset || !imageBlock.asset.url) {
          console.log(`    ❌ No asset URL found for image ${imageBlock._key}`);
          continue;
        }

        // Upload to Cloudinary in the 'embedded' folder
        const uploadResult = await cloudinary.uploader.upload(imageBlock.asset.url, {
          folder: 'embedded',
          public_id: imageBlock.asset.originalFilename 
            ? imageBlock.asset.originalFilename.replace(/\.[^/.]+$/, '') // Remove extension
            : `migrated_${imageBlock._key}`,
          context: {
            alt: imageBlock.alt || '',
            caption: imageBlock.caption || '',
            original_sanity_id: imageBlock.asset._id,
            migrated_from: 'sanity_embedded_image'
          }
        });

        console.log(`    ✅ Uploaded to Cloudinary: ${uploadResult.public_id}`);

        // Replace the image block with a Cloudinary asset block
        const index = updatedContent.findIndex(block => block._key === imageBlock._key);
        if (index !== -1) {
          updatedContent[index] = {
            _key: imageBlock._key,
            _type: 'cloudinary.asset',
            public_id: uploadResult.public_id,
            version: uploadResult.version,
            signature: uploadResult.signature,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            resource_type: uploadResult.resource_type,
            created_at: uploadResult.created_at,
            bytes: uploadResult.bytes,
            type: uploadResult.type,
            url: uploadResult.url,
            secure_url: uploadResult.secure_url,
            context: {
              alt: imageBlock.alt || '',
              caption: imageBlock.caption || '',
            }
          };
          hasChanges = true;
        }

      } catch (error) {
        console.error(`    ❌ Error migrating image ${imageBlock._key}:`, error.message);
      }
    }

    // Update the document if there were changes
    if (hasChanges) {
      try {
        await sanityClient
          .patch(doc._id)
          .set({ content: updatedContent })
          .commit();
        
        console.log(`  ✅ Updated document: ${doc.title}`);
      } catch (error) {
        console.error(`  ❌ Error updating document ${doc._id}:`, error.message);
      }
    }
  }

  console.log('\n🎉 Migration completed!');
}

// Run the migration
if (require.main === module) {
  migrateEmbeddedImages().catch(console.error);
}

module.exports = { migrateEmbeddedImages };