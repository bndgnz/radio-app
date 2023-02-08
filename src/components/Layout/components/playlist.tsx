import React from "react";
import { useQuery, gql } from "@apollo/client";
import { preProcessFile } from "typescript";
import { addListener } from "process";
import Link from "next/link";

import PlaylistTypeSorter from "@/src/utils/helpers/playlistTypeSorter";

function type(props) {
 
  const type = props;

  switch (true) {
    case type.includes("soundcloud"):
      return 500;
      break;

      case type.includes("mixcloud"):
      return 210;
      break;

    default:
      return null;
  }

  return 400;
}

function Playlist(props: any) {
  const id = props.id;
  function Iframe() {
    const PLAYLIST = gql`
      query GetPLaylist($id: String!) {
        playlist(id: $id) {
          title
          url
          description
          height
          hideVisualPlayer
          showTitle
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

    let itemid;
    let height;
    let url;
    let title;
    let visual;
    let hideVisual;
    let showTitle;

    if (props.playlistUrl) {
      url = props.playlistUrl;
      title = "Previous shows from " + props.title;

      height = type(props.playlistUrl);

      hideVisual = "false";
      showTitle = "false;";
    }

    if (props.id) {
      type(data.playlist.url);

      itemid = props.id;
      url = data.playlist.url;
      title = data.playlist.title;
      height = props.source ? type(data.playlist.url) : data.playlist.height;
      visual = data.playlist.hideVisualPlayer;
      hideVisual = visual == true ? "false" : "true";
      showTitle =
        data.playlist.showTitle == true || data.playlist.showTitle == null
          ? "true"
          : "false";
    }

    return (
      <>
        <section className="playlist container page-block ">
          <div className="container">
            {showTitle == "true" ? (
              <a
                href={"/playlist?playlist=" + itemid}
                className="tooltiplink playlist-title-link"
                data-title={"View all tracks from \n \n" + title}
              >
                {" "}
                {title}{" "}
              </a>
            ) : null}

            <PlaylistTypeSorter
              url={url}
              height={height}
              visualPlayer={hideVisual}
              title={title}
              showTitle={showTitle}
            />
          </div>
        </section>
      </>
    );
  }

  return <Iframe />;
}

export default Playlist;
