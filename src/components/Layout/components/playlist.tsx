import React from "react";
import { useQuery, gql } from "@apollo/client";
import { preProcessFile } from "typescript";
import { addListener } from "process";

function Playlist(props: any) {
 


  function Iframe() {
    console.log(props.playlistUrl);

    const id = props.id;
    const PLAYLIST = gql`
      query GetPLaylist($id: String!) {
        playlist(id: $id) {
          title
          url
          description
          height
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

    if (props.playlistUrl) {
      url = props.playlistUrl;
      title = "Previous shows from " + props.title;
    
    } 
    else if (props.id) {
      url = data.playlist.url;
      title = data.playlist.title;
      height = data.playlist.height;
    }

   
 
    const purl = url.replace(":", "%3a");

 


    switch (true) {
      case purl.includes("soundcloud"):
        src =
          "https://w.soundcloud.com/player/?url=" +
          purl +
          "&color=%23bf1a2c&show_teaser=false&show_artwork=true";
          
        break;

      case purl.includes("mixcloud"):


         const mxurl = url.replace("https://www.mixcloud.com/" , "");
         const mxurl2 = mxurl.replace("/" ,"")

        src = "https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2F" + mxurl2 + "%2F" ;
        height="200";
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

      default:
        console.log(
          "The input string does not include either of the specified substrings"
        );
    }

    return (
      <>
        <section className="playlist container page-block ">
          <div className="container">
            <h3>
              <div>{title}</div>
            </h3>
 <iframe
              loading="lazy"
              id="frame"
              width="100%"
              height={height}
              src={src}
              allow="autoplay"
            ></iframe>
          </div>
        </section>
      </>
    );
  }

  return <Iframe />;
}

export default Playlist;
