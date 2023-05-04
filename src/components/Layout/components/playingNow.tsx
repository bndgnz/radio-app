import useSWR from "swr";

 
function Profile(props) {
  if (props.link) {
    const driveLink1 = props.link.replace(
      "https://drive.google.com/file/d/",
      "https://www.googleapis.com/drive/v3/files/"
    );
    const driveLink2 = driveLink1.replace(
      "/view?usp=share_link",
      "?alt=media&key=AIzaSyAOiHW72zzRZmVNDcGXivXXfJYM75jVOfw"
    );
console.log(driveLink2)
    const fetcher = (url:any) => fetch(url).then((r) => r.text());

    const { data} = useSWR(driveLink2, fetcher);
      
 

 

    return <p>aaaaaaaaaaaaa{data }
    
    
 
    
    
    
    </p>;
  }
}
export default Profile;
