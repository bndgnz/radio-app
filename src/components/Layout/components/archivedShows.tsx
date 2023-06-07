import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from 'next/image';

function Archived(props: any) {
  const id = props.id;
  const SHOWS = gql`
    query GetShows  {
         showsCollection(order:title_ASC,   where: {archived: true}) {
        items {
          title
          introduction
          slug
          image {
            url
            width
            height
          }
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(SHOWS);
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
 
 const listOfItems = data.showsCollection.items.map(
    (show, idx) => {
      return (
  
          <div className="archived-card row col-12" key={idx}>

 

          <div className="col-sm-12 col-lg-6">
           
              <h5><a href={"../shows/"+show.slug} title={"Find out more about "+show.title} >{show.title}</a></h5>
           
            </div>

            <div className="col-sm-12 col-lg-6">    <p>{show.introduction}</p></div>
       
          </div>
     
      );
    }
  );
  return (
    <section className="about-area ptb-100">
      <div className="container">
        <div className="card-deck  ">{listOfItems}</div>
      </div>
    </section>
  );
}

export default Archived;
