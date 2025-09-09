import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'djById',
  title: 'DJ By ID',
  type: 'document',
  description: 'Show DJ from query string',
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
      type: 'text',
    }),
    defineField({
      name: 'djId',
      title: 'DJ ID',
      type: 'string',
      description: 'The ID parameter to look for in the query string',
    }),
    defineField({
      name: 'showAllDjs',
      title: 'Show All DJs',
      type: 'boolean',
      initialValue: false,
      description: 'Show all DJs if no ID is provided in query string',
    }),
  ],
})