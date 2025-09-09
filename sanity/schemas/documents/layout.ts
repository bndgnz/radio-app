import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'layout',
  title: 'Layout',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'showLayoutTitle',
      title: 'Show Layout Title',
      type: 'boolean',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'layoutColumn' }] }],
    }),
  ],
})