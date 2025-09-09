import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'carousel',
  title: 'Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'banner' }] }],
    }),
  ],
})