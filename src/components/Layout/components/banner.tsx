import { useState, useEffect } from "react";
import Link from "next/link";
import ModalVideo from "react-modal-video";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

import { Carousel } from "react-responsive-carousel";

function About(props: any) {
  const { data, info } = props;
  const [contactData, setContactData] = useState([]);
  const [carouselArray, setCarouselArray] = useState(data.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [display, setDisplay] = useState(false);
  const handleOpen = (i) => {
    setModalOpen(i);
  };
  const handleVideo = (id) => {
    setVideoId(id);
  };
  useEffect(() => {
    setDisplay(true);
    setContactData(info);
  }, []);

 


  return (
    <>
      <div className="home-section">
        {display ? (
          <Carousel
            showIndicators={true}
            showStatus={false}
            showArrows={true}
            interval={3000}
            showThumbs={false}
            transitionTime={680}
            autoPlay={true}
            dynamicHeight={false}
            infiniteLoop={true}
            selectedItem={0}
          >
            {carouselArray.map((item, index) => (
              <div key={index}>
                <div
                  className="main-banner"
                  key={index}
                  style={{
                    backgroundImage: `url(${item.heroImage.url})`,
                    backgroundRepeat: "no-repeat",
                    height: "692px",
                  }}

                  // onMouseEnter={(e) => { e.preventDefault(); this.changeVideoID(item.video.youtubeId)}}
                >
                  <div className="d-table">
                    <div className="d-table-cell">
                      <div className="container">
                        <div className="main-banner-content">
                          <span className="sub-title">{item.subTitle}</span>
                          <h1>{item.title}</h1>

                          <div className="btn-box">
                            <Link
                              href={
                                item.button.__typename == "Events"
                                  ? `/events/${item.button.slug}`
                                  : `/${item.button.slug}`
                              }
                            >
                              <a className="default-btn" title={item.title}>
                                {item.buttonText}
                                <span></span>
                              </a>
                            </Link>

                            {item.video?.youtubeId ? (
                              <Link
                                href={`https://www.youtube.com/watch?v=${item.video.youtubeId}`}
                              >
                                <a
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleVideo(item.video.youtubeId);
                                    handleOpen(true);
                                  }}
                                  className="optional-btn"
                                  title={item.title}
                                  href={`https://www.youtube.com/watch?v=${item.video.youtubeId}`}
                                >
                                  <i className="far fa-play-circle"></i> Watch
                                  Video
                                </a>
                              </Link>
                            ) : null}
                          </div>

                          <div className="banner-footer">
                            <div className="container-fluid p-0">
                              <div className="row m-0 align-items-center">
                                <div className="col-lg-5 col-md-12 p-0"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          ""
        )}
        <div className="newFooter">
          <div className="banner-footer">
            <div className="container-fluid p-0">
              <div className="row m-0 align-items-center">
                <div className="col-lg-7 col-md-12 p-0"></div>
                <div className="col-lg-5 col-md-12 p-0">
                  <div className="banner-contact-info">
                    <ul>
                      {contactData.map((item, index) => (
                        <li key={index}>
                          <i className={item.iconClass}></i>
                          <span>{item.headline}</span>
                          <span
                            className="banner-contact-info-content"
                            dangerouslySetInnerHTML={{
                              __html: documentToHtmlString(item.overview.json),
                            }}
                          ></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If you want change the video need to update below videoID */}
      {typeof window !== "undefined" && (
      <ModalVideo
        channel="youtube"
        isOpen={modalOpen}
        videoId={videoId}
        onClose={() => handleOpen(false)}
        onClick
      />)

      }
      
    </>
  );
}
export default About;
