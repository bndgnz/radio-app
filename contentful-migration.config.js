require('dotenv').config();

module.exports = {
  contentful: {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
  },
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID || 'radio-sanity',
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_EDITOR_TOKEN
  },
  migration: {
    fieldsToExtract: ['title', 'description', 'slug', 'image', 'body', 'content'],
    dryRun: false,
    deleteExisting: false
  }
};