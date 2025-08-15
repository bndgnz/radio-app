import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

function DjById(props: any) {
  const router = useRouter();
  const id = props.djId || (router.query.dj as string);

  const DJBYID = gql`
    query GetDjById($id: String!) {
      staff(id: $id) {
        title
        headshot
        shortBio
        slug
        currentDj
        content {
          json
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(DJBYID, {
    variables: { id },
    skip: !id,
  });
  
  if (!id) {
    return <div>No DJ ID provided</div>;
  }
  
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  const staff = data?.staff;
  if (!staff) {
    return <div>DJ not found</div>;
  }

  return (
    <section className="playlist container page-block amazon-playlist">
      <div className="container">
        <div className="row amazon-playlist-row">
          <div className="col-lg-2 col-xs-12 amazon-podcast-image">
            {staff.headshot && staff.headshot[0] && (
              <img src={staff.headshot[0].secure_url} alt={staff.title} />
            )}
          </div>
          <div className="col-lg-2 col-xs-12">
            <div>
              <strong>{staff.title}</strong>
            </div>
          </div>
          <div className="col-lg-8 col-xs-12">
            <p>{staff.shortBio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DjById;