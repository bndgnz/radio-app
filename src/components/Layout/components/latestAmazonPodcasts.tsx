import React from "react";
import { useQuery, gql } from "@apollo/client";
import Latestlist from "@/src/components/Layout/components/latestList";

function LatestPodcasts(props: any) {
  const id = props.id;
  const GETCOMPONENT = gql`
    query GetPodcast($id: String!) {
      latestPodcasts(id: $id) {
topStory{
...Video
...Navlink

}




 
        title
        showTitle
        numberToShow
        showFeatured
 
        featuredPodcast {
          title
          description
          slug
          amazonUrl
          podcastImage
          date
          show {
            title
            slug
          }
        }
        filterByShow {
          title
        }
      }
    }
    fragment Navlink on NavigationLink {
      sys{id}
      linkText

    
      
    }
    
     fragment Video on Video {
     sys{id}
      
    }
    
  `;

  const { data, loading, error } = useQuery(GETCOMPONENT, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
  let filter;

  if (data.latestPodcasts.filterByShow != null) {
    filter = data.latestPodcasts.filterByShow.title;
  } else {
    filter = "";
  }

console.log(data)
   
 if (data.latestPodcasts.showFeatured == true && data.latestPodcasts.featuredPodcast!==null ) { 


  return (
    <Latestlist
      filter={filter}
      limit={data.latestPodcasts.numberToShow}
      showtitle={data.latestPodcasts.showTitle}
      title={data.latestPodcasts.title}
      showFeatured={data.latestPodcasts.showFeatured}
      featuredPodcastTitle={data.latestPodcasts.featuredPodcast.title}
      featuredPodcastSlug={data.latestPodcasts.featuredPodcast.slug}
      featuredPodcastUrl={data.latestPodcasts.featuredPodcast.amazonUrl}
      featuredPodcastDate={data.latestPodcasts.featuredPodcast.date}
      featuredPodcastImage={
        data.latestPodcasts.featuredPodcast.podcastImage[0].secure_url
      }
      featuredPodcastShowSlug={data.latestPodcasts.featuredPodcast.show.slug}
      featuredPodcastShowTitle={data.latestPodcasts.featuredPodcast.show.title}
      featuredPodcastDescription={data.latestPodcasts.featuredPodcast.description}
    />
  );
    }
    else {return (
      <Latestlist
        filter={filter}
        limit={data.latestPodcasts.numberToShow}
        showtitle={data.latestPodcasts.showTitle}
        title={data.latestPodcasts.title}
        
      />
    );




    }



}

export default LatestPodcasts;
