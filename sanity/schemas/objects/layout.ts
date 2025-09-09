import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'layout',
  title: 'Layout',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [{ type: 'layoutColumn' }],
    }),
    defineField({
      name: 'showLayoutTitle',
      title: 'Show Layout Title',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})