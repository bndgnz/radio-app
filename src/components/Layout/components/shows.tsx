import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Link from "next/link";

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

  function Dates(props) {
    const listOfItems = props.slotCollection.items.map((time, idx) => {
      var first3;

      return (
        <time key={idx}>
          {first3} {time.title}
        </time>
      );
    });

    return <div className="time-slots"> {listOfItems} </div>;
  }

  const listOfItems = data.showList.showsCollection.items.map((show, idx) => {
    console.log(show.timeSlotsCollection.items);

    return (
      <div
        className="col-lg-3   col-xs-12"
        key={idx}
        id={show.title.replace(/ /g, "-").toLowerCase()}
      >
        <div className=" sponsor-card show-card ">
          <img
            src={show.image.url}
            className="card-img-top show-image"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">
              <Link href={"/shows/" + show.slug}>{show.title}</Link>
            </h5>

            {show.introduction}

            <Dates slotCollection={show.timeSlotsCollection} />
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
