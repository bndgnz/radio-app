import { defineType, defineField } from 'sanity'
import ResponsiveGridInput from '../../components/ResponsiveGridInput'

export default defineType({
  name: 'component',
  title: 'Component',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Header', value: 'header' },
          { title: 'Banner', value: 'banner' },
          { title: 'Content Block', value: 'content-block' },
          { title: 'Sidebar', value: 'sidebar' },
          { title: 'Footer', value: 'footer' },
          { title: 'Navigation', value: 'navigation' },
          { title: 'Card', value: 'card' },
          { title: 'List', value: 'list' },
          { title: 'Grid', value: 'grid' },
          { title: 'Form', value: 'form' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gridSettings',
      title: 'Grid Settings',
      type: 'object',
      fields: [
        { name: 'mobile', type: 'number', initialValue: 12 },
        { name: 'tablet', type: 'number', initialValue: 6 },
        { name: 'desktop', type: 'number', initialValue: 4 }
      ],
      components: {
        input: ResponsiveGridInput
      },
      initialValue: {
        mobile: 12,
        tablet: 6,
        desktop: 4
      }
    }),
    // Legacy fields for backward compatibility (hidden from UI)
    defineField({
      name: 'mobile',
      type: 'number',
      hidden: true
    }),
    defineField({
      name: 'tablet',
      type: 'number',
      hidden: true
    }),
    defineField({
      name: 'desktop',
      type: 'number',
      hidden: true
    }),
    defineField({
      name: 'responsiveSettings',
      type: 'object',
      hidden: true,
      fields: [
        { name: 'mobile', type: 'number' },
        { name: 'tablet', type: 'number' },
        { name: 'desktop', type: 'number' }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      gridSettings: 'gridSettings',
    },
    prepare(selection) {
      const { title, subtitle, gridSettings } = selection
      const mobile = gridSettings?.mobile || 12
      const tablet = gridSettings?.tablet || 6
      const desktop = gridSettings?.desktop || 4
      return {
        title: title,
        subtitle: `${subtitle} • M:${mobile} T:${tablet} D:${desktop}`,
      }
    },
  },
})