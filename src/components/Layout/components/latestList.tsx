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
      amazonPodcastCollection(limit: $limit, order: date_DESC) {
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

  let arr = [...data.amazonPodcastCollection.items];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].slug === props.featuredPodcastSlug) {
      delete arr[i];
    }
  }

  var filteredPodcastList = arr.filter(function (el) {
    return el != null;
  });

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

  function FeaturedPodcast() {
    if (props.showFeatured) {
      return (
        <div
          className="featured-podcast"
          style={{
            backgroundImage: `url(${props.featuredPodcastImage})`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="show-name">
            {" "}
            <a
              href={"/shows/" + props.featuredPodcastShowSlug}
              title={
                "Find out more about the " +
                props.featuredPodcastShowTitle +
                " show"
              }
            >
              {props.featuredPodcastShowTitle}
            </a>{" "}
          </div>

          <br />

          <div className="featured-podcast-title">
            {" "}
            <a
              href={"../podcast/" + props.featuredPodcastSlug}
              title={"FInd out more about " + props.featuredPodcastTitle}
              className="featured-podcast-title"
            >
              {" "}
              {props.featuredPodcastTitle}{" "}
            </a>
          </div>

          <div className="featured-podcast-description">
            {props.featuredPodcastDescription}
          </div>

          <audio
            controls
            src={props.featuredPodcastUrl}
            id={props.featuredPodcastTitle.replaceAll(" ", "-") + "-stream"}
          >
            Your browser does not support the
            <code>audio</code> element.d
          </audio>
        </div>
      );
    }
  }

  function SecondaryPodcast(props: any) {
    const item = filteredPodcastList.at(props.position);

    return (
      <div
        className="featured-podcast-4"
        style={{
          backgroundImage: `url(${item.podcastImage[0].secure_url})`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="show-name-4">
          <a
            href={"/shows/" + item.show.slug}
            title={"Find out more about the " + item.show.title + " show"}
          >
            {item.show.title}
          </a>

      
        </div>

        <br />

        <div className="featured-podcast-title-4">
          <a
            href={"../podcast/" + item.slug}
            title={"Find out more about " + item.title}
          >
            {item.title}{" "}
          </a>
        </div>

        <audio
          className="featured-podcast-4"
          controls
          src={item.amazonUrl}
          id={item.show.title.replaceAll(" ", "-") + "-stream"}
        >
          Your browser does not support the
          <code>audio</code> element.d
        </audio>
      </div>
    );
  }

  function FeaturedRight() {
    const culledList = filteredPodcastList.slice(5, 9);

    const listOfItems = culledList.map((podcast, idx) => {
      return (
        <div className="row featured-right-row" key={idx}>
          <div className="featured-right-show">From: <a href={"../shows/" +podcast.show.slug} title={"Find out more about "+podcast.show.title} > {podcast.show.title}</a>
          
          
          <div className="featured-right-date">
            <Date date={podcast.date} />
          </div>
          
          
          
          </div>

          <div className="featured-right-title"><a href={"../podcast/" +podcast.slug} title={"Find out more about "+podcast.title} >{podcast.title}</a></div>

          <div className="featured-right-desc">{podcast.description}</div>

      <div className="featured-right-audio">    <audio
            className="featured-right-player"
            controls
            src={podcast.amazonUrl}
            id={podcast.show.title.replaceAll(" ", "-") + "-" + podcast.slug}
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>
          </div>
        
        </div>
      );
    });

    return <div> {listOfItems}</div>;
  }

  function Featured() {
    if (props.showFeatured) {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-12">
                      <FeaturedPodcast />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <SecondaryPodcast position="0" />
                    </div>
                    <div className="col-md-6">
                      <SecondaryPodcast position="1" />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="row">
                    <div className="col-md-12">
                      <SecondaryPodcast position="2" />
                      <SecondaryPodcast position="3" />
                      <SecondaryPodcast position="4" />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="row">
                    <div className="col-md-12">
                      <FeaturedRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  function StandardItems() {
    let standardArray;

    if (props.showFeatured === true) {
      standardArray = filteredPodcastList.slice(10, 99);
    } else {
      standardArray = data.amazonPodcastCollection.items;
    }

    const listOfItems = standardArray.map((podcast, idx) => {
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
              <Link href={"podcast/" + podcast.slug}>Read more</Link>
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
    });

    return <div className="featured-podcasts-overflow"> {listOfItems}</div>;
  }
  return (
    <>
      {props.showtitle != false ? (
        <section className="playlist container page-block amazon-playlist">
          <div className="container">
            <div className="row">
              <div className="col-lg-12  ">
                <div className="layout-title">
                  <h3> {title}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="playlist container page-block amazon-playlist">
        <Featured />

        <StandardItems />
      </section>
    </>
  );
}

export default Message;
