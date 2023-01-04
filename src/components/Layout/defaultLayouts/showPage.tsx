import Schedule from "@/src/components/Layout/components/schedule";
import Carousel from "@/src/components/Layout/components/carousel";
import IntroductionAndContent from "@/src/components/Layout/components/introAndContent";
import Stream from "@/src/components/Layout/components/streams";
import Playlist from "@/src/components/Layout/components/playlist";
import Staff from "@/src/components/Layout/components/staff";

function Showpage(props: any) {
 
  

  const showlink = props.props.type.showUrl;
  function ShowPlaylist() {
    if (props.props.type.playlistUrl) {
      return (
        <>
          <h3>
            &nbsp;&nbsp;&nbsp;Previous shows from {props.props.type.title}
          </h3>
          <iframe
            id="frame"
            width="100%"
            height="600"
            src={"https://w.soundcloud.com/player/?url="+props.props.type.playlistUrl.replace(":", "%3a")}
            allow="autoplay"
          ></iframe>
        </>
      );
    } else {
      return null;
    }
  }

  function LatestShow() {
    if (showlink) {
      return (
        <>
          <div className="show-page-audio-controls">
            <h3>Latest show </h3>
            <audio controls src={showlink}>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </div>
        </>
      );
    } else {
      return null;
    }
  }

  const items = props.props.type.times;
  function Dates(props) {
    if (items) {
      const listOfItems = items.map((time, idx) => {
        return (
          <time key={idx}>
            {time.fields.title} {time.fields.amPm.toLowerCase()}
          </time>
        );
      });
      return (
        <>
          <div className="show-time-slots">
            <h3>Show times</h3> {listOfItems}
          </div>
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-9 col-sm-12 ">
            <Staff dj={props.props.type.dj} />
          </div>
          <div className="col-lg-3 col-sm-12  show-page-left-col">
            <Dates />
            <LatestShow />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ShowPlaylist />
          </div>
        </div>
      </div>
    </>
  );
}

export default Showpage;
