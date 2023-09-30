import React from "react";
import { useQuery, gql } from "@apollo/client";    
       
export async function getPodcasts() {
     
    const PODCASTS = gql`
       query GetList {
         amazonPodcastCollection(order: date_DESC) {
           items {
             amazonUrl
             title
             description
             show {
               title
               slug
             }
             podcastImage
             date
             slug
           }
         }
       }
     `;
   
     const { data, loading, error } = useQuery(PODCASTS);
     if (loading) {
       return <div></div>;
     }
     if (error) {
       return <div></div>;
     }

     console.log(data)
 
return data;

  }

 

