import Schedule from "@/src/components/Layout/components/schedule";
import Carousel from "@/src/components/Layout/components/carousel";
import IntroductionAndContent from "@/src/components/Layout/components/introAndContent";
import Stream from "@/src/components/Layout/components/streams";
import Playlist from "@/src/components/Layout/components/playlist";
import LayoutResolver from "@/src/components/Layout/components/layoutResolver";
import Message from "@/src/components/Layout/components/message";
import Accordion from "@/src/components/Layout/components/accordion";
import ShowsOnToday from "@/src/components/Layout/components/showsOnToday";
import Sponsors from "@/src/components/Layout/components/sponsors";
import Djs from "@/src/components/Layout/components/djs";
import PlaylistCollection from "@/src/components/Layout/components/playlistCollection";
import Search from "@/src/components/Layout/components/search/search";
import QueryStringPlaylist from "@/src/components/Layout/components/queryStringPlaylist";
import Shows from "@/src/components/Layout/components/shows";
import AmazonPlaylist from "@/src/components/Layout/components/amazonPlaylist";
import LatestAmazonPodcasts from "@/src/components/Layout/components/latestAmazonPodcasts";
import Archived from "@/src/components/Layout/components/archivedShows";
import FilteredPlaylist from "@/src/components/Layout/components/filteredAmazonPlaylist";
import Current from "@/src/components/Layout/components/currentShows";

function renderComponents(props: any) {

  
  function Sorter(id, item) {
    const type = id.id.toLowerCase();
    switch (type) {
      case "archivedshows":
        return <Archived id={id.item} />;

      case "currentshows":
        return <Current id={id.item} />;

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
      case "showsontoday":
        return <ShowsOnToday id={id.item} />;
      case "stafflist":
        return <Djs id={id.item} />;

      case "searchbox":
        return <Search />;

      case "playlistgrid":
        return <PlaylistCollection id={id.item} />;

      case "querystringplaylist":
        return <QueryStringPlaylist />;

      case "staff":
        return <h2>TBD</h2>;
      case "search":
        return <h2>TBD</h2>;

      case "sponsorslist":
        return <Sponsors id={id.item} />;

      case "accordion":
        return <Accordion id={id.item} />;
      case "layout":
        return <LayoutResolver id={id.item} />;
      case "video":
        return <h1>Video </h1>;
      case "collection":
        return <h1>collection </h1>;
      case "carousel":
        return <Carousel id={id.item} />;
      case "collection":
        return <h1>collection </h1>;
      case "introductionandcontent":
        return (
          <IntroductionAndContent
            introduction={props.introduction}
            content={props.content}
            title={props.title}
          />
        );
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
  if (props.id) {
    return <Sorter id={props.id} item={props.item} />;
  }
}

export default renderComponents;
