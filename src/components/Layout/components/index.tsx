import Schedule from "@/src/components/Layout/components/schedule";
import IntroductionAndContent from "@/src/components/Layout/components/introAndContent";
import Stream from "@/src/components/Layout/components/streams";
import Playlist from "@/src/components/Layout/components/playlist";
import LayoutResolver from "@/src/components/Layout/components/layoutResolver";
import Message from "@/src/components/Layout/components/message";
import Accordion from "@/src/components/Layout/components/accordion";
import QueryStringPlaylist from "@/src/components/Layout/components/queryStringPlaylist";
import Shows from "@/src/components/Layout/components/shows";
import AmazonPlaylist from "@/src/components/Layout/components/amazonPlaylist";
import LatestAmazonPodcasts from "@/src/components/Layout/components/latestAmazonPodcasts";
import FilteredPlaylist from "@/src/components/Layout/components/filteredAmazonPlaylist";
import Listresolver from "@/src/utils/helpers/listResolver";

function renderComponents(props: any) {
 

  function Sorter(id, item) {
    const type = id.id.toLowerCase();
 
    switch (type) {
      case "list":
        return <Listresolver props={id.item} />;

      case "filteredamazonplaylist":
        return <FilteredPlaylist id={id.item} />;

      case "latestpodcasts":
        return <LatestAmazonPodcasts id={id.item} />;

      case "amazonplaylist":
        return <AmazonPlaylist id={id.item} />;

      case "showlist":
        return <Shows id={id.item} />;

      case "schedule":
        return <Schedule id={id.item} />;
      case "querystringplaylist":
        return <QueryStringPlaylist />;
      case "accordion":
        return <Accordion id={id.item} />;
      case "layout":
        return <LayoutResolver id={id.item} />;

      case "video":
        return <h1>Video </h1>;
      case "stream":
        return <Stream id={id.item} />;
      case "playlist":
        return <Playlist id={id.item} />;
      case "message":
        return <Message id={id.item} />;
      default:
        return null;
    }
  }

 
  if (props.components) {
    return props.components.map((component, idx) => {
      return (
        <Sorter
          id={component.sys.contentType.sys.id}
          item={component.sys.id}
          key={idx}
        />
      );
    });
  }



  if (props.showContent == true) {
    return (
      <IntroductionAndContent
        introduction={props.introduction}
        content={props.content}
        title={props.title}
        showContent={props.showContent}

      />
    );
  }










  if (props.id) {
    return <Sorter id={props.id} item={props.item} />;
  }
}

export default renderComponents;
