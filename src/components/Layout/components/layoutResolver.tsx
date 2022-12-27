import { useQuery, gql } from "@apollo/client";
import SecondaryHero from "@/src/components/Layout/components/secondary";
import Components from "@/src/components/Layout/components/index";

const LAYOUT = gql`
  query GetLayout($id: String!) {
    layout(id: $id) {
      title
      columnsCollection {
        items {
          title
          bootstrapWidth
          layoutComponentCollection {
            items {
              sys {
                id
              }
              __typename
            }
          }
        }
      }
    }
  }
`;

function ResolveLayout(props: any) {
  const id = props.id.item;
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
              className={"col-lg-" + column.bootstrapWidth + " col-sm-12 layout-column"}
              key={idx}
            >
              {data &&
                column.layoutComponentCollection.items.map((item, i) => (
                  <div key={i}>
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
      <div className="container layout-container ">
        <div className="row">
          <Columns />
        </div>
      </div>
    </>
  );
}

export default ResolveLayout;
