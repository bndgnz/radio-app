import Showpage from "@/src/components/Layout/defaultLayouts/showPage";

function renderLayouts(props: any) {
  if (props) {
    switch (props.type.type) {
      case "shows":
        return <Showpage props={props} />;

      default:
        return;
    }
  }
}

export default renderLayouts;
