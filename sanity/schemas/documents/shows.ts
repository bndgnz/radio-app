import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'shows',
  title: 'Shows',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'cimage',
      title: 'Cloudinary Image',
      type: 'cloudinary.asset',
      description: 'Interactive Cloudinary image selector with preview',
    }),
    defineField({
      name: 'showBanner',
      title: 'Show Banner',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'archived',
      title: 'Archived',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
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
    defineField({
      name: 'timeSlots',
      title: 'Time Slots',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'showSlot' }] }],
    }),
    defineField({
      name: 'showUrl',
      title: 'Show URL',
      type: 'url',
    }),
    defineField({
      name: 'playlistUrl',
      title: 'Playlist URL',
      type: 'url',
    }),
    defineField({
      name: 'dj',
      title: 'DJ',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'staff' }],
        weak: true 
      }],
    }),
    defineField({
      name: 'rss',
      title: 'RSS',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'chat',
      title: 'Chat',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter',
      type: 'url',
    }),
    defineField({
      name: 'tikTok',
      title: 'TikTok',
      type: 'url',
    }),
    defineField({
      name: 'linkedIn',
      title: 'LinkedIn',
      type: 'url',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'applePodcasts',
      title: 'Apple Podcasts',
      type: 'url',
    }),
    defineField({
      name: 'spotify',
      title: 'Spotify',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
    }),
    defineField({
      name: 'discord',
      title: 'Discord',
      type: 'url',
    }),
    defineField({
      name: 'components',
      title: 'Components',
      type: 'array',
      of: [
        { type: 'accordion' },
        { type: 'introductionAndContent' },
        { type: 'playlist' },
        { 
          type: 'reference', 
          to: [{ type: 'schedule' }], 
          title: 'Schedule Reference',
          name: 'scheduleReference'
        },
        { type: 'stream' },
        { 
          type: 'reference', 
          to: [{ type: 'video' }], 
          title: 'Video Reference',
          name: 'videoReference'
        },
        { type: 'amazonPlaylist' },
        { 
          type: 'reference', 
          to: [{ type: 'amazonPodcast' }], 
          title: 'Amazon Podcast Reference',
          name: 'amazonPodcastReference'
        },
        { type: 'latestPodcasts' },
        { type: 'filteredAmazonPlaylist' },
      ],
    }),
    defineField({
      name: 'sponsor',
      title: 'Sponsor',
      type: 'reference',
      to: [{ type: 'sponsor' }],
    }),
  ],
})