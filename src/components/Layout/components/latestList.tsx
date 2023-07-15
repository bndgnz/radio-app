import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import Link from "next/link";

function Message(props: any) {
  const limit = props.limit;
  const showTitle = props.showtitle;
  const title = props.title;
  const show = props.filter;
  const MESSAGE = gql`
    query GetList($limit: Int!) {
      amazonPodcastCollection(limit: $limit, order:date_DESC ) {
        items {
          amazonUrl
          title
          description
          show {
            title
            slug
          }
          podcastImage
          date
          slug
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(MESSAGE, { variables: { limit } });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
  
  function Date(date: any) {
    let year = date.date.substring(0, 4);
    let month = date.date.substring(5, 7);
    let day = date.date.substring(8, 10);
    return (
      <strong>
        <strong>{day + "-" + month + "-" + year}</strong>{" "}
      </strong>
    );
  }
  function Items() {
    const listOfItems = data.amazonPodcastCollection.items.map(
      (podcast, idx) => {
        return (
          <div className="row amazon-playlist-row" key={idx}>
            <div className="col-lg-2 col-xs-12 amazon-podcast-image">
            <a href={"../podcast/" + podcast.slug} title={"Read more about " +podcast.title } ><img src={podcast.podcastImage[0].url} alt={podcast.title} className="latest-amazon-podcast-image" /></a>
           
            </div>

            <div className="col-lg-7 col-xs-12 amazon-podcast-content">
              <div className=" amazon-podcast-card-title">
              <a href={"../podcast/" + podcast.slug} title={"Read more about " +podcast.title } ><strong>{podcast.title}</strong></a> 
          
              </div>

              <div className=" amazon-podcast-card-description-latest-list">
                {podcast.description}
              </div>

              <strong>
                {" "}
                <Link href={"podcast/" + podcast.slug}>Read more</Link>
              </strong>
            </div>
            <div className="col-lg-3 col-xs-12 ">
           
              {" "}
              <div className="amazonplaylist-audio">
           <p> <b>Show:</b>  <a href={"../shows/" + podcast.show.slug} title={"Read more about " +podcast.show.title } ><strong>{podcast.show.title}</strong></a> </p> 
                <audio controls src={podcast.amazonUrl}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
                <Date date={podcast.date} />
               
              </div>{" "}
            </div>
          </div>
        );
      }
    );

  

    return <div> {listOfItems}</div>;
  }
  return (
    <>
      {props.showTitle != true ? (
        <div className="container">
          <div className="layout-title">
            <h3> {title}</h3>
          </div>
          <br />{" "}
        </div>
      ) : null}

      <section className="playlist container page-block amazon-playlist">
        <div className="container">
          <Items />
        </div>
      </section>
    </>
  );
}

export default Message;
