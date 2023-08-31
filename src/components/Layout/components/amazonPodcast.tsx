import React from "react";
import { useQuery, gql } from "@apollo/client";
import Resolver from "@/src/utils/helpers/amazonPlaylistQueryResolver";



function amazonPlaylist(props: any) {

    console.log(props.props)


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
console.log(props)

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
    <>  <section className="playlist container page-block amazon-playlist">
    <div className="container">
     <div className="row amazon-playlist-row" >
            <div className="col-lg-2 col-xs-12 amazon-podcast-image">
              <a href={"../podcast/" + data.amazonPodcast.slug}>
                {" "}
                <img src={data.amazonPodcast.podcastImage[0].url} alt="..." />
              </a>
              <div className="amazon-podcast-date"></div>
            </div>

            <div className="col-lg-6 col-xs-12 amazon-podcast-content">
              <div className=" amazon-podcast-card-title">
                <strong>
                  <a
                    href={"../podcast/" + data.amazonPodcast.slug}
                    title={"Read more about " + data.amazonPodcast.title}
                  >
                    {data.amazonPodcast.title}
                  </a>
                </strong>
              </div>
              <div className=" amazon-podcast-card-description">
                {data.amazonPodcast.description}
              </div>

              <div className="read-more">
                {" "}
                <a
                  href={"../podcast/" + data.amazonPodcast.slug}
                  title={"Read more about " + data.amazonPodcast.title}
                >
                  Read more
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-xs-12">
              {" "}
              <div className="amazonplaylist-audio">
                {" "}
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

export default amazonPlaylist;
