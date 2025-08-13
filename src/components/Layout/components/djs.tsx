import React from "react";
import { useQuery, gql } from "@apollo/client";
import Stafflist from "@/src/utils/helpers/staffListBuilder";

function Djs(props: any) {
  const id = props.id;

  const DJLIST = gql`
    query GetDjs($id: String!) {
      staffList(id: $id) {
        title
        currentDJs
        introduction
      }
    }
  `;

  const { data, loading, error } = useQuery(DJLIST, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  return <> <Stafflist type={data} /></>;
}

export default Djs;
