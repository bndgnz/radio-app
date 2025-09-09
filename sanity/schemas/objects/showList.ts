import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'showList',
  title: 'Show List',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'shows',
      title: 'Shows',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
    defineField({
      name: 'showArchived',
      title: 'Show Archived',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})