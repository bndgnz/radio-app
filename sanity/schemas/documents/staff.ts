import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'staff',
  title: 'Staff',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'path',
      title: 'Path',
      type: 'string',
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot',
      type: 'cloudinary.asset',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'currentDj',
      title: 'Current DJ',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
      ],
    }),
  ],
})