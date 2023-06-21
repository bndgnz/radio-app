import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Link from "next/link";

function Shows(props: any) {
  const id = props.id;
  const SHOWS = gql`
    query GetShows  {
         showsCollection(order:title_ASC,   where: {archived: false}) {
        items {
		 cimage
     showUrl
          title
		   path
          introduction
          slug
		   timeSlotsCollection(limit: 10) {
              ...times
            }
          
        }
      }
    }
	 fragment times on ShowsTimeSlotsCollection {
      items {
        title
      }
    }
  `;

  const { data, loading, error } = useQuery(SHOWS, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
console.log(data)
  function LatestShow(props) {
    if (props.showlink) {
      const driveLink1 = props.showlink.replace(
        "https://drive.google.com/file/d/",
        "https://www.googleapis.com/drive/v3/files/"
      );
      const driveLink2 = driveLink1.replace(
        "/view?usp=share_link",
        "?alt=media&key=AIzaSyAOiHW72zzRZmVNDcGXivXXfJYM75jVOfw"
      );

      return (
        <>
          <div className="show-page-audio">
    

            <audio controls src={driveLink2}>
              Your browser does not support the
              <code>audio</code> element.
            </audio>       <p><strong>Latest show </strong></p> 
          </div>
        </>
      );
    } else {
      return null;
    }
  }
 

  const listOfItems = data.showsCollection.items.map((show, idx) => {
    return (
      <div className="archived-card row col-12" key={idx}>
        <div className="col-sm-12 col-lg-2 show-list-image">
         <a href={"/shows/" + show.slug} title={show.title}> <img
            src={show.cimage[0].url}
            className="card-img-top  archived-show-image"
            alt="..."
          /></a>
        </div>

        <div className="col-sm-12 col-lg-7 archived-show-title">
          <h5 className="card-title">
            <Link href={"/shows/" + show.slug}>{show.title}</Link>
          </h5>
          <p>{show.introduction}</p>
        </div>
 

       

        <div className="col-sm-12 col-lg-3">
          <LatestShow showlink={show.showUrl} />
        </div>
      </div>
    );
  });
  return (
    <section className="about-area ptb-100">
      <div className="container">
        <div className="card-deck  ">{listOfItems}</div>
      </div>
    </section>
  );
}

export default Shows;
