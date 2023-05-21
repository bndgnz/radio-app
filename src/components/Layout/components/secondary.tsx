import config from "@/src/utils/json/config.json";
import Search from "@/src/components/Layout/components/search/search";



function SecondaryHero(props: any) {
  const { background, title, tereo, showBanner, introduction } = props;

  if (props.showBanner == true) {
    return (
      <>
        <div
          className="secondary-banner page-title-area"
          style={{
            backgroundImage: background
              ? `url(${props.background})`
              : `url(${config.defaultBanner})`,
          }}
        >
          <div className="d-table">
            <div className="d-table-cell">
        
              <div className="container">
                <div className="page-title-content">
                  <h1>{props.title} </h1>
                  <h3 className="banner-subtitle">{props.tereo}</h3>
                  <h4>{props.showIntro}</h4>
            
                  <section className="container page-block search-box"><Search /></section>

                </div>
              </div>
            </div>
          </div>

     
        </div>
        <style jsx>{`
          .page-title-area {
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
        `}</style>


 
      </>
    );
  }
}

export default SecondaryHero;
