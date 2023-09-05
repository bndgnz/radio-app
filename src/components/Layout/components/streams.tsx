import React, { useState, useEffect } from 'react';
import { useQuery, gql } from "@apollo/client";
import ReactAudioPlayer from "react-audio-player";
import PlayingNowReader from "@/src/components/Layout/components/playingNow";
import Collapsible from "@/src/utils/helpers/Collapsible";

const STREAMS = gql`
  query GetStream($id: String!) {
    stream(id: $id) {
      title
      url
      playingNow
    }
  }
`;

function Playing(props: any) {}

function Stream(props: any) {
  const id = props.id;
  const { data, loading, error } = useQuery(STREAMS, { variables: { id } });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  function PlayingNow(props: any) {
    if (props.source) {
      var url = props.source;

      return (
        <Collapsible summary="Playing Now" >
          <PlayingNowReader url={url} show={data.stream.title} />
        </Collapsible>
      );
    }
  }

  return (
    <div className="col stream-item">
      <div className="stream-title">
        <span className="stream-label">Listen to:</span> {data.stream.title}
      </div>

      <audio controls src={data.stream.url} id={data.stream.title.replaceAll(' ','-')+"-stream"}>
        Your browser does not support the
        <code>audio</code> element.d
      </audio>

      <PlayingNow source={data.stream.playingNow} />
    </div>
  );
}

export default Stream;
