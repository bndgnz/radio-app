import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'playlist',
  title: 'Playlist',
  type: 'object',
  description: 'An embedded playlist',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showTitle',
      title: 'Show Title',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'hideVisualPlayer',
      title: 'Hide Visual Player',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'archivedShow',
      title: 'Archived Show',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})