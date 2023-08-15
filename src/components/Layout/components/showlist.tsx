import React from "react";
import { useQuery, gql } from "@apollo/client";
import ShowsOnToday from "@/src/components/Layout/components/showsOnToday";

function Showlist(props: any) {

const typeOfShowList= props.props
let showStatus;

switch (typeOfShowList) {
    case "Archived":
    showStatus= true ;
    break;   
    case "Current":
        showStatus= false; 
        break;  
      }
 
  const SHOWS = gql`
    query GetShows ($showStatus: Boolean!) {
      showsCollection(order: title_ASC, where: { archived:$showStatus}) {
        items {
          title
          introduction
          slug
          cimage

          djCollection {
            items {
              title
              headshot
            }
          }
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(SHOWS, { variables: {showStatus} });
  if (loading) {
    return <div> </div>;
  }
  if (error) {
    return <div> </div>;
  }
 

  function Djs(props: any) {
    const listOfDjs = props.data.items.map((dj, idx) => {
      return <div key={idx}>{dj.title}</div>;
    });

    return <div>{listOfDjs}</div>;
  }

  const listOfItems = data.showsCollection.items.map((show, idx) => {
    return (
      <div className="archived-card row col-12" key={idx}>
        <div className="col-sm-12 col-lg-2"> 
          <img src={show.cimage[0].url} className="archived-show-image" />
        </div>

        <div className="col-sm-12 col-lg-3 archived-show-title">
          <h5>
            <a
              href={"../shows/" + show.slug}
              title={"Find out more about " + show.title}
            >
              {show.title}
            </a>
          </h5>
        </div>

        <div className="col-sm-12 col-lg-4  archived-show-introduction">
          {" "}
          <p>{show.introduction}</p>
        </div>

        <div className="col-sm-12 col-lg-3  archived-show-introduction">
          <p>
            <strong>Presented by:</strong>
          </p> 
         
            <Djs data={show.djCollection} /> 
         
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

export default Showlist;
