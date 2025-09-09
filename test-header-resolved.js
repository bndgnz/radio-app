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
            itemRef._type == "headerConfiguration" => {
              ...,
              "resolvedHeader": *[_type == "headerConfiguration" && _id == ^.itemId][0]{
                ...,
                _id,
                _type,
                title,
                logo,
                frequency,
                teReo,
                link->{
                  ...,
                  slug,
                  _type
                }
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
    console.log('Home page header data:');
    
    if (data?.pageDesign?.header?.rows?.[0]?.columns?.[0]?.components?.[0]) {
      const component = data.pageDesign.header.rows[0].columns[0].components[0];
      console.log('\nHeader component data:');
      console.log(JSON.stringify(component, null, 2));
      
      if (component.resolvedHeader) {
        console.log('\nResolved header configuration:');
        console.log('Title:', component.resolvedHeader.title);
        console.log('Frequency:', component.resolvedHeader.frequency);
        console.log('Te Reo:', component.resolvedHeader.teReo);
        console.log('Logo:', component.resolvedHeader.logo);
      }
    }
  })
  .catch(err => {
    console.error('Error fetching data:', err);
  });