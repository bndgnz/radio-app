import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'introductionAndContent',
  title: 'Introduction and Content',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})