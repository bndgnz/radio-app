import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import Richtext from "@/src/utils/helpers/richTextHelper";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

function IntroductionAndContent(props: any) {
  return (
    <>
      <div className="row">
        <div className="col-lg-12  ">
          <Richtext content={props.content} />
        </div>
      </div>
    </>
  );
}

export default IntroductionAndContent;
