import { useQuery, gql } from "@apollo/client";
import SecondaryHero from "@/src/components/Layout/components/secondary";
import Components from "@/src/components/Layout/components/index";

const LAYOUT = gql`
  query GetLayout($id: String!) {
    layout(id: $id) {
      showLayoutTitle
      title
      sys {
        id
      }
      columnsCollection {
        items {
          title
          bootstrapWidth
          offset
          layoutComponentCollection {
            items {
              ...playlistId
              ...streamId
              ...showsOnTodayId
              ...messageId
              ...scheduleId
              ...staffId
              ...showId
                 ...listId
          
              __typename
            }
          }
        }
      }
    }
  }
  fragment playlistId on Playlist {
    sys {
      id
    }
  }

  fragment streamId on Stream {
    sys {
      id
    }
  }

  fragment messageId on Message {
    sys {
      id
    }
  }
  fragment scheduleId on Schedule {
    sys {
      id
    }
  }

  fragment showsOnTodayId on ShowsOnToday {
    sys {
      id
    }
  }

  fragment showId on Shows {
    sys {
      id
    }
  }

  fragment staffId on Staff {
    sys {
      id
    }
  }

  
  fragment listId on List {
    sys {
      id
    }
  } 




`;

function ResolveLayout(props: any) {
  let id = props.id;
 
 

  const { data, loading, error } = useQuery(LAYOUT, { variables: { id } });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
 
 

  function Columns() {
    if (data.layout.columnsCollection.items) {
      const listOfItems = data.layout.columnsCollection.items.map(
        (column, idx) => {
          return (
            <div
              className={
                " col-lg-" +
                column.bootstrapWidth +
                " col-xs-12 " +
                "offset-" +
                column.offset
              }
              key={idx}
            >
              {data &&
                column.layoutComponentCollection.items.map((item, i) => (
                  <div key={i} className="layout-component-column   mx-auto ">
                    <Components
                      id={item.__typename.toLowerCase()}
                      item={item.sys.id}
                    />
                  </div>
                ))}
            </div>
          );
        }
      );
      return <>{listOfItems}</>;
    } else {
      return null;
    }
  }
  return (
    <>
      <div className="layout-wrapper">
        <div className="container layout-container ">
          {data.layout.showLayoutTitle == true ? (
            <div className="layout-title">
              <h3>{data.layout.title} </h3>
            </div>
          ) : null}

          <div className="row">
            <Columns />
          </div>
        </div>
      </div>
    </>
  );
}

export default ResolveLayout;
