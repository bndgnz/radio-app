import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'htmlBlock',
  title: 'HTML Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'htmlContent',
      title: 'HTML Content',
      type: 'text',
      description: 'Raw HTML content to be rendered',
    }),
  ],
})