import { useEffect } from 'react'
import { enableVisualEditing } from 'next-sanity'

export function VisualEditing() {
  useEffect(() => {
    // Only enable visual editing in development mode and when in draft mode
    if (process.env.NODE_ENV === 'development' && window.location.search.includes('preview=true')) {
      enableVisualEditing({
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`,
      })
    }
  }, [])

  return null
}