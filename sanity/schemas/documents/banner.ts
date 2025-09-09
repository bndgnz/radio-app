import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subTitle',
      title: 'Sub Title',
      type: 'string',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image', 
      type: 'cloudinary.asset',
      description: 'Interactive Cloudinary image selector with preview',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'reference',
      to: [{ type: 'video' }],
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'reference',
      to: [{ type: 'navigationLink' }],
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'bannerLink',
      title: 'Banner Link',
      type: 'url',
    }),
    defineField({
      name: 'ctaLayout',
      title: 'CTA Layout',
      type: 'reference',
      to: [{ type: 'layout' }],
    }),
  ],
})