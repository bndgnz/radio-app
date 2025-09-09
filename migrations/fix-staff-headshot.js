// Migration script to convert all cloudinary fields from array/object data to cloudinary.asset format
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', 
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

console.log('Using Sanity config:', {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  hasToken: !!(process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN)
})

function convertToCloudinaryAsset(imageData) {
  // Handle array format (get first item)
  const data = Array.isArray(imageData) ? imageData[0] : imageData
  
  if (!data || !data.public_id) {
    return null
  }
  
  // Convert to cloudinary.asset format
  return {
    _type: 'cloudinary.asset',
    public_id: data.public_id,
    version: data.version,
    format: data.format,
    resource_type: data.resource_type || 'image',
    type: data.type || 'upload',
    created_at: data.created_at,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
    url: data.url,
    secure_url: data.secure_url,
    original_url: data.original_url,
    original_secure_url: data.original_secure_url,
    raw_transformation: data.raw_transformation,
    tags: data.tags || [],
    metadata: data.metadata || {}
  }
}

async function migrateStaffHeadshots() {
  // Fetch all staff documents with headshot arrays or objects
  const staffMembers = await client.fetch(`
    *[_type == "staff" && defined(headshot) && (headshot[0]._key != null || headshot.public_id != null)] {
      _id,
      _rev,
      title,
      headshot
    }
  `)

  console.log(`Found ${staffMembers.length} staff members with headshots to migrate`)

  for (const staff of staffMembers) {
    const cloudinaryAsset = convertToCloudinaryAsset(staff.headshot)
    
    if (!cloudinaryAsset) {
      console.log(`⚠️  Skipped ${staff.title} - no valid image data`)
      continue
    }

    try {
      await client
        .patch(staff._id)
        .set({ headshot: cloudinaryAsset })
        .commit()
      
      console.log(`✅ Migrated headshot for ${staff.title} (${staff._id})`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${staff.title} (${staff._id}):`, error)
    }
  }
}

async function migrateAmazonPodcastImages() {
  // Fetch all amazonPodcast documents with podcastImage objects
  const podcasts = await client.fetch(`
    *[_type == "amazonPodcast" && defined(podcastImage) && podcastImage.public_id != null] {
      _id,
      _rev,
      title,
      podcastImage
    }
  `)

  console.log(`Found ${podcasts.length} amazon podcasts with images to migrate`)

  for (const podcast of podcasts) {
    const cloudinaryAsset = convertToCloudinaryAsset(podcast.podcastImage)
    
    if (!cloudinaryAsset) {
      console.log(`⚠️  Skipped ${podcast.title} - no valid image data`)
      continue
    }

    try {
      await client
        .patch(podcast._id)
        .set({ podcastImage: cloudinaryAsset })
        .commit()
      
      console.log(`✅ Migrated podcast image for ${podcast.title} (${podcast._id})`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${podcast.title} (${podcast._id}):`, error)
    }
  }
}

async function migrateShowImages() {
  // Fetch all shows documents with showImage arrays or objects
  const shows = await client.fetch(`
    *[_type == "shows" && defined(showImage) && (showImage[0]._key != null || showImage.public_id != null)] {
      _id,
      _rev,
      title,
      showImage
    }
  `)

  console.log(`Found ${shows.length} shows with images to migrate`)

  for (const show of shows) {
    const cloudinaryAsset = convertToCloudinaryAsset(show.showImage)
    
    if (!cloudinaryAsset) {
      console.log(`⚠️  Skipped ${show.title} - no valid image data`)
      continue
    }

    try {
      await client
        .patch(show._id)
        .set({ showImage: cloudinaryAsset })
        .commit()
      
      console.log(`✅ Migrated show image for ${show.title} (${show._id})`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${show.title} (${show._id}):`, error)
    }
  }
}

async function migrateBannerImages() {
  // Fetch all banner documents with bannerImage or heroImage arrays or objects
  const banners = await client.fetch(`
    *[_type == "banner" && (
      (defined(bannerImage) && (bannerImage[0]._key != null || bannerImage.public_id != null)) ||
      (defined(heroImage) && (heroImage[0]._key != null || heroImage.public_id != null))
    )] {
      _id,
      _rev,
      title,
      bannerImage,
      heroImage
    }
  `)

  console.log(`Found ${banners.length} banners with images to migrate`)

  for (const banner of banners) {
    const patches = {}
    
    if (banner.bannerImage) {
      const cloudinaryAsset = convertToCloudinaryAsset(banner.bannerImage)
      if (cloudinaryAsset) {
        patches.bannerImage = cloudinaryAsset
      }
    }
    
    if (banner.heroImage) {
      const cloudinaryAsset = convertToCloudinaryAsset(banner.heroImage)
      if (cloudinaryAsset) {
        patches.heroImage = cloudinaryAsset
      }
    }
    
    if (Object.keys(patches).length === 0) {
      console.log(`⚠️  Skipped ${banner.title} - no valid image data`)
      continue
    }

    try {
      await client
        .patch(banner._id)
        .set(patches)
        .commit()
      
      console.log(`✅ Migrated banner images for ${banner.title} (${banner._id})`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${banner.title} (${banner._id}):`, error)
    }
  }
}

async function migrateLandingPageImages() {
  // Fetch all landingPage documents with cloudinaryImage arrays or objects
  const landingPages = await client.fetch(`
    *[_type == "landingPage" && defined(cloudinaryImage) && (cloudinaryImage[0]._key != null || cloudinaryImage.public_id != null)] {
      _id,
      _rev,
      title,
      cloudinaryImage
    }
  `)

  console.log(`Found ${landingPages.length} landing pages with images to migrate`)

  for (const page of landingPages) {
    const cloudinaryAsset = convertToCloudinaryAsset(page.cloudinaryImage)
    
    if (!cloudinaryAsset) {
      console.log(`⚠️  Skipped ${page.title} - no valid image data`)
      continue
    }

    try {
      await client
        .patch(page._id)
        .set({ cloudinaryImage: cloudinaryAsset })
        .commit()
      
      console.log(`✅ Migrated landing page image for ${page.title} (${page._id})`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${page.title} (${page._id}):`, error)
    }
  }
}

async function runAllMigrations() {
  console.log('🚀 Starting cloudinary field migrations...\n')
  
  try {
    await migrateStaffHeadshots()
    console.log('')
    
    await migrateAmazonPodcastImages()
    console.log('')
    
    await migrateShowImages()
    console.log('')
    
    await migrateBannerImages()
    console.log('')
    
    await migrateLandingPageImages()
    console.log('')
    
    console.log('🎉 All migrations complete!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run all migrations
runAllMigrations()