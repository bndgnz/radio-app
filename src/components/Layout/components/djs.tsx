import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

function Sponsors(props: any) {
  const id = props.id;
  const PLAYLIST = gql`
    query GetDjs($id: String!) {
      staffList(id: $id) {
        title
        staffCollection {
          items {
            title
            photo {
              url
            }
            shortBio
          }
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(PLAYLIST, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
  console.log(data);

  const listOfItems = data.staffList.staffCollection.items.map(
    (dj, idx) => {
      return (
        <div className="col-lg-3   col-xs-12" key={idx}>
          <div className=" sponsor-card ">
            <img src={dj.photo.url} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{dj.title}</h5>

              {dj.shortBio}
            </div>
          </div>
        </div>
      );
    }
  );
  return (
    <section className="about-area ptb-100">
      <div className="container">
        <div className="card-deck  ">{listOfItems}</div>
      </div>
    </section>
  );
}

export default Sponsors;
