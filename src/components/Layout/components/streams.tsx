import React from "react";
import { useQuery, gql } from "@apollo/client";
import ReactAudioPlayer from 'react-audio-player';

const STREAMS = gql`
query GetStream($id: String!) {
   stream (id: $id) {
    
          title
          url
          playingNow  
        }
      }
 
 

`;
function Stream (props  : any) {
    const id=props.id
    const { data, loading, error } = useQuery(STREAMS, { variables: { id } });
    if (loading) { return <div></div>; }
    if (error) { return <div></div>; }


 
 
return (

<div className="col stream-item"  ><div className="stream-title">
    <span className="stream-label">Listen to:</span> {data.stream.title}</div>
 
    
    <audio
      controls
      src={data.stream.url}>
      Your browser does not support the
      <code>audio</code> element.
      </audio>
  
     
      
      </div>






)

 
   
 
}

export default Stream;
