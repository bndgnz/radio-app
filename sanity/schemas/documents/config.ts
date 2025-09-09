import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'config',
  title: 'Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'path_prefix',
      title: 'Base URL',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'siteProductionUrl',
      title: 'Site Production Url',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
      name: 'header',
      title: 'Header Configuration',
      type: 'reference',
      to: [{ type: 'headerConfiguration' }],
    }),
    defineField({
      name: 'footer',
      title: 'Footer Configuration',
      type: 'reference',
      to: [{ type: 'footer' }],
    }),
  ],
})