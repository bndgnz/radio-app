import React from "react";

function Sorter(props: any) {
  let src;
  let hideVisual;
  let showTitle;



hideVisual = props.visualPlayer == true ? "true" : "false";
showTitle = props.showTitle == true || props.showTitle == null  ? "true" : "false";
const url = props.url;
 
  const height = props.height;
 
  const purl = url.replace(":", "%3a");
  switch (true) {
    case url.includes("soundcloud"):

   
      src =
        "https://w.soundcloud.com/player/?url=" +
        purl +
        "&color=%23bf1a2c&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=" +
        hideVisual +
        "&download=true";

      break;

    case url.includes("mixcloud"):
      const mxurl = url.replace("https://www.mixcloud.com/", "");
      const mxurl2 = mxurl.replace("/", "");

      src =
        "https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2F" +
        mxurl2 +
        "%2F";

      break;

    case purl.includes("youtube.com/watch"):
      const presrc = url.replace("https://www.youtube.com/watch?v=", "");
      src = "https://www.youtube.com/embed/" + presrc;

      break;

    case purl.includes("youtube.com/playlist"):
      const presrc2 = url.replace("https://www.youtube.com/playlist?list=", "");
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
    <iframe
      loading="lazy"
      allow="encrypted-media"
      id="frame"
      width="100%"
      height={height}
      src={src}
    ></iframe>
  );
}

export default Sorter;
