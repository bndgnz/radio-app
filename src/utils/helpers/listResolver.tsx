import React from "react";
import { useQuery, gql } from "@apollo/client";
import Showlist from "@/src/components/Layout/components/showlist";
import Djs from "@/src/components/Layout/components/djs";
import Sponsors from "@/src/components/Layout/components/sponsors";
import Streams from "@/src/components/Layout/components/streams";
import Carousel from "@/src/components/Layout/components/carousel";
import Accordion from "@/src/components/Layout/components/accordion";
import Showsontoday from "@/src/components/Layout/components/showsOnToday";
import Stafflist from "@/src/utils/helpers/staffListBuilder";


function ListResolver(props: any) {
 
const id = props.props;
const LIST = gql`
query GetList($id: String!) {
  list(id: $id) {
    title
    type
    staffStatus
    showStatus
    showSchedule {sys{id}}
    bannersCollection {
      items {
        ...bannerDetails
      }
    }
  }
  }

 fragment bannerDetails on Banner {
  title
  title
  bannerImage
  subTitle
  video {
    title
    introduction
    watchMessage
    youtubeId
  }
  buttonText
  bannerLink
  ctaLayout {
    sys {
      id
    }
    title
  }
}
`;

const { data, loading, error } = useQuery(LIST, { variables: { id } });
if (loading) {
  return <div></div>;
}
if (error) {
  return <div></div>;
}
 


  const type = data.list.type;
  if (
    type === "Show List" &&
    (data.list.showStatus === "Current" ||
    data.list.showStatus === "Archived")
  ) {
    return <Showlist props={data.list.showStatus} />;
  } else if (
    type === "Show List" &&
    data.list.showStatus == "Show on Today"
  ) {
    return <Showsontoday props={data.list.showSchedule.sys.id} />;
  } else if (type === "Staff List") {
    return <Stafflist status={data.list.staffStatus} title={data.list.title} />;
  } else if (type === "Sponsor List") {
    return <Sponsors />;
  } else if (type === "Stream List") {
    return <Streams />;
  } else if (type === "Banner List") {
    return <Carousel props={data.list.bannersCollection}/>;
  } else if (type === "Accordion") {
    return <Accordion />;
  } else {
    return null;
  }
}

export default ListResolver;
