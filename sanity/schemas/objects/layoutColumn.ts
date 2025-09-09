import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'layoutColumn',
  title: 'Layout Column',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'layoutComponent',
      title: 'Layout Component',
      type: 'array',
      of: [
        { type: 'accordion' },
        { type: 'message' },
        { type: 'playlist' },
        { type: 'playlistGrid' },
        { 
          type: 'reference', 
          to: [{ type: 'schedule' }], 
          title: 'Schedule Reference',
          name: 'scheduleReference'
        },
        { type: 'searchBox' },
        { 
          type: 'reference', 
          to: [{ type: 'shows' }], 
          title: 'Shows Reference',
          name: 'showsReference'
        },
        { type: 'showsOnToday' },
        { type: 'sponsorsList' },
        { 
          type: 'reference', 
          to: [{ type: 'staff' }], 
          title: 'Staff Reference',
          name: 'staffReference'
        },
        { 
          type: 'reference', 
          to: [{ type: 'stream' }], 
          title: 'Stream Reference',
          name: 'streamReference'
        },
        { type: 'showList' },
        { type: 'amazonPlaylist' },
        { 
          type: 'reference', 
          to: [{ type: 'amazonPodcast' }], 
          title: 'Amazon Podcast Reference',
          name: 'amazonPodcastReference'
        },
        { type: 'latestPodcasts' },
        { type: 'list' },
      ],
    }),
    defineField({
      name: 'bootstrapWidth',
      title: 'Bootstrap Width',
      type: 'string',
      options: {
        list: [
          { title: '1', value: '1' },
          { title: '2', value: '2' },
          { title: '3', value: '3' },
          { title: '4', value: '4' },
          { title: '5', value: '5' },
          { title: '6', value: '6' },
          { title: '7', value: '7' },
          { title: '8', value: '8' },
          { title: '9', value: '9' },
          { title: '10', value: '10' },
          { title: '11', value: '11' },
          { title: '12', value: '12' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'offset',
      title: 'Offset',
      type: 'number',
    }),
  ],
})