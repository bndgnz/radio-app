import React from "react";
import { useQuery, gql } from "@apollo/client";

function StaffListBuilder(props: any) {
let currentDj;
if (props.status==="Current") {currentDj=true} else {currentDj=false}
 

  const STREAMS = gql`
    query GetDj($currentDj: Boolean!) {
      staffCollection(order: title_ASC, where: { currentDj: $currentDj }) {
        items {
          title
          headshot
          shortBio
          slug
          currentDj
          content {
            json
          }
          title
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(STREAMS, {
    variables: { currentDj },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  console.log(data)

  function LinkedShows(props: any) {
    const title = props.dj;

    const MESSAGE = gql`
      query GetShows($title: String!) {
        showsCollection(order: title_ASC, where: { dj: { title: $title } }) {
          items {
            title
            slug
          }
        }
      }
    `;

    const { data, loading, error } = useQuery(MESSAGE, {
      variables: { title },
    });
    if (loading) {
      return <div></div>;
    }
    if (error) {
      return <div></div>;
    }
    const listOfItems = data.showsCollection.items.map((show, idx) => {
      return (
        <div key={idx}>
          {" "}
          <a href={"./shows/" + show.slug} title={show.title}>
            {show.title}
          </a>{" "}
        </div>
      );
    });

    return <div> {listOfItems}</div>;
  }

  function Items() {
    const listOfItems = data.staffCollection.items.map((dj, idx) => {
      return (
        <div className="row amazon-playlist-row" key={idx}>
          <div className="col-lg-2 col-xs-12 amazon-podcast-image">
            <img src={dj.headshot[0].secure_url} alt="..." />

            <div className="amazon-podcast-date"></div>
          </div>

          <div className="col-lg-2 col-xs-12 ">
            <div className=" ">
              <strong>{dj.title}</strong>
            </div>
          </div>
          <div className="col-lg-5 col-xs-12">
            <p> {dj.shortBio}</p>
          </div>

          <div className="col-lg-3 col-xs-12">
            <LinkedShows dj={dj.title} />
          </div>
        </div>
      );
    });

    return <div> {listOfItems}</div>;
  }

  return (
    <>
      <section className="playlist container page-block amazon-playlist">
        <div className="container">
          <h1>{props.title} </h1>
          <hr />

          <Items />
        </div>
      </section>
    </>
  );
}

export default StaffListBuilder;
