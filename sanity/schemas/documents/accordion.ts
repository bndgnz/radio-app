import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'content', type: 'array', of: [{ type: 'block' }], title: 'Content' },
          ],
        },
      ],
    }),
  ],
})