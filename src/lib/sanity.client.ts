import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7nd9afqv'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const useCdn = process.env.NODE_ENV === 'production'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || `https://${projectId}.sanity.studio`,
  },
})

// For server-side preview support
export const getClient = (preview: boolean = false) => {
  if (preview && process.env.SANITY_API_READ_TOKEN) {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: 'previewDrafts',
      stega: {
        enabled: true,
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || `https://${projectId}.sanity.studio`,
      },
    })
  }
  return sanityClient
}