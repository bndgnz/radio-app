import Playlist from "@/src/components/Layout/components/playlist";
import Staff from "@/src/components/Layout/components/staff";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { MdRssFeed } from 'react-icons/md';
import React from 'react';

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
    if (props.props.type.showUrl) {
      return (
        <>
          <div className="show-page-audio ">
            <h3>Latest show </h3>
            <hr />
            <audio controls src={showlink} id={props.props.type.slug+"-Latest-Show"}>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </div>
        </>
      );
    } else {
      return (
        <div className="show-page-audio ">
          <h3>No latest show available </h3>
        </div>
      );
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
      return (
        <>
          <h3>Show times</h3> <p>Not currently on air</p>
        </>
      );
    }
  }

  return (
    <>
      <div className="container  show-page-details">
        <div className="row showpage-top-row">
          <div className="col-lg-9 col-sm-12 latest-show">
            <LatestShow />
          </div>
          <div className="col-lg-3 col-sm-12  show-page-left-col">
            {" "}
            <Dates />
 
            {props.props.type.rss ? (
              <>
               

 
 RSS: <a href={process.env.NEXT_PUBLIC_SITE_URL+"/"+props.props.type.slug+".xml"} title="Subscribe to the RSS feed for this show" target="_blank" rel="noopener noreferrer">{(MdRssFeed as any)({ color: "#ee802f", size: 80 })}  </a>
 
 
 </>
                  ) : null}




          </div>
        </div>

        <div className="row">
       

          <div className="col-12 ">
            <Staff dj={props.props.type.dj} />

            {props.props.type.content ? (
              <>
                {" "}
                <div className="show-intro">
                  <h3>About {props.props.type.title}</h3>
                  <hr />

                  {documentToReactComponents(props.props.type.content)}

                  {props.props.type.sponsor ? (
                    <>
                      {" "}
                      <div className="sponsor-block">
                        <hr />
                        <h5>
                          {" "}
                          <strong>Proudly sponsored by:</strong>{" "}
                          {props.props.type.sponsor.fields.title}
                        </h5>{" "}
                        <hr />
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
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
