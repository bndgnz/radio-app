import React from "react";
import { useQuery, gql } from "@apollo/client";

function Sponsors(props: any) {
  const id = props.id;
  const SPONSORS = gql`
    query GetSponsors {
      sponsorCollection {
        items {
          title
          image {
            url
          }
          introduction
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(SPONSORS, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  const listOfItems = data.sponsorCollection.items.map((sponsor, idx) => {
    return (
      <div
        className="col-lg-3   col-xs-12"
        key={idx}
        id={sponsor.title.replace(/ /g, "-").toLowerCase()}
      >
        <div className=" sponsor-card ">
          <img src={sponsor.image.url} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{sponsor.title}</h5>

            {sponsor.introduction}
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

export default Sponsors;
