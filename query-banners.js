const { getCliClient } = require('sanity/cli')

const client = getCliClient()

const query = `*[_type == "list" && type == "Banner List"][0]{
  ...,
  banners[]->{
    ...,
    bannerImage,
    ctaLayout
  }
}`

client.fetch(query).then((result) => {
  console.log('Banner data:')
  console.log(JSON.stringify(result, null, 2))
}).catch((err) => {
  console.error('Error:', err)
})