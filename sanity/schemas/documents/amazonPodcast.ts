import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'amazonPodcast',
  title: 'Amazon Podcast',
  type: 'document',
  initialValue: () => ({
    date: new Date().toISOString()
  }),
  orderings: [
    {
      title: 'Date (Newest First)',
      name: 'dateDesc',
      by: [
        { field: 'date', direction: 'desc' },
        { field: '_id', direction: 'desc' }
      ]
    },
    {
      title: 'Date (Oldest First)',
      name: 'dateAsc',
      by: [
        { field: 'date', direction: 'asc' },
        { field: '_id', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      date: 'date',
      media: 'podcastImage',
      createdAt: '_createdAt',
      updatedAt: '_updatedAt'
    },
    prepare(selection) {
      const { title, subtitle, date, media, createdAt, updatedAt } = selection
      const dateStr = date ? new Date(date).toLocaleDateString() : 'No date'
      const createdStr = createdAt ? new Date(createdAt).toLocaleDateString() : ''
      
      // Handle subtitle whether it's a string, array, or undefined
      let description = 'No description'
      if (subtitle) {
        if (typeof subtitle === 'string') {
          description = subtitle.substring(0, 80)
        } else if (Array.isArray(subtitle) && subtitle.length > 0) {
          // Handle rich text array - extract text from first block
          const firstBlock = subtitle[0]
          if (firstBlock && firstBlock.children && firstBlock.children[0] && firstBlock.children[0].text) {
            description = firstBlock.children[0].text.substring(0, 80)
          }
        }
      }
      
      return {
        title: title || 'Untitled',
        subtitle: `${dateStr} | Created: ${createdStr} | ${description}${description !== 'No description' ? '...' : ''}`,
        media
      }
    }
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
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
      name: 'podcastImage',
      title: 'Podcast Image',
      type: 'cloudinary.asset',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
      hidden: false,
      description: 'When this podcast was created in the system',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime', 
      readOnly: true,
      hidden: false,
      description: 'When this podcast was last updated',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'amazonUrl',
      title: 'Amazon URL',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'show',
      title: 'Show',
      type: 'reference',
      to: [{ type: 'shows' }],
      validation: Rule => Rule.required(),
    }),
  ],
})