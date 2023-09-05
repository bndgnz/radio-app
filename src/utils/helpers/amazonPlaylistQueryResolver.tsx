import React from "react";
import { useQuery, gql } from "@apollo/client";

function FilteredAmazonPlaylistResolver(props: any) {
 

  function PlaylistTitle() {
    if (props.data.filteredAmazonPlaylist.displayTitle == true) {
      return (
        <h2 className="filtered-playlisttitle">
          {props.data.filteredAmazonPlaylist.title}
        </h2>
      );
    }
  }

  const show = props.data.filteredAmazonPlaylist.showName
    ? props.data.filteredAmazonPlaylist.showName
    : "";
  const date1 = props.data.filteredAmazonPlaylist.startDate
    ? props.data.filteredAmazonPlaylist.startDate
    : "2000-01-10T00:00:00.000Z";
  const date2 = props.data.filteredAmazonPlaylist.endDate
    ? props.data.filteredAmazonPlaylist.endDate
    : "2200-01-10T00:00:00.000Z";
  const titleContains = props.data.filteredAmazonPlaylist.titleContains
    ? props.data.filteredAmazonPlaylist.titleContains
    : "";
  const descriptionContains = props.data.filteredAmazonPlaylist
    .descriptionContains
    ? props.data.filteredAmazonPlaylist.descriptionContains
    : "";
  const sort = props.data.filteredAmazonPlaylist.sort
    ? props.data.filteredAmazonPlaylist.sort
    : "none";
 
 let sortType;
  if (sort == "Ascending") {
    sortType = "date_ASC";
 ;
  }
   if (sort == "Descending") {
    sortType = "date_DESC";
   
  } if (sort == "none"){ 
     sortType = "date_DESC";
 
  }

  const PLAYLISTITEMS = gql`
    query GetFilteredItems(
      $show: String!
      $date1: DateTime!
      $date2: DateTime!
      $titleContains: String!
      $descriptionContains: String!
      $sortType: AmazonPodcastOrder!
    ) {
      amazonPodcastCollection(
        limit: 300
        where: {
          AND: [
            {
              AND: [
                { show: { title_contains: $show } }
                { date_gt: $date1 }
                { date_lt: $date2 }
                { title_contains: $titleContains }
                { description_contains: $descriptionContains }
              ]
            }
          ]
        }
        order: [$sortType]
      ) {
        total
        items {
          title
          date
          description
          amazonUrl
          slug
          podcastImage
          show {
            ...showname
          }
        }
      }
    }

    fragment showname on Shows {
      title
    }
  `;

  const { data, loading, error } = useQuery(PLAYLISTITEMS, {
    variables: {
      show,
      date1,
      date2,
      descriptionContains,
      titleContains,
      sortType,
    },
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
    const listOfItems = data.amazonPodcastCollection.items.map(
      (podcast, idx) => {
        return (
          <div className="row amazon-playlist-row" key={idx}>
            <div className="col-lg-2 col-xs-12 amazon-podcast-image">
              <a href={"../podcast/" + podcast.slug}>
                {" "}
                <img src={podcast.podcastImage[0].url} alt="..." />
              </a>
              <div className="amazon-podcast-date"></div>
            </div>

            <div className="col-lg-6 col-xs-12 amazon-podcast-content">
              <div className=" amazon-podcast-card-title">
                <strong>
                  <a
                    href={"../podcast/" + podcast.slug}
                    title={"Read more about " + podcast.title}
                  >
                    {podcast.title}
                  </a>
                </strong>
              </div>
              <div className=" amazon-podcast-card-description">
                {podcast.description}
              </div>

              <div className="read-more">
                {" "}
                <a
                  href={"../podcast/" + podcast.slug}
                  title={"Read more about " + podcast.title}
                >
                  Read more
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-xs-12">
              {" "}
              <div className="amazonplaylist-audio">
                {" "}
                <audio controls src={podcast.amazonUrl} id={podcast.show.title.replaceAll(" ","-")+"-"+podcast.slug}>
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
      <section className="playlist container page-block amazon-playlist">
        <div className="container">
          <PlaylistTitle />

          <Items />
        </div>
      </section>
    </>
  );
}

export default FilteredAmazonPlaylistResolver;
