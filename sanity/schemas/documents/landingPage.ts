import { defineType, defineField } from 'sanity'
import BootstrapLayoutEditor from '../../components/BootstrapLayoutEditor'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `/${subtitle}` : 'No slug'
      }
    }
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'pageDesign',
      title: 'Page Design',
      type: 'reference',
      to: [{ type: 'pageDesign' }],
      description: 'Select a Page Design template for this page',
      validation: (Rule) => Rule.required().error('You must select a Page Design'),
      initialValue: {
        _type: 'reference',
        _ref: 'd911cdd6-4ca9-4612-a926-b335bf0d9b6d'
      },
      options: {
        disableNew: true
      }
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'reference',
      to: [{ type: 'theme' }],
      description: 'Select a theme for this page',
      options: {
        disableNew: true
      }
    }),
    defineField({
      name: 'pageLayout',
      title: 'Page Layout',
      type: 'object',
      fields: [
        {
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'id', type: 'string' },
                {
                  name: 'columns',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        { name: 'id', type: 'string' },
                        { name: 'size', type: 'number' },
                        { name: 'componentPlaceholder', type: 'string' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      components: {
        input: BootstrapLayoutEditor
      },
      initialValue: {
        rows: []
      }
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'path',
      title: 'Path',
      type: 'string',
    }),
    defineField({
      name: 'cloudinaryImage',
      title: 'Cloudinary Image',
      type: 'cloudinary.asset',
      description: 'Interactive Cloudinary image selector with preview',
    }),
    defineField({
      name: 'teReoTitle',
      title: 'Te Reo Title',
      type: 'string',
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
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
            ],
          },
        },
        // Support for embedded Cloudinary images
        {
          type: 'cloudinary.asset',
          title: 'Embedded Image',
        },
        // Support for legacy Sanity images (for migration compatibility)
        {
          type: 'image',
          title: 'Embedded Image (Legacy)',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
  ],
})