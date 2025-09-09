import { defineType, defineField } from 'sanity'

export const amazonPlaylist = defineType({
  name: 'amazonPlaylist',
  title: 'Amazon Playlist',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'showTitle',
      title: 'Show Title',
      type: 'boolean',
    }),
  ],
})

export const searchBox = defineType({
  name: 'searchBox',
  title: 'Search Box',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
    }),
  ],
})

export const htmlBlock = defineType({
  name: 'htmlBlock',
  title: 'HTML Block',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'html',
      title: 'HTML',
      type: 'text',
    }),
  ],
})

export const introductionAndContent = defineType({
  name: 'introductionAndContent',
  title: 'Introduction and Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})

export const filteredAmazonPlaylist = defineType({
  name: 'filteredAmazonPlaylist',
  title: 'Filtered Amazon Playlist',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})

export const playlistGrid = defineType({
  name: 'playlistGrid',
  title: 'Playlist Grid',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})

export const queryStringPlaylist = defineType({
  name: 'queryStringPlaylist',
  title: 'Query String Playlist',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})

export default [
  amazonPlaylist,
  searchBox,
  htmlBlock,
  introductionAndContent,
  filteredAmazonPlaylist,
  playlistGrid,
  queryStringPlaylist,
]