import { connectStateResults } from "react-instantsearch-dom";

function Hits({ searchState, searchResults }) {
  const validQuery = searchState.query?.length >= 3;

  function Resolver(hit) {
    let title;
    let url;
    var desc = "";
    let show;
  
    let type;
    console.log(hit)

    switch (hit.hit.sys.contentType.sys.id) {
      case "shows":
        url = "/shows/" + hit.hit.fields.slug[["en-US"]];
 

        break;
      case "staff":
        url =
          "/djs#" +
          hit.hit.fields.title[["en-US"]].replace(/ /g, "-").toLowerCase();
        desc = hit.hit.fields.shortBio[["en-US"]];

        type = "DJ";
        break;

      case "sponsor":
        url =
          "/sponsors#" +
          hit.hit.fields.title[["en-US"]].replace(/ /g, "-").toLowerCase();
        desc = hit.hit.fields.introduction[["en-US"]];
        type = "Sponsor";
        break;

      case "landingPage":
        url = hit.hit.fields.slug[["en-US"]];
        desc = hit.hit.fields.introduction[["en-US"]];
        type = "Content";
        break;

      case "amazonPodcast":
        url = "/podcast/" + hit.hit.fields.slug[["en-US"]];
        desc = hit.hit.fields.description[["en-US"]];
        show ="show"
       

        type = "Podcast";
        break;
      default:
      // code block

      case "playlist":
        url = "/playlist?playlist=" + hit.hit.sys.id;
        type = "Playlist";

        break;

      // code block
    }

    return (
      <div className="row">
        <div className="col-12 col-md-10">
          <a href={url} title={title}>
            {hit.hit.fields.title[["en-US"]]}{" "}
          </a>
          <div className="search-results-description">{desc}</div>
        </div>

        <div className="col-12 col-md-2 search-results-type"> {type} </div>
       
      </div>
    );
  }

  return (
    <>
      {searchResults?.hits.length === 0 && validQuery && (
        <div className="search-results-list container page-block">
          {" "}
          <p>No results found!</p>
        </div>
      )}

      {searchResults?.hits.length > 0 && validQuery && (
        <>
          <div className="container page-block search-results-list">
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
