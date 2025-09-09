import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'showsOnToday',
  title: 'Shows On Today',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'reference',
      to: [{ type: 'schedule' }],
    }),
  ],
})