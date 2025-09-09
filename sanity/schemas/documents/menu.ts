import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  description: 'A collection of Page links or Navigation Links if nesting is required',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'navigationLink' }] }],
    }),
    defineField({
      name: 'featuredButton',
      title: 'Featured Button',
      type: 'reference',
      to: [{ type: 'message' }],
    }),
  ],
})