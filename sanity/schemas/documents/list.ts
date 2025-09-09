import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'list',
  title: 'List',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Banner List', value: 'Banner List' },
          { title: 'Show List', value: 'Show List' },
          { title: 'Staff List', value: 'Staff List' },
        ],
      },
    }),
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'banner' }] }],
      hidden: ({ parent }) => parent?.type !== 'Banner List',
    }),
    defineField({
      name: 'shows',
      title: 'Shows',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
      hidden: ({ parent }) => parent?.type !== 'Show List',
    }),
    defineField({
      name: 'staff',
      title: 'Staff',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'staff' }] }],
      hidden: ({ parent }) => parent?.type !== 'Staff List',
    }),
    defineField({
      name: 'showSchedule',
      title: 'Show Schedule',
      type: 'reference',
      to: [{ type: 'schedule' }],
      description: 'Schedule reference for shows on today',
    }),
    defineField({
      name: 'showStatus',
      title: 'Show Status',
      type: 'string',
      description: 'Status of shows (e.g., Show on Today)',
    }),
  ],
})