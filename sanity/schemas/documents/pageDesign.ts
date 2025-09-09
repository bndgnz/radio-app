import { defineType, defineField } from 'sanity'
import BootstrapLayoutEditor from '../../components/BootstrapLayoutEditor'

export default defineType({
  name: 'pageDesign',
  title: 'Page Design',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'header',
      title: 'Header Layout',
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
      name: 'footer',
      title: 'Footer Layout',
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
      name: 'containerType',
      title: 'Container Type',
      type: 'string',
      options: {
        list: [
          { title: 'Container', value: 'container' },
          { title: 'Container Fluid', value: 'container-fluid' },
          { title: 'No Container', value: 'none' }
        ]
      },
      initialValue: 'container'
    }),
    defineField({
      name: 'cssClasses',
      title: 'Additional CSS Classes',
      type: 'string',
      description: 'Add custom CSS classes for styling'
    })
  ],
  preview: {
    select: {
      title: 'title',
      header: 'header',
      footer: 'footer'
    },
    prepare(selection) {
      const { title, header, footer } = selection
      const headerRows = header?.rows?.length || 0
      const footerRows = footer?.rows?.length || 0
      
      return {
        title: title,
        subtitle: `Header: ${headerRows} rows, Footer: ${footerRows} rows`,
        media: () => '🏗️'
      }
    }
  }
})