import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'list',
  title: 'List',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Staff List', value: 'Staff List' },
          { title: 'Show List', value: 'Show List' },
          { title: 'Sponsor List', value: 'Sponsor List' },
          { title: 'Stream List', value: 'Stream List' },
          { title: 'Banner List', value: 'Banner List' },
        ],
      },
    }),
    defineField({
      name: 'showStatus',
      title: 'Show Status',
      type: 'string',
      options: {
        list: [
          { title: 'Current', value: 'Current' },
          { title: 'Archived', value: 'Archived' },
          { title: 'All', value: 'All' },
          { title: 'Show on Today', value: 'Show on Today' },
        ],
      },
    }),
    defineField({
      name: 'showSchedule',
      title: 'Show Schedule',
      type: 'reference',
      to: [{ type: 'schedule' }],
    }),
    defineField({
      name: 'staffStatus',
      title: 'Staff Status',
      type: 'string',
      options: {
        list: [
          { title: 'Current', value: 'Current' },
          { title: 'Previous', value: 'Previous' },
          { title: 'All', value: 'All' },
        ],
      },
    }),
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'banner' }] }],
    }),
  ],
})