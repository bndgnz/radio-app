import { StructureBuilder } from 'sanity/structure'
import { AmazonPodcastsSorted } from './components/AmazonPodcastsSorted'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Amazon Podcasts with enhanced sorting and features  
      S.listItem()
        .title('Amazon Podcasts')
        .id('amazonPodcasts')
        .child(
          S.component(AmazonPodcastsSorted)
            .title('Amazon Podcasts')
        ),
      
      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem: any) => !['amazonPodcast'].includes(listItem.getId())
      ),
    ])