const { createClient } = require('@sanity/client');
require('dotenv').config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false
});

const query = `*[_type == "landingPage" && slug.current == "home"][0]{
  "title": title,
  "slug": slug,
  pageDesign->{
    title,
    header {
      rows[] {
        columns[] {
          size,
          components[] {
            ...,
            _type == "reference" => @->{
              _type,
              _id,
              title,
              logo,
              frequency,
              teReo,
              link->{
                slug,
                _type
              }
            }
          }
        }
      }
    }
  }
}`;

client.fetch(query)
  .then(data => {
    console.log('Home page data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data?.pageDesign?.header?.rows?.[0]?.columns?.[0]?.components?.[0]) {
      console.log('\nFirst header component:');
      console.log(JSON.stringify(data.pageDesign.header.rows[0].columns[0].components[0], null, 2));
    }
  })
  .catch(err => {
    console.error('Error fetching data:', err);
  });