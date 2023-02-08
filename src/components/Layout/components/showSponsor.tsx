import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

function ShowSponsor(props: any) {
  const id = props.id;
 

 

  const SPONSORLIST = gql`
    query GetSponsors($id: String!) {
      sponsor(id: "$id") {
        title
        image {url}
              
            }
    }
  `;

  const { data, loading, error } = useQuery(SPONSORLIST, {
    variables: { id},
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  } 

 

  const listOfItems = data.items.map((sponsor, idx) => {
    return (
      <div className="col-lg-3   col-xs-12" key={idx}>
        <div className=" sponsor-card ">
          <img src={sponsor.iamge.url} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{sponsor.title}</h5>

       

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

export default ShowSponsor;
