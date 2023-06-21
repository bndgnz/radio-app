import { connectStateResults } from "react-instantsearch-dom";

function Hits({ searchState, searchResults }) {
  const validQuery = searchState.query?.length >= 3;


  function Date (date ) {

if (date.date != null) {

    let year = date.date.substring(0, 4);
    let month = date.date.substring(5, 7);
    let day = date.date.substring(8, 10);
     return (
<strong><strong>{day +"-"+month  +"-" +year }</strong> </strong> 

    )
     }

}




  function Resolver(hit) {
    let title="";
    let url;
    var desc = "";
    let show;
    let date;
  
    let type;
    console.log(hit)

    switch (hit.hit.sys.contentType.sys.id) {
      case "shows":
        url = "/shows/" + hit.hit.fields.slug[["en-US"]];
   type="Show"
   title = hit.hit.fields.title[["en-US"]];
        break;
      case "staff":
        url =
          "/djs#" +
          hit.hit.fields.title[["en-US"]].replace(/ /g, "-").toLowerCase();
        desc = hit.hit.fields.shortBio[["en-US"]];
title = hit.hit.fields.title[["en-US"]];
        type = "DJ";
        break;

      case "sponsor":
        url =
          "/sponsors#" +
          hit.hit.fields.title[["en-US"]].replace(/ /g, "-").toLowerCase();
        desc = hit.hit.fields.introduction[["en-US"]];
        type = "Sponsor";
        title = hit.hit.fields.title[["en-US"]];
        break;

      case "landingPage":
        url = hit.hit.fields.slug[["en-US"]];
        desc = hit.hit.fields.introduction[["en-US"]];
        type = "Content";
        title = hit.hit.fields.title[["en-US"]];
        break;

      case "amazonPodcast":
        url = "/podcast/" + hit.hit.fields.slug[["en-US"]];
        desc = hit.hit.fields.description[["en-US"]];
        show ="show"
        date = hit.hit.fields.date[["en-US"]];
        type = "Podcast";
        title = hit.hit.fields.title[["en-US"]];
        break;
      default:
      // code block

      case "playlist":
        url = "/playlist?playlist=" + hit.hit.sys.id;
        type = "Playlist";
       
   title=  hit.hit.fields.title[["en-US"]];

 
 

        break;

      // code block
    }

    return (
      <div className="row">
        <div className="col-12 col-md-10">
          <a href={url} title={title} target="_blank"  rel="noreferrer">
            {title}{" "}
          </a>
          <div className="search-results-description">{desc}</div>
        </div>

        <div className="col-12 col-md-2 search-results-type"> {type} <br /><Date date={date} /></div>
       
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
          <div className="container page-block search-results-list" id="hits">
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
