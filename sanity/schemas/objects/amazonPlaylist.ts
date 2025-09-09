import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'amazonPlaylist',
  title: 'Amazon Playlist',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'podcasts',
      title: 'Podcasts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'amazonPodcast' }] }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'pagination',
      title: 'Pagination',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'countPerPage',
      title: 'Count Per Page',
      type: 'number',
    }),
    defineField({
      name: 'sorting',
      title: 'Sorting',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})