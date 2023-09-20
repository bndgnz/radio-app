import React from "react";
import { useQuery, gql } from "@apollo/client";
import Richtext from "@/src/utils/helpers/richTextHelper";
import Image from "next/image";

function Message(props: any) {
  const id = props.id;
  const MESSAGE = gql`
    query GetMEssage($id: String!) {
      message(id: $id) {
        title
        headline
        linkText
        messageType
       
        overview {
          json
          links {
            entries {
              inline {
                sys {
                  id
                }
              }
            }
          }
        }
        linkUrl
        image {
          url
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
 
  function MessageType() {
    const type = data.message.messageType;

    switch (type) {
      case "Rich Text":
        return <Richtext content={data.message.overview.json} />;
      case "Title":
        return (
          <div className="layout-title">
            <h3>{data.message.headline} </h3>
          </div>
        );
      case "Title and Rich Text":
        return (
          <>
            <div className="layout-title">
              <h3>{data.message.headline} </h3>
            </div>
            <div className="container">
              {" "}
              <div className="row">
                <br />
                <Richtext content={data.message.overview.json} />
              </div>
            </div>
          </>
        );
      case "Image":
        return (
          <ImageRender
            url={data.message.cimage[0].url}
            height={data.message.cimage[0].height}
            width={data.message.cimage[0].width}
          />
        );
      default:
        return null;
    }
  }

  function ImageRender(props) {
    return (
      <Image
        src={props.url}
        width={props.width}
        height={props.height}
        alt="Picture of the author"
      />
    );
  }

  return (
    <section className="playlist container page-block amazon-playlist">
      <div className="container">
        <div className="row">
          <div className="col-lg-12  ">
            <MessageType />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Message;
