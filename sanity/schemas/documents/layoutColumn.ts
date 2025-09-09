import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'layoutColumn',
  title: 'Layout Column',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
    }),
    defineField({
      name: 'bootstrapWidth',
      title: 'Bootstrap Width',
      type: 'string',
      description: 'Bootstrap column width (migrated from Contentful)',
    }),
    defineField({
      name: 'offset',
      title: 'Offset',
      type: 'number',
      description: 'Bootstrap column offset (migrated from Contentful)',
    }),
    defineField({
      name: 'layoutComponents',
      title: 'Layout Components',
      type: 'array',
      of: [
        { type: 'showList' },
        { type: 'showsOnToday' },
        { 
          type: 'reference',
          title: 'Component Reference',
          to: [
            { type: 'video' },
            { type: 'stream' },
            { type: 'amazonPodcast' },
            { type: 'list' },
            { type: 'playlist' },
            { type: 'accordion' },
            { type: 'message' },
            { type: 'carousel' },
            { type: 'layout' },
            { type: 'latestPodcasts' },
            { type: 'amazonPlaylist' },
            { type: 'searchBox' },
            { type: 'htmlBlock' },
            { type: 'introductionAndContent' },
            { type: 'filteredAmazonPlaylist' },
            { type: 'playlistGrid' },
            { type: 'queryStringPlaylist' }
          ]
        },
      ],
    }),
  ],
})