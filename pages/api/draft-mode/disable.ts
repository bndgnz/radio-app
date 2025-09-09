import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Clear the preview mode cookies
  res.setDraftMode({ enable: false })

  // Redirect to the current page or homepage
  const referer = req.headers.referer || '/'
  const redirectUrl = new URL(referer, `http://${req.headers.host}`)
  
  res.writeHead(307, { Location: redirectUrl.pathname })
  res.end()
}