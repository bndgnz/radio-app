import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

function AmazonPlaylist(props: any) {
  const id = props.id;

  const PLAYLIST = gql`
    query GetPLaylist($id: String!) {
      amazonPlaylist(id: $id) {
        title
        podcastsCollection {
          items {
            title
            amazonUrl
            description
            podcastImage
            date
            slug
            show {
              title
            }
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
    const listOfItems = data.amazonPlaylist.podcastsCollection.items.map(
      (podcast, idx) => {
        return (
          <div className="row amazon-playlist-row standard-items" key={idx}>
            <div className="col-lg-2 col-xs-12 amazon-podcast-image">
              <a
                href={"../podcast/" + podcast.slug}
                title={"Read more about " + podcast.title}
              >
                <img
                  src={podcast.podcastImage[0].url}
                  alt={podcast.title}
                  className="latest-amazon-podcast-image"
                />
              </a>
            </div>

            <div className="col-lg-7 col-xs-12 amazon-podcast-content">
              <div className=" amazon-podcast-card-title">
                <a
                  href={"../podcast/" + podcast.slug}
                  title={"Read more about " + podcast.title}
                >
                  <strong>{podcast.title}</strong>
                </a>
              </div>

              <div className=" amazon-podcast-card-description-latest-list">
                {podcast.description}
              </div>

              <strong>
                {" "}
                <a href={"podcast/" + podcast.slug}>Read more</a>
              </strong>
            </div>
            <div className="col-lg-3 col-xs-12 ">
              {" "}
              <div className="amazonplaylist-audio">
                <p>
                  {" "}
                  <b>Show:</b>{" "}
                  <a
                    href={"../shows/" + podcast.show.slug}
                    title={"Read more about " + podcast.show.title}
                  >
                    <strong>{podcast.show.title}</strong>
                  </a>{" "}
                </p>
                <audio
                  controls
                  src={podcast.amazonUrl}
                  id={
                    podcast.show.title.replaceAll(" ", "-") + "-" + podcast.slug
                  }
                >
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

    return <div className="featured-podcasts-overflow"> {listOfItems}</div>;
  }

  return (
    <>
      <section className="playlist container page-block amazon-playlist">
        <div className="container">
          <Items />
        </div>
      </section>
    </>
  );
}

export default AmazonPlaylist;
