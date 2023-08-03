import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import Richtext from "@/src/utils/helpers/richTextHelper";

function IntroductionAndContent(props: any) {
 

 
    return (
      <>
       <section className="playlist container page-block amazon-playlist">
          <div className="container">
            <div className="row">
              <div className="col-lg-8  ">{props.introduction}</div>
              <div className="side-bar col-lg-3 "></div>
            </div>

      
          </div>
        </section>
        <section className="playlist container page-block amazon-playlist">
          <div className="container">
            
            <div className="row">
              {" "}
              <div className="col-lg-12  ">
                {" "}
                <Richtext content={props.content} />
              </div>{" "}
            </div>
          </div>
        </section>
       
      </>
    );
   
}

export default IntroductionAndContent;
