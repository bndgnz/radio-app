import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
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
      name: 'social_links',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'linkedIcon' }] }],
    }),
    defineField({
      name: 'quickLInks',
      title: 'Quick Links',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'navigationLink' }] }],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
    }),
    defineField({
      name: 'rightColumn',
      title: 'Right Column',
      type: 'reference',
      to: [{ type: 'message' }],
    }),
  ],
})