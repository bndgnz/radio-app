import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

function Staff(props: any) {
  const items = props.dj;

  function Dj(props) {
    const listOfItems = items.map((staff, idx) => {
      return (
        <div className="row" key={idx}>
          <div className="col-lg-3 col-sm-12">
            <img
              className="img-fluid"
              src={staff.fields.photo.fields.file.url}
              alt={staff.fields.title}
            />
          </div>
          <div className="col-lg-9 col-sm-12">
            <h6>Presented by:</h6>
            <h3>{staff.fields.title}</h3>
            {staff.fields.shortBio}
          </div>
        </div>
      );
    });
    return (
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="show-dj">{listOfItems}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="about-area ptb-100">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12  ">
            <Dj />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Staff;
