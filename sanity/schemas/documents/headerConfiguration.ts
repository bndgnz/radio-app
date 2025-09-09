import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'headerConfiguration',
  title: 'Headers',
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
      name: 'link',
      title: 'Logo Link',
      description: 'Select a page to link the logo to',
      type: 'reference',
      to: [
        { type: 'landingPage' },
        { type: 'shows' },
        { type: 'staff' },
        { type: 'sponsor' },
        { type: 'amazonPodcast' }
      ],
    }),
    defineField({
      name: 'frequency',
      title: 'Frequency',
      type: 'string',
      description: 'Radio station frequency (e.g., "88.7 FM")',
    }),
    defineField({
      name: 'teReo',
      title: 'Te Reo',
      type: 'string',
      description: 'Te Reo Māori text for the header',
    }),
  ],
})