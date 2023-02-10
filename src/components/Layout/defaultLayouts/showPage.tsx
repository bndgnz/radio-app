import Playlist from "@/src/components/Layout/components/playlist";
import Staff from "@/src/components/Layout/components/staff";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

function Showpage(props: any) {
  const showlink = props.props.type.showUrl;
  function ShowPlaylist() {
    if (props.props.type.playlistUrl) {
      return (
        <>
          <h3>
            &nbsp;&nbsp;&nbsp;Previous shows from {props.props.type.title}
          </h3>
        </>
      );
    } else {
      return null;
    }
  }

  function LatestShow() {
    if (showlink) {
      const driveLink1 = showlink.replace(
        "https://drive.google.com/file/d/",
        "https://www.googleapis.com/drive/v3/files/"
      );
      const driveLink2 = driveLink1.replace(
        "/view?usp=share_link",
        "?alt=media&key=AIzaSyAOiHW72zzRZmVNDcGXivXXfJYM75jVOfw"
      );

      return (
        <>
          <div className="show-page-audio-controls">
            <h3>Latest show </h3>
            <hr />
            <audio controls src={driveLink2}>
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
        return <time key={idx}>{time.fields.title}</time>;
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
      <div className="container  show-page-details">
        <div className="row">
          <div className="col-lg-9 col-sm-12 ">
            <Staff dj={props.props.type.dj} />
          </div>
          <div className="col-lg-3 col-sm-12  show-page-left-col">
            <Dates />

            {props.props.type.sponsor ? (
              <>
                {" "}
                <div className="sponsor-block">
                  <p>
                    <strong>Proudly sponsored by:</strong>{" "}
                  </p>
                  <hr />
                  <h5>{props.props.type.sponsor.fields.title}</h5>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="show-intro">
              <h3>About {props.props.type.title}</h3>
              <hr />

              {documentToReactComponents(props.props.type.content)}
            </div>
            <LatestShow />

            {props.props.type.playlistUrl ? (
              <Playlist
                playlistUrl={props.props.type.playlistUrl}
                title={props.props.type.title}
                id=""
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Showpage;
