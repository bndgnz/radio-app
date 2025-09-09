import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'showSlot',
  title: 'Show Slot',
  type: 'document',
  description: 'A day / time range object for show scheduling',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      options: {
        list: [
          { title: 'Monday', value: 'Monday' },
          { title: 'Tuesday', value: 'Tuesday' },
          { title: 'Wednesday', value: 'Wednesday' },
          { title: 'Thursday', value: 'Thursday' },
          { title: 'Friday', value: 'Friday' },
          { title: 'Saturday', value: 'Saturday' },
          { title: 'Sunday', value: 'Sunday' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endTime',
      title: 'End Time',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'amPm',
      title: 'AM PM',
      type: 'string',
      options: {
        list: [
          { title: 'AM', value: 'AM' },
          { title: 'PM', value: 'PM' },
        ],
      },
    }),
  ],
})