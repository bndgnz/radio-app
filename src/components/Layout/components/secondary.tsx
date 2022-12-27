
import config from "@/src/utils/json/config.json";

function SecondaryHero(props: any) {
  const { background, title, tereo, showBanner, introduction } = props;
 
 
 if (props.showBanner==true) {
  return (
    <>
      <div
        className="page-title-area"
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
                <h2>{props.title} </h2><h3 className="banner-subtitle">{props.tereo}{props.showIntro}</h3>

              
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
