import Schedule from "@/src/components/Layout/components/schedule";
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
import PageContent from "@/src/components/Layout/components/introAndContent";
import AmazonPodcast from "@/src/components/Layout/components/amazonPodcast";

function Content(props: any) {
  if (props.props.allProps.showContent == true) {
    return (
      <section className="playlist container page-block amazon-playlist">
        <div className="container">
          <div className="row">
            <div className="col-lg-12  ">
              <PageContent content={props.props.content} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}
function renderComponents(props: any) {
  function Sorter(id, item) {
    const type = id.id.toLowerCase();
    switch (type) {
      case "list":
        return <Listresolver props={id.item} />;
       default:
        return null;
    }
  }

  function Components() {
    if (props.components) {
      return props.components.map((component, idx) => {
        if (component.sys.contentType != undefined) {
          return (
            <Sorter
              id={component.sys.contentType.sys.id}
              item={component.sys.id}
              key={idx}
            />
          );
        }
      });
    }
  }
  if (props.id) {
    return (
      <>
        <Sorter id={props.id} item={props.item} />
      </>
    );
  }
  return (
    <>
      {" "}
      <Content props={props} /> <Components />
    </>
  );
}

export default renderComponents;
