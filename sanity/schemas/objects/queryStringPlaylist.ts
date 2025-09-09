import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'queryStringPlaylist',
  title: 'Query String Playlist',
  type: 'object',
  description: 'A playlist renderer that gets the playlist id from the querystring',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number',
    }),
  ],
})