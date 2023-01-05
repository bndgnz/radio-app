import React from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import Link from "next/link";

function Message(props: any) {
  const id = props.id;
  const MESSAGE = gql`
  query GetMEssage($id: String!) {
    message(id: $id) {
      headline
      linkText
      linkUrl
      image {
        url
      }
      
      backgroundColor {
        colorName
        hex
      }
      
      iconClass
    }
  }
`;

const { data, loading, error } = useQuery(MESSAGE, { variables: { id } });
if (loading) {
  return <div></div>;
}
if (error) {
  return <div></div>;
}

 

  return (
    <section className="message-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12 default-btn" >
        <Link href={data.message.linkUrl} title={data.message.headline}>
        <a title={data.message.headline}> {data.message.headline} </a>
        </Link> 
          
          
          </div>
        </div>
      </div>
    </section>
  );
}

export default Message;
