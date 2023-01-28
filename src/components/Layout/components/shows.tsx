import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

function Shows(props: any) {
  const id = props.id;
  const SHOWLIST = gql`
    query GetShows($id: String!) {
      showList(id: $id) {
        title
        showsCollection(limit: 10) {
          items {
            sponsor {
              title
            }
            path
            slug
            title
            image {
              url
            }
            introduction
            showUrl
            playlistUrl
            djCollection {
              items {
                title
              }
            }
            timeSlotsCollection(limit: 10) {
              ...times
            }
          }
        }
      }
    }
    
    fragment times on ShowsTimeSlotsCollection {
      items {
        title
      }
    }
  `;

  const { data, loading, error } = useQuery(SHOWLIST, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  console.log(data)

  const listOfItems = data.showList.showsCollection.items.map((show, idx) => {
    return (
      <div
        className="col-lg-3   col-xs-12"
        key={idx}
        id={show.title.replace(/ /g, "-").toLowerCase()}
      >
        <div className=" sponsor-card show-card ">
          <img src={show.image.url} className="card-img-top show-image" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{show.title}</h5>

            {show.introduction}

            <div className="shows-by-dj"> </div>
          </div>
        </div>
      </div>
    );
  });
  return (
    <section className="about-area ptb-100">
      <div className="container">
        <div className="card-deck  ">{listOfItems}</div>
      </div>
    </section>
  );
}

export default Shows;
