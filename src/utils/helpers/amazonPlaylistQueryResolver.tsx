import React from "react";
import { useQuery, gql } from "@apollo/client";


function FilteredAmazonPlaylistResolver (props: any) {
 
 const show =props.data.filteredAmazonPlaylist.show.title;
 const date1 = new Date(props.data.filteredAmazonPlaylist.startTime).getTime()


 const PLAYLISTITEMS = gql`
    query GetFilteredItems($show: String!) {
         amazonPodcastCollection(limit:22, where: {AND: [{AND: [{show: {title_contains: $show}}  ]}]} order:date_ASC ) {
              total
              items {
                title
                date
                show {
                ...showname
              }
              }
            }
          }
          
          
          fragment showname on Shows {  title   }
   
  `;

  const { data, loading, error } = useQuery(PLAYLISTITEMS, {
    variables: { show },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

console.log(data)










return (<>

{date1}


</>)




}
  
    
    export default FilteredAmazonPlaylistResolver;

