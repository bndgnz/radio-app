import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
    }),
    defineField({
      name: 'watchMessage',
      title: 'Watch Message',
      type: 'string',
    }),
    defineField({
      name: 'youtubeId',
      title: 'Youtube ID',
      type: 'string',
    }),
  ],
})