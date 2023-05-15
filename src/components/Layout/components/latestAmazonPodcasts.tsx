import React from "react";
import { useQuery, gql } from "@apollo/client";
import Latestlist from "@/src/components/Layout/components/latestList";


function LatestPodcasts(props: any) {
    const id = props.id;
    const GETCOMPONENT = gql`
    query GetPodcast($id: String!) {
        latestPodcasts(id: $id) {
            title
            showTitle
            numberToShow
            filterByShow {title}
      }
    }
  `;

 const { data, loading, error } = useQuery(GETCOMPONENT, { variables: { id } });
 if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
 
 
  



  return (

<Latestlist filter={data.latestPodcasts.filterByShow.title} limit={data.latestPodcasts.numberToShow} showtitle={data.latestPodcasts.showTitle} title={data.latestPodcasts.title} />
 
 



  );
}

export default LatestPodcasts;