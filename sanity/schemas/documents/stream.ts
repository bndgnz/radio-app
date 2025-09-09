import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'stream',
  title: 'Stream',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'playingNow',
      title: 'Playing Now',
      type: 'string',
    }),
  ],
})