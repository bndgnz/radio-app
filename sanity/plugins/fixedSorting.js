// Sanity Studio Sorting Fix Plugin
// This plugin attempts to fix the fundamental sorting bug in Sanity Studio

import { definePlugin } from 'sanity'

export const fixedSortingPlugin = definePlugin({
  name: 'fixed-sorting',
  document: {
    // Override the default list behavior
    unstable_augmentList: {
      amazonPodcast: (list) => {
        // Force the query to sort before slicing
        return list.filter('_type == "amazonPodcast" && defined(date)')
          .order('date desc')
          .menuItems([
            {
              title: 'Date (Newest First)',
              params: { order: 'date desc' }
            },
            {
              title: 'Date (Oldest First)', 
              params: { order: 'date asc' }
            }
          ])
      }
    }
  }
})