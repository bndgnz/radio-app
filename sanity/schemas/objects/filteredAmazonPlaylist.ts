import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'filteredAmazonPlaylist',
  title: 'Filtered Amazon Playlist',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showName',
      title: 'Show Name',
      type: 'string',
    }),
    defineField({
      name: 'titleContains',
      title: 'Title Contains',
      type: 'string',
    }),
    defineField({
      name: 'descriptionContains',
      title: 'Description Contains',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'show',
      title: 'Show',
      type: 'reference',
      to: [{ type: 'shows' }],
    }),
    defineField({
      name: 'pagination',
      title: 'Pagination',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'countPerPage',
      title: 'Count per Page',
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