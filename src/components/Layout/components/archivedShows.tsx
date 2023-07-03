import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";

function Archived(props: any) {
  const id = props.id;
  const SHOWS = gql`
    query GetShows {
      showsCollection(order: title_ASC, where: { archived: true }) {
        items {
          title
          introduction
          slug
          cimage

          djCollection {
            items {
              title
              headshot
            }
          }
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(SHOWS);
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  function Djs(props: any) {
    const listOfDjs = props.data.items.map((dj, idx) => {
      return <p key={idx}>{dj.title}</p>;
    });

    return <p>{listOfDjs}</p>;
  }

  const listOfItems = data.showsCollection.items.map((show, idx) => {
    return (
      <div className="archived-card row col-12" key={idx}>
        <div className="col-sm-12 col-lg-2">
          <img src={show.cimage[0].url} className="archived-show-image" />
        </div>

        <div className="col-sm-12 col-lg-3 archived-show-title">
          <h5>
            <a
              href={"../shows/" + show.slug}
              title={"Find out more about " + show.title}
            >
              {show.title}
            </a>
          </h5>
        </div>

        <div className="col-sm-12 col-lg-4  archived-show-introduction">
          {" "}
          <p>{show.introduction}</p>
        </div>

        <div className="col-sm-12 col-lg-3  archived-show-introduction">
          <p>
            <strong>Presented by:</strong>
          </p>{" "}
          <p>
            <Djs data={show.djCollection} />{" "}
          </p>
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

export default Archived;
