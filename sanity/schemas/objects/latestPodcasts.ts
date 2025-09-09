import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'latestPodcasts',
  title: 'Latest Podcasts',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'filterByShow',
      title: 'Filter by Show',
      type: 'reference',
      to: [{ type: 'shows' }],
    }),
    defineField({
      name: 'numberToShow',
      title: 'Number to Show',
      type: 'number',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showTitle',
      title: 'Show Title',
      type: 'boolean',
      initialValue: true,
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
      name: 'showSorting',
      title: 'Show Sorting',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})