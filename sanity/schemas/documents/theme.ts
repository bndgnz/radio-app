import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'theme',
  title: 'Theme',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cloudinaryImage',
      title: 'Background Image',
      type: 'cloudinary.asset',
      description: 'Background image for this theme',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current'
    },
    prepare(selection) {
      const { title, slug } = selection
      return {
        title: title || 'Untitled',
        subtitle: slug ? `/${slug}` : 'No slug'
      }
    }
  }
})