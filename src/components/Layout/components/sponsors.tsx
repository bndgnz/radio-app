import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

















function Sponsors(props: any) {

 


    const id = props.id;
    const PLAYLIST = gql`
      query GetSponsors($id: String!) {
        sponsorsList(id: $id) {
            title
            sponsorsCollection {
              items {
                title
                image {url}
                introduction
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
console.log(data)

 

 

  
    const listOfItems = data.sponsorsList.sponsorsCollection.items.map((sponsor, idx) => {
      return (


<div className="col-lg-3   col-xs-12">
        <div className=" sponsor-card ">
    <img src={sponsor.image.url} className="card-img-top" alt="..." />
    <div className="card-body">
      <h5 className="card-title">{sponsor.title}</h5>
   
{sponsor.introduction}




    </div>
  </div>

  </div>
 

 
      );
    });
    return (


<section className="about-area ptb-100">
      <div className="container">
        
          <div className="card-deck  ">
      


       {listOfItems}
      </div>
          </div>

       
     
    </section>










     
    );
  

   
}

export default Sponsors;
