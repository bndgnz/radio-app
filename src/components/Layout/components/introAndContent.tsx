import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import Richtext from "@/src/utils/helpers/richTextHelper"

function IntroductionAndContent(props: any) {
 console.log(props)

if (props.showContent==true)  {

  return (
    <>
     <section className="playlist container page-block amazon-playlist"><div className="container">
   
        
          <div className="row">
            <div className="col-lg-8  ">
            <Richtext content={props.content} />
            </div>
            <div className="side-bar col-lg-3 "></div>
          </div>
   </div>
      </section>
    </>
  );
}
}

export default IntroductionAndContent;
