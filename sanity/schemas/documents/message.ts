import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'message',
  title: 'Message',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'messageType',
      title: 'Message Type',
      type: 'string',
      options: {
        list: [
          { title: 'Title and Rich Text', value: 'Title and Rich Text' },
          { title: 'Simple Text', value: 'Simple Text' },
        ],
      },
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})