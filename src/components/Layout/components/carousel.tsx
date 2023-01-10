import { useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import Link from "next/link";
import Streams from "@/src/components/Layout/components/streams";
import LayoutResolver from "@/src/components/Layout/components/layoutResolver";

import ModalVideo from "react-modal-video";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

function BannerCarousel(props) {
  const CAROUSEL = gql`
    query GetCarousel($id: String!) {
      carousel(id: $id) {
        bannersCollection {
          items {
            title
            heroImage {
              url
            }
            subTitle
            video {
              title
              introduction
              watchMessage
              youtubeId
            }
            buttonText
            bannerLink
            ctaLayout {
              sys {
                id
              }
              title
            }
          }
        }
      }
    }
  `;

  const id = props.id;

  const { data, loading, error } = useQuery(CAROUSEL, { variables: { id } });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  const carouselArray = data.carousel.bannersCollection.items;

  return (
    <>
      <div className="home-section col-12">
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
                   
                }}

                // onMouseEnter={(e) => { e.preventDefault(); this.changeVideoID(item.video.youtubeId)}}
              >
                <div className="d-table">
                  <div className="d-table-cell">
                    <div className="container">
                      <div className="main-banner-content">
                        <span className="sub-title">{item.subTitle}</span>
                        <h1>{item.title}</h1>

                        <div className="carousel-ctas">

                         { item.ctaLayout!== null ? (<LayoutResolver id={item.ctaLayout.sys.id} />) : null }
 
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* If you want change the video need to update below videoID */}
    </>
  );
}

export default BannerCarousel;
