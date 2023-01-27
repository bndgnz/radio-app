import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { useRouter } from 'next/router'
import Playlist from "@/src/components/Layout/components/playlist";



function QueryString() {
 
const router = useRouter()
const id = router.query.playlist
  
return (<Playlist id={id} qheight="600" />)


}

export default QueryString;
