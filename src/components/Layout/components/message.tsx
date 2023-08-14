import React from "react";
import { useQuery, gql } from "@apollo/client";
import Richtext from "@/src/utils/helpers/richTextHelper";

function Message(props: any) {
  const id = props.id;
  const MESSAGE = gql`
    query GetMEssage($id: String!) {
      message(id: $id) {
        headline
        linkText
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
  console.log(data);

  return (
    <section className="playlist container page-block amazon-playlist">
      <div className="container">
        <div className="row">
          <div className="col-lg-12  ">
            <Richtext content={data.message.overview.json} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Message;
