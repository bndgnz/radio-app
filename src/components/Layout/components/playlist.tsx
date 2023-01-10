import React from "react";
import { useQuery, gql } from "@apollo/client";

function Playlist(props: any) {
  const id =props.id;
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

  const { data, loading, error } = useQuery(PLAYLIST, { variables: { id } });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  function Iframe() {
    if (data.playlist.url) {
      const purl = data.playlist.url.replace(":", "%3a");
      let src;
      let height;
      const title = "<h3>" + data.playlist.title + "</h3>";

      switch (true) {
        case purl.includes("soundcloud"):
          src =
            "https://w.soundcloud.com/player/?url=" +
            purl +
            "&color=%23bf1a2c&show_teaser=false&show_artwork=true";
          height = data.playlist.height;
          break;

        case purl.includes("mixcloud"):
          src =
            "https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&&light=1&feed=" +
            purl;

            height = data.playlist.height;

          break;
        case purl.includes("youtube"):
          const presrc = data.playlist.url.replace(
            "https://www.youtube.com/watch?v=",
            ""
          );

          src = "https://www.youtube.com/embed/" + presrc;
          height = data.playlist.height;

          break;
        default:
          console.log(
            "The input string does not include either of the specified substrings"
          );
      }

 
        

      return (
        <><section className="playlist container page-block "><div className="container">
          <h3>
            <div dangerouslySetInnerHTML={{ __html: title }}></div>
          </h3>
          <iframe
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
  }

  return <Iframe />;
}

export default Playlist;
