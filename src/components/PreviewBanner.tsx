import { useState } from 'react'

interface PreviewBannerProps {
  draftMode?: boolean
}

export function PreviewBanner({ draftMode }: PreviewBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!draftMode || !isVisible) {
    return null
  }

  const handleDisablePreview = async () => {
    await fetch('/api/draft-mode/disable', { method: 'POST' })
    window.location.reload()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        📝 Visual Editing Mode: You can now click on content to edit in Sanity Studio
      </div>
      <div>
        <button
          onClick={handleDisablePreview}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginLeft: '8px',
          }}
        >
          Exit Preview
        </button>
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
            marginLeft: '8px',
          }}
        >
          ✕ Hide
        </button>
      </div>
    </div>
  )
}