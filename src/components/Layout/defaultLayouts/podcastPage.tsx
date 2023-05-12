import Playlist from "@/src/components/Layout/components/playlist";
import Staff from "@/src/components/Layout/components/staff";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import Link from "next/link";

function Podcastpage(props: any) {
  
    let year = props.props.type.date.substring(0, 4);
    let month = props.props.type.date.substring(5, 7);
    let day = props.props.type.date.substring(8, 10);

  return (
    <>
       
      <div className="container">
        <div className="row show-intro">
          <div className="col-12 col-lg-6  ">
           
              <h4>{props.props.type.title}</h4>
             {props.props.type.intro}
             <hr />
             <div> <strong>Show: <Link  href={props.props.type.show.fields.path +props.props.type.show.fields.slug } >{props.props.type.show.fields.title}
            
          
             
             </Link></strong>
             </div>
             <hr />
             <div> <strong>Date: {day +" / "+month  +" / " +year }</strong>  
             </div>
               
              <hr />
                    
          </div>
          <div className="col-12 col-lg-6  podcast-audio">
       
          <audio controls src={props.props.type.url} >
              Your browser does not support the
              <code>audio</code> element.
            </audio>
      


           
                 
       </div>



        </div>
      </div>
    </>
  );
}

export default Podcastpage;
