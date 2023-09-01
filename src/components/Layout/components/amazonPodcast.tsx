import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

function AmazonPlaylist(props: any) {
 

  const id = props.props;
  const QUERY = gql`
    query GetPodcast($id: String!) {
      amazonPodcast(id: $id) {
        title
        podcastImage
        description
        show {
          title
        }
        amazonUrl
        slug
        date
      }
    }
  `;
  const { data, loading, error } = useQuery(QUERY, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  function Date(props: any) {
 

    let year = props.date.substring(0, 4);
    let month = props.date.substring(5, 7);
    let day = props.date.substring(8, 10);
    return (
      <strong>
        <strong>{day + "-" + month + "-" + year}</strong>{" "}
      </strong>
    );
  }

  return (
    <>
      {" "}
      <section className="playlist container page-block amazon-playlist">
        <div className="container">
          <div className="row amazon-playlist-row">
            <div className="col-lg-2 col-xs-12 amazon-podcast-image">
              <a
                href={"../podcast/" + data.amazonPodcast.slug}
                title={"Read more about " + data.amazonPodcast.title}
              >
                <img
                  src={data.amazonPodcast.podcastImage[0].url}
                  alt={data.amazonPodcast.title}
                  className="latest-amazon-podcast-image"
                />
              </a>
            </div>

            <div className="col-lg-7 col-xs-12 amazon-podcast-content">
              <div className=" amazon-podcast-card-title">
                <a
                  href={"../podcast/" + data.amazonPodcast.slug}
                  title={"Read more about " + data.amazonPodcast.title}
                >
                  <strong>{data.amazonPodcast.title}</strong>
                </a>
              </div>

              <div className=" amazon-podcast-card-description-latest-list">
                {data.amazonPodcast.description}
              </div>

              <strong>
                {" "}
                <Link href={"podcast/" + data.amazonPodcast.slug}>
                  Read more
                </Link>
              </strong>
            </div>
            <div className="col-lg-3 col-xs-12 ">
              {" "}
              <div className="amazonplaylist-audio">
                <p>
                  {" "}
                  <b>Show:</b>{" "}
                  <a
                    href={"../shows/" + data.amazonPodcast.show.slug}
                    title={"Read more about " + data.amazonPodcast.title}
                  >
                    <strong>{data.amazonPodcast.show.title}</strong>
                  </a>{" "}
                </p>
                <audio controls src={data.amazonPodcast.amazonUrl}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
                <Date date={data.amazonPodcast.date} />
              </div>{" "}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AmazonPlaylist;
