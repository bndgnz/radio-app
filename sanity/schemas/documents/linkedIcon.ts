import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'linkedIcon',
  title: 'Linked Icon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
    }),
    defineField({
      name: 'fontAwesomeClasses',
      title: 'Font Awesome Classes',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
    }),
  ],
})