import React from "react";
import { useQuery, gql } from "@apollo/client";
import Resolver from "@/src/utils/helpers/amazonPlaylistQueryResolver";

function FilteredAmazonPlaylist(props: any) {
  const id = props.id;


  const QUERY = gql`
    query GetPlaylist($id: String!) {
      filteredAmazonPlaylist(id: $id) {
        title
        showName
        show {
          title
        }
        titleContains
        descriptionContains
        startDate
        endDate
        sort
        displayTitle
      }
    }
  `;
  const { data, loading, error } = useQuery(QUERY, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }




  return (
    <>
      <Resolver data={data} />
    </>
  );
}

export default FilteredAmazonPlaylist;
