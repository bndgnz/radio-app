import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const query = `*[_type == "menu"][0]{
  ...,
  linksCollection{
    items[]{
      ...,
      internalLink->{...},
      sublinksCollection{
        items[]{
          ...,
          internalLink->{...}
        }
      }
    }
  }
}`

client.fetch(query).then((result) => {
  console.log('Menu data:')
  console.log(JSON.stringify(result, null, 2))
}).catch((err) => {
  console.error('Error:', err)
})