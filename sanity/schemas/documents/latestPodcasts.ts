import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'latestPodcasts',
  title: 'Latest Podcasts',
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
    defineField({
      name: 'showFeatured',
      title: 'Show Featured',
      type: 'boolean',
    }),
    defineField({
      name: 'featuredPodcast',
      title: 'Featured Podcast',
      type: 'reference',
      to: [{ type: 'amazonPodcast' }],
    }),
    defineField({
      name: 'numberToShow',
      title: 'Number to Show',
      type: 'number',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'reference',
      to: [{ type: 'landingPage' }],
      description: 'Select a landing page to link to from the component title',
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'Text to display for the link (e.g., "See All", "More Podcasts")',
    }),
  ],
})