import * as contentful from "contentful";


export const getPageBySlug = async (slug, preview) => {

 
  
const deliveryCall = {
  space: process.env.CONTENTFUL_SPACE_ID,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
};
const previewCall = {
  space: process.env.CONTENTFUL_SPACE_ID,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: "preview.contentful.com",
};

console.log(preview)

const call = preview ? previewCall : deliveryCall;

  const client = contentful.createClient( call );
  const response = await client.getEntries({
    content_type: "landingPage",
    "fields.slug[in]": slug,
  });
 
  return response;
};
