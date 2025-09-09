import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { cloudinarySchemaPlugin, cloudinaryAssetSourcePlugin } from 'sanity-plugin-cloudinary'
import schemaTypes from './sanity/schemas'
import { structure } from './sanity/deskStructure'

export default defineConfig({
  name: 'waiheke-radio',
  title: 'Waiheke Radio',
  
  projectId: '7nd9afqv',
  dataset: 'production',

  plugins: [
    structureTool({
      structure
    }), 
    visionTool(), 
    cloudinarySchemaPlugin(),
    cloudinaryAssetSourcePlugin()
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Enable all document actions including delete
    actions: (prev, context) => {
      // Ensure all default actions are available
      return prev
    },
    // Default new documents to draft mode
    unstable_globalEdit: true,
  },
})