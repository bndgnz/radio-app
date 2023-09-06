import * as contentful from "@/src/utils/contentful"

export default async function handler(req, res) {
  const { secret, slug } = req.query
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const page = await contentful.previewClient
    .getEntries({
      content_type: 'landingPage',
      limit: 1,
      "fields.slug": slug,
    })

  if (!page.items.length) {
    return res.status(401).json({ message: 'Invalid page' })
  }

  const pageFields = page.items[0].fields
 console.log("pageFields")

  res.setPreviewData({})
  res.redirect(`/${pageFields.slug}`)
}