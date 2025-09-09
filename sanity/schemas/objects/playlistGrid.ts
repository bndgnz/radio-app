import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'playlistGrid',
  title: 'Playlist Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'showTitle',
      title: 'Show Title',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'playlistItems',
      title: 'Playlist Items',
      type: 'array',
      of: [{ type: 'playlist' }],
    }),
    defineField({
      name: 'rowHeight',
      title: 'Row Height',
      type: 'number',
    }),
    defineField({
      name: 'columnBootstrapWidth',
      title: 'Column Bootstrap Width',
      type: 'number',
    }),
    defineField({
      name: 'showVisualPlayer',
      title: 'Show Visual Player',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})