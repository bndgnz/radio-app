import { connectStateResults } from "react-instantsearch-dom";

function Hits({ searchState, searchResults }) {
  const validQuery = searchState.query?.length >= 3;

  function Resolver(hit) {
    let title;
    let url;
let type;

 

    switch (hit.hit.sys.contentType.sys.id) {
      case "shows":
        url = "/shows/" + hit.hit.fields.slug[["en-US"]];
type ="Show";

        break;
      case "staff":
        url = "/djs#" + hit.hit.fields.title[["en-US"]].replace(/ /g, "-").toLowerCase();
  type="DJ"
        break;

      case "sponsor":
        url = "/sponsors#" + hit.hit.fields.title[["en-US"]].replace(/ /g, "-").toLowerCase();
type="Sponsor"
        break;

        case "landingPage":
            url = hit.hit.fields.slug[["en-US"]];
    type="Content"
            break;




      case "playlist":
        url = "/playlist?playlist=" + hit.hit.sys.id;
type = "Playlist"
        break;
      default:
      // code block
    }

    return (
 <div className="row">
      
      <div className="col-10 col-xs-12">
      <a href={url} title={title}>
        {hit.hit.fields.title[["en-US"]]}{" "}
            
      </a>
      </div>

      <div className="col-2 col-xs-12">{type} </div>


      </div>
    );
  }

  return (
    <>
      {searchResults?.hits.length === 0 && validQuery && (
        <div className="search-results-list">
          {" "}
          <p>No results found!</p>
        </div>
      )}

      {searchResults?.hits.length > 0 && validQuery && (
        <>
          <div className="search-results-list container">
       
            {searchResults.hits.map((hit, index) => (
              <div
                tabIndex={index}
                key={hit.objectID}
                className="search-results-result">
                <Resolver hit={hit} />
              </div> 




            ))}
           
          </div>
        </>
      )}
    </>
  );
}

export default connectStateResults(Hits);
