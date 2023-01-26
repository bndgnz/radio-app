import React from "react";
import { useQuery, gql } from "@apollo/client";
import { preProcessFile } from "typescript";
import { addListener } from "process";
import DefaultLayouts from "@/src/components/Layout/defaultLayouts";
import PlaylistTypeSorter from "@/src/utils/helpers/playlistTypeSorter";

function PlaylistGrid(props: any) {
  const id = props.id;
  const PLAYLISTGRID = gql`
    query GetPLaylistGrid($id: String!) {
      playlistGrid(id: $id) {
        title
        rowHeight
        columnBootstrapWidth
        showVisualPlayer

        playlistItemsCollection {
          items {
            title
            url
            showTitle
            height
            hideVisualPlayer
            archivedShow
          }
        }
        title
      }
    }
  `;

  const { data, loading, error } = useQuery(PLAYLISTGRID, {
    variables: { id },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

const colWidth= "col-lg-" + data.playlistGrid.columnBootstrapWidth + " col-xs-12";


 


 

  const listOfItems = data.playlistGrid.playlistItemsCollection.items.map(
    (playlist, idx) => {
      return (
        <div className={colWidth} key={idx}>
 

          <div className=" sponsor-card playlist-collection">
            <div className="card-body">
              <h5 className="card-title" id={"playlist-collection-"+playlist.title.replace(/ /g, "-")}>{playlist.title}</h5>
               <PlaylistTypeSorter
                url={playlist.url}
                height={data.playlistGrid.rowHeight}
                visualPlayer={data.playlistGrid.showVisualPlayer}
                archived={playlist.archivedShow}
                title={data.playlistGrid.title}
                showTitle={data.playlistGrid.title}
                bootstrapColumn={playlist.columnBootstrapWidth}
              />
            </div>
          </div>
        </div>
      );
    }
  );
  return (
    <section className="about-area ptb-100">
      <div className="container">
        <div className="card-deck  ">{listOfItems}</div>
      </div>
    </section>
  );
}

export default PlaylistGrid;
