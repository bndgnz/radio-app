import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'playlist',
  title: 'Playlist',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'showTitle',
      title: 'Show Title',
      type: 'boolean',
    }),
  ],
})