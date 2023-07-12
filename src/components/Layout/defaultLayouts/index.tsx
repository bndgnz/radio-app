import Showpage from "@/src/components/Layout/defaultLayouts/showPage";
import Podcastpage from "@/src/components/Layout/defaultLayouts/podcastPage";
import createContext from 'react';

function renderLayouts(props: any) {
  if (props) {
    switch (props.type.type) {

      case "amazonPodcast":
        return <Podcastpage props={props} />;
        break;

      case "shows":
        return <Showpage props={props} />;

      default:
        return null;
    }
  }
else {return null}


}

export default renderLayouts;
