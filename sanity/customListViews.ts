import { StructureBuilder } from 'sanity/structure'

export const createAmazonPodcastsView = (S: StructureBuilder) => {
  return S.listItem()
    .title('🎧 Amazon Podcasts (Sorted by Date)')
    .child(
      S.documentList()
        .title('Amazon Podcasts - Newest First')
        .filter('_type == "amazonPodcast" && defined(date)')
        .apiVersion('2024-01-01')
        .defaultOrdering([
          { field: 'date', direction: 'desc' }
        ])
        .menuItems([
          S.orderingMenuItem({
            title: 'Date: Newest First',
            by: [{ field: 'date', direction: 'desc' }]
          }),
          S.orderingMenuItem({
            title: 'Date: Oldest First',
            by: [{ field: 'date', direction: 'asc' }]
          }),
          S.orderingMenuItem({
            title: 'Title: A-Z',
            by: [{ field: 'title', direction: 'asc' }]
          })
        ])
        .child((documentId) =>
          S.document()
            .documentId(documentId)
            .schemaType('amazonPodcast')
        )
    )
}