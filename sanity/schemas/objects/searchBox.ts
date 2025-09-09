import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'searchBox',
  title: 'Search Box',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})