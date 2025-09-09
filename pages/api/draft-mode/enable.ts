import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '@/lib/sanity.client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { slug, secret, type } = req.query

  // Check the secret and next parameters
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid preview secret' })
  }

  // Fetch the document to check if it exists
  const client = getClient(true) // Get preview client with token
  
  try {
    let query = ''
    let params = {}

    if (type === 'landingPage') {
      query = `*[_type == "landingPage" && slug.current == $slug][0]`
      params = { slug }
    } else {
      return res.status(400).json({ message: 'Invalid document type' })
    }

    const document = await client.fetch(query, params)

    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // Enable Draft Mode by setting the cookies
    res.setDraftMode({ enable: true })

    // Redirect to the path from the fetched document
    const redirectPath = type === 'landingPage' 
      ? `/${document.slug?.current || ''}` 
      : '/'

    res.writeHead(307, { Location: redirectPath })
    res.end()
  } catch (error) {
    console.error('Preview API error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}