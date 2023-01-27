import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { useRouter } from 'next/router'
import Playlist from "@/src/components/Layout/components/playlist";

function queryString() {
    const router = useRouter()
    console.log(router.query.playlist);
  
return (<Playlist id={router.query.playlist} qheight="600" />)


}

export default queryString;
