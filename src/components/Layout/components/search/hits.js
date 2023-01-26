import { connectStateResults } from "react-instantsearch-dom";

function Hits({ searchState, searchResults }) {
  const validQuery = searchState.query?.length >= 3;

  function Resolver(hit) {

    let title;
    let url;


console.log(hit.hit )

switch(hit.hit.sys.contentType.sys.id) {
    case "shows":
        url = "/shows/" + hit.hit.fields.slug[["en-US"]];
    
      break;
      case "staff":
        url = "/djs#"  + hit.hit.fields.title[["en-US"]].replace(/ /g, "-");
    
      break;

      case "partner":
        url = "/sponsors#" + hit.hit.fields.title[["en-US"]].replace(/ /g, "-");
    
      break;

      case "playlist":
        url = "/playlist?playlist=" + hit.hit.sys.id ;
    
      break;
    default:
      // code block
  }






return (   <a href={url} title={title}>{hit.hit.fields.title[["en-US"]]} </a>)




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
          <div className="search-results-list">
            {searchResults.hits.map((hit, index) => (
              <div
                tabIndex={index}
                key={hit.objectID}
                className="search-results-result"
              >

 


             
           
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
