import { getPageBySlug } from "@/src/utils/api";
 



export default async (req, res) => {

  const page = await getPageBySlug(req.query.slug, true)
 
  
    
    if (req.query.secret !== 'preview' || !req.query.slug) {
      return res.status(401).json({ message: 'Invalid token' })
    }
   
   
    // If the slug doesn't exist prevent preview mode from being enabled
    if (!page) {
      return res.status(401).json({ message: 'Invalid slug' + req.query.slug })
    }
   
    // Enable Preview Mode by setting the cookies
    res.setPreviewData({})
    const url = "../"+ page.items[0].fields.slug;
    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    res.setHeader('Content-Type', 'text/html')
    res.write(
        `<!DOCTYPE html><html><head​​><meta http-equiv="Refresh" content="0; url=${url}" />
        <script>window.location.href = '${url}'</script>
        </head>
        </html>`
    )
    res.end()
  }

 