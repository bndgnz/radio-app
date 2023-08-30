import { useQuery, gql } from "@apollo/client";

function generateSiteMap() {
  const QUERY = gql`
    query GetPages {
      landingPageCollection(limit: 200) {
        total
        items {
          slug
        }
      }
      showsCollection(limit: 300) {
        total
        items {
          slug
        }
      }
      amazonPodcastCollection(limit: 4000) {
        total
        items {
          slug
        }
      }
    }
  `;
  const { data, loading, error } = useQuery(QUERY);
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  console.log(data);
  const base = "https://waihekeradio.org.nz";

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   ${data.showsCollection.items
     .map((item) => {
       return `
       <url>
           <loc>${base + "/shows/"}${`${item.slug}`}</loc>
       </url>
     `;
     })
     .join("")}

       ${data.amazonPodcastCollection.items
         .map((item) => {
           return `
      <url>
          <loc>${base + "/podcast/"}${`${item.slug}`}</loc>
      </url>
    `;
         })
         .join("")}

      ${data.landingPageCollection.items
        .map((item) => {
          return `
      <url>
          <loc>${base + "/"}${`${item.slug}`}</loc>
      </url>
    `;
        })
        .join("")}
   </urlset>
 `;
}

export default generateSiteMap;
