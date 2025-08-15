import { connectStateResults } from "react-instantsearch-dom";
import { useState } from "react";
import DjModal from "../DjModal";

function Hits({ searchState, searchResults }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDjId, setSelectedDjId] = useState(null);
  const validQuery = searchState.query?.length >= 3;

  const openDjModal = (djId) => {
    setSelectedDjId(djId);
    setModalOpen(true);
  };

  const closeDjModal = () => {
    setModalOpen(false);
    setSelectedDjId(null);
  };



  function Date(date) {
    if (date.date != null) {
      let year = date.date.substring(0, 4);
      let month = date.date.substring(5, 7);
      let day = date.date.substring(8, 10);
      return (
        <strong>
          <strong>{day + "-" + month + "-" + year}</strong>{" "}
        </strong>
      );
    }
  }

  function Resolver(props) {
    const hit = props.hit;
    const openDjModal = props.openDjModal;
    let title = "";
    let url;
    var desc = "";
    let show;
    let date;

    let type;

    switch (hit.sys.contentType.sys.id) {
      case "shows":
        url = "/shows/" + hit.fields.slug[["en-US"]];
        type = "Show";
        title = hit.fields.title[["en-US"]];
        break;
      case "staff":
        url = "/djs/?dj=" + hit.objectID;
        desc = hit.fields.shortBio[["en-US"]];
        title = hit.fields.title[["en-US"]];
        type = "DJ";
        break;

      case "sponsor":
        url =
          "/sponsors#" +
          hit.fields.title[["en-US"]].replace(/ /g, "-").toLowerCase();
        desc = hit.fields.introduction[["en-US"]];
        type = "Sponsor";
        title = hit.fields.title[["en-US"]];
        break;

      case "landingPage":
        url = hit.fields.slug[["en-US"]];
        desc = hit.fields.introduction[["en-US"]];
        type = "Content";
        title = hit.fields.title[["en-US"]];
        break;

      case "amazonPodcast":
        url = "/podcast/" + hit.fields.slug[["en-US"]];
        desc = hit.fields.description[["en-US"]];
        show = "show";
        date = hit.fields.date[["en-US"]];
        type = "Podcast";
        title = hit.fields.title[["en-US"]];
        break;
      default:
      // code block

      case "playlist":
        url = "/playlist?playlist=" + hit.sys.id;
        type = "Playlist";

        title = hit.fields.title[["en-US"]];

        break;

      // code block
    }

    return (
      <div className="row">
        <div className="col-12 col-md-10">
          {url ? (
            <a href={url} title={title} target="_blank" rel="noreferrer">
              {title}{" "}
            </a>
          ) : (
            <span className="search-result-title">{title}</span>
          )}
          <div className="search-results-description">{desc}</div>
        </div>

        <div className="col-12 col-md-2 search-results-type">
          {" "}
          {type === "DJ" ? (
            <span 
              onClick={() => openDjModal(hit.objectID)}
              style={{ 
                cursor: "pointer", 
                textDecoration: "underline",
                color: "#007bff"
              }}
            >
              {type}
            </span>
          ) : (
            type
          )} <br />
          <Date date={date} />
        </div>
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
                <Resolver hit={hit} openDjModal={openDjModal} />
              </div>
            ))}
          </div>
        </>
      )}
      
      <DjModal 
        isOpen={modalOpen}
        onClose={closeDjModal}
        djId={selectedDjId}
      />
    </>
  );
}

export default connectStateResults(Hits);
