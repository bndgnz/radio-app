import config from "@/src/utils/json/config.json";
import Schedule from "@/src/components/Layout/components/schedule";
import Carousel from "@/src/components/Layout/components/carousel";
import IntroductionAndContent from "@/src/components/Layout/components/introAndContent";
import Stream from "@/src/components/Layout/components/streams";
import Playlist from "@/src/components/Layout/components/playlist";
import { loadComponents } from "next/dist/server/load-components";
import LayoutResolver from "@/src/components/Layout/components/layoutResolver";

function renderComponents(props: any) {
  function Sorter(id, item) {
    switch (id.id) {
      case "schedule":
        return <Schedule id={id.item} />;
      case "layout":
        return <LayoutResolver id={id} />;
      case "video":
        return <h1>Video </h1>;
      case "collection":
        return <h1>collection </h1>;
      case "carousel":
        return <Carousel id={id.item} />;
      case "collection":
        return <h1>collection </h1>;
      case "introductionAndContent":
        return (
          <IntroductionAndContent
            introduction={props.introduction}
            content={props.content}
            title={props.title}
          />
        );
      case "stream":
        return <Stream id={id} />;
      case "playlist":
        return <Playlist id={id.item} />;
      default:
        return null;
    }
  }

  if (props.components) {
    return props.components.map((component, idx) => {
      const id = component.sys.contentType.sys.id;
      const key = component.sys.id;

      return (
        <Sorter
          id={component.sys.contentType.sys.id}
          item={component.sys.id}
          key={idx}
        />
      );
    });
  }
  if (props.id) {
    return <Sorter id={props.id} item={props.item} />;
  }
}

export default renderComponents;
