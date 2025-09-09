import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'navigationLink',
  title: 'Navigation Link',
  type: 'document',
  description: 'An internal or external link enabling nested sub menu items',
  fields: [
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'The text to display for this navigation link',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'No Link (Parent Menu)', value: 'none' }
        ]
      },
      initialValue: 'internal'
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [
        { type: 'landingPage' },
        { type: 'shows' },
      ],
      description: 'Select the page this navigation link should point to',
      hidden: ({ parent }) => parent?.linkType !== 'internal'
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Enter the full URL (including https://)',
      hidden: ({ parent }) => parent?.linkType !== 'external'
    }),
    defineField({
      name: 'sublinks',
      title: 'Sublinks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'navigationLink' }] }],
      description: 'Add child menu items that will appear in a dropdown'
    }),
  ],
  preview: {
    select: {
      title: 'linkText',
      linkType: 'linkType',
      internalTitle: 'internalLink.title',
      externalUrl: 'externalUrl',
      hasSublinks: 'sublinks'
    },
    prepare(selection) {
      const { title, linkType, internalTitle, externalUrl, hasSublinks } = selection
      const sublinkCount = hasSublinks?.length || 0
      
      let subtitle = ''
      if (linkType === 'internal' && internalTitle) {
        subtitle = `→ ${internalTitle}`
      } else if (linkType === 'external' && externalUrl) {
        subtitle = `↗ ${externalUrl}`
      } else if (linkType === 'none') {
        subtitle = 'Parent menu item'
      } else {
        subtitle = 'No link configured'
      }
      
      if (sublinkCount > 0) {
        subtitle += ` (${sublinkCount} sublinks)`
      }
      
      return {
        title: title || 'Untitled Link',
        subtitle,
        media: () => sublinkCount > 0 ? '📁' : (linkType === 'external' ? '↗' : '→')
      }
    }
  }
})