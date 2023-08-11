//useSWR allows the use of SWR inside function components
import useSWR from "swr";
import { NextRequest, NextResponse } from "next/server";
 
function Index(props: any) {
 
const src = props.url;
  const fetcher = (url) => fetch(url).then((res) => res.json());
  //Set up SWR to run the fetcher function when calling "/api/staticdata"
  //There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const { data, error } = useSWR(
    src,
    fetcher
  );

function GoogleIt (props:any) {
const href = "band+called+"+ props.name.replace(" ", "+"); 
return (<a href={"https://www.google.com/search?q=" + href} target="blank" title={"Find out about "+props.name}>{props.name}</a>)
}
  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  //Handle the ready state and display the result contained in the data object mapped to the structure of the json file

  const listOfItems = data.previous.map((played, idx) => {
    return (
      <div key={idx}>
        <strong><GoogleIt name={played.artist} /></strong> - <em>{played.track}</em>{" "}
      </div>
    );
  });

  const listOfItems2 = data.next.map((played, idx) => {
    return (
      <div key={idx}>
        <strong><GoogleIt name={played.artist} /></strong> - <em>{played.track}</em>{" "}
      </div>
    );
  });

  return (
    <div className="playing-now">
      <hr />
      <div className="playing-currently">
        <strong><GoogleIt name={data.current.artist} />  </strong> - <em>{data.current.track} </em>
      </div>
      <hr />
      <div className="played-previously">
        <div className="playing-now-title">Previously Played</div>
        {listOfItems}
      </div>
      <hr />
      <div className="coming-up">
        <div className="playing-now-title">Coming Up</div>
        {listOfItems2}
      </div>
    </div>
  );
}


export default Index;