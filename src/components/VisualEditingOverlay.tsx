import { useEffect, useState } from 'react'
import { enableVisualEditing } from 'next-sanity'

interface VisualEditingOverlayProps {
  draftMode?: boolean
  documentType?: string
  documentId?: string
}

export function VisualEditingOverlay({ draftMode, documentType = 'landingPage', documentId }: VisualEditingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Enable visual editing
      enableVisualEditing({
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`,
      })
      
      // Show the overlay after a brief delay
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`
  const editUrl = documentId 
    ? `${studioUrl}/intent/edit/id=${documentId};type=${documentType}`
    : `${studioUrl}/desk/${documentType}`

  return (
    <div
      style={{
        margin: '20px 0',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        color: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
            📝 Visual Editing Active
          </h3>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
            Click on content to edit in Sanity Studio
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          🎨 Edit in Studio
        </a>
        
        <button
          onClick={async () => {
            await fetch('/api/draft-mode/disable', { method: 'POST' })
            window.location.reload()
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          👁️ Exit Preview
        </button>
      </div>

      <div style={{ 
        marginTop: '12px', 
        padding: '8px', 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '6px',
        fontSize: '11px',
        opacity: 0.8
      }}>
        <strong>Document:</strong> {documentType}<br />
        {documentId && <><strong>ID:</strong> {documentId}</>}
      </div>
    </div>
  )
}