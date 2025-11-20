// Visual editing disabled - next-sanity not installed
interface VisualEditingOverlayProps {
  draftMode?: boolean
  documentType?: string
  documentId?: string
}

export function VisualEditingOverlay({ draftMode, documentType = 'landingPage', documentId }: VisualEditingOverlayProps) {
  return null
}