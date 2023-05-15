import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

function AmazonPlaylist(props: any) {
  const id = props.id;

  const PLAYLIST = gql`
    query GetPLaylist($id: String!) {
      amazonPlaylist(id: $id) {
        title
        podcastsCollection   {
          items  {
            title
            amazonUrl
            description
            podcastImage
            date
          }
        }
      }
    }
  `;
  const { data, loading, error } = useQuery(PLAYLIST, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

function Date (date :any) {

    let year = date.date.substring(0, 4);
    let month = date.date.substring(5, 7);
    let day = date.date.substring(8, 10);
     return (
<strong><strong>{day +"-"+month  +"-" +year }</strong> </strong> 

    )

}
  function Items() {
    const listOfItems = data.amazonPlaylist.podcastsCollection.items.map(
      (podcast, idx) => {
        return (
            
            <div className="row amazon-playlist-row"   key={idx}>
          <div className="col-lg-1 col-xs-12 amazon-podcast-image" >
           
              <img
                src={podcast.podcastImage[0].url}
               
                alt="..."
              />
              <div className="amazon-podcast-date"></div>
 </div>

              <div className="col-lg-7 col-xs-12 amazon-podcast-content">
                <div className=" amazon-podcast-card-title"><strong>{podcast.title}</strong></div>
                <div className=" amazon-podcast-card-description">{podcast.description}</div>
             
                </div>
                <div className="col-lg-4 col-xs-12"> <div className="amazonplaylist-audio">  <audio controls src={podcast.amazonUrl} >
              Your browser does not support the
              <code>audio</code> element.
            </audio><Date date={podcast.date} /></div> </div>
           
          </div>
         

          
        );
      }
    );

    return <div> {listOfItems}</div>;
  }

  return (
    <>
      <section className="playlist container page-block amazon-playlist">
        <div className="container">
            
          <Items />
        </div>
      </section>
    </>
  );
}

export default AmazonPlaylist;
