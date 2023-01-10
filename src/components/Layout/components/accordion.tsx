import React from "react";
import Components from "@/src/components/Layout/components/index";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

// Demo styles, see 'Styles' section below for some notes on use.
import "react-accessible-accordion/dist/fancy-example.css";

import { useQuery, gql } from "@apollo/client";

function PageAccordion(props: any) {
  console.log(props);
  const id = props.id;
  const ACCORDION = gql`
    query GetAccordion($id: String!) {
      accordion(id: $id) {
        title
        accordionItemsCollection {
          items {
            ...PlaylistId
            ...LayoutId 
            ...CarouselId
            ...MessageId
            __typename
          }
        }
      }
    }
    fragment PlaylistId on Playlist {
        title
        sys {
          id
           
          }
        }
        fragment LayoutId on Layout {
            title
            sys {
              id
               
              }
            }
            fragment CarouselId on Carousel {
                title
                sys {
                  id
                   
                  }
                }
                fragment MessageId on Message {
                    title
                    sys {
                      id
                    }
                  }
  `;

  const { data, loading, error } = useQuery(ACCORDION, { variables: { id } });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
 

console.log(data)
  return (
    <section className="accordion-wrapper">
      <div className="container  page-block">
        <div className="row">
          <div className="col-12 ">
          <h3>{data.accordion.title}</h3>


            <Accordion allowZeroExpanded >
            
            {data &&
                data.accordion.accordionItemsCollection.items.map((item, i) => (

                    <AccordionItem key={i}>

<AccordionItemHeading>
                    <AccordionItemButton>
                       {item.title}
                    </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel>         
                  <div key={i}>
                    <Components
                      id={item.__typename.toLowerCase()}
                      item={item.sys.id}
                    />
                  </div>
                  </AccordionItemPanel>
                  </AccordionItem>
                
                
                ))}

       
             




            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
export default PageAccordion;
