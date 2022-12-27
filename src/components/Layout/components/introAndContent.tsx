import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

function IntroductionAndContent(props) {
  return (
    <>
      <section className="about-area ptb-100">
        <div className="container">
          <div className="row align-items-center title-intro">
            <div className="col-lg-6 col-md-12">
              <div className="about-title">
                <h3>{props.title}</h3>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="about-text">
                <p>{props.introduction} </p>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-8  ">
              <div
                className="content-body "
                dangerouslySetInnerHTML={{
                  __html: documentToHtmlString(props.content),
                }}
              ></div>
            </div>
            <div className="side-bar col-lg-3 "></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default IntroductionAndContent;
