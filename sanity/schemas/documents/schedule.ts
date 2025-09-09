import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'schedule',
  title: 'Schedule',
  type: 'document',
  description: 'A collection of shows',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showTodayOnly',
      title: 'Show Today Only',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'monday',
      title: 'Monday',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
    defineField({
      name: 'tuesday',
      title: 'Tuesday',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
    defineField({
      name: 'wednesday',
      title: 'Wednesday',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
    defineField({
      name: 'thursday',
      title: 'Thursday',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
    defineField({
      name: 'friday',
      title: 'Friday',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
    defineField({
      name: 'saturday',
      title: 'Saturday',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
    defineField({
      name: 'sunday',
      title: 'Sunday',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shows' }] }],
    }),
  ],
})