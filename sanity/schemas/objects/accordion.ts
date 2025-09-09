import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  description: 'General purpose accordion',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'accordionItems',
      title: 'Accordion Items',
      type: 'array',
      of: [
        { type: 'carousel' },
        { type: 'layout' },
        { type: 'message' },
        { type: 'playlist' },
        { 
          type: 'reference', 
          to: [{ type: 'schedule' }], 
          title: 'Schedule Reference',
          name: 'scheduleReference'
        },
        { 
          type: 'reference', 
          to: [{ type: 'amazonPodcast' }], 
          title: 'Amazon Podcast Reference',
          name: 'amazonPodcastReference'
        },
        { type: 'amazonPlaylist' },
        { type: 'filteredAmazonPlaylist' },
      ],
    }),
  ],
})