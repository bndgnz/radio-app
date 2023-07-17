import { useQuery, gql } from "@apollo/client";
import { Carousel } from "react-responsive-carousel";
import LayoutResolver from "@/src/components/Layout/components/layoutResolver";

function BannerCarousel(props) {
  const carouselArray = props.props.items;

  return (
    <>
      <div className="home-section col-12">
        <Carousel
          showIndicators={true}
          showStatus={false}
          showArrows={true}
          interval={5000}
          showThumbs={false}
          transitionTime={1680}
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
                  backgroundImage: `url(${item.bannerImage[0].secure_url})`,
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
                          {item.ctaLayout !== null ? (
                            <LayoutResolver id={item.ctaLayout.sys.id} />
                          ) : null}
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
