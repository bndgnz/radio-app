import React from "react";
import { useQuery, gql } from "@apollo/client";
import { preProcessFile } from "typescript";
import { addListener } from "process";

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

    let src;
    let height;
    let url;
    let title;
    let visual;
    let hideVisual;
    let showTitle;

    if (props.playlistUrl) {
      url = props.playlistUrl;
      title = "Previous shows from " + props.title;
      height = props.height;
      hideVisual = "false";
    }

    if (props.id) {
      url = data.playlist.url;
      title = data.playlist.title;
      height = props.qheight ?props.qheight :data.playlist.height;
      visual = data.playlist.hideVisualPlayer;
      hideVisual = visual == true ? "false" : "true";
      showTitle =
        data.playlist.showTitle == true || data.playlist.showTitle == null
          ? "true"
          : "false";
    }

    const purl = url.replace(":", "%3a");

    switch (true) {
      case purl.includes("soundcloud"):
        src =
          "https://w.soundcloud.com/player/?url=" +
          purl +
          "&color=%23bf1a2c&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=" +
          hideVisual +
          "&download=true";

        break;

      case purl.includes("mixcloud"):
        const mxurl = url.replace("https://www.mixcloud.com/", "");
        const mxurl2 = mxurl.replace("/", "");

        src =
          "https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2F" +
          mxurl2 +
          "%2F";
        height = "200";
        break;

      case purl.includes("youtube.com/watch"):
        const presrc = url.replace("https://www.youtube.com/watch?v=", "");
        src = "https://www.youtube.com/embed/" + presrc;
        break;

      case purl.includes("youtube.com/playlist"):
        const presrc2 = url.replace(
          "https://www.youtube.com/playlist?list=",
          ""
        );
        src = "https://www.youtube.com/embed/videoseries?list=" + presrc2;

        break;
      case purl.includes("open.spotify.com"):
        const presrc3 = url.replace("https://open.spotify.com/artist/", "");
        src = "https://open.spotify.com/embed/artist/" + presrc3;
        break;

      default:
        console.log(
          "The input string does not include either of the specified substrings"
        );
    }

    return (
      <>
        <section className="playlist container page-block ">
          <div className="container">
            {showTitle == "true" ? <h3>{title} </h3> : null}

            <iframe
              loading="lazy"
              allow="encrypted-media"
              id="frame"
              width="100%"
              height={height}
              src={src}
            ></iframe>
          </div>
        </section>
      </>
    );
  }

  return <Iframe />;
}

export default Playlist;
