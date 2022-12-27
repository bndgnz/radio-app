import React from "react";
import "@/styles/bootstrap.min.css";
import "../public/fontawesome.min.css";
import "@/styles/animate.min.css";
import "@/styles/flaticon.css";
import "@/styles/globals.css";
import "@/styles/responsive.scss";
import "@/styles/atom-one-dark.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
 
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import Head from "next/head";

function MyApp({ Component, pageProps, data }) {
 

  const client = new ApolloClient({
    uri: 'https://graphql.contentful.com/content/v1/spaces/muwn01agnrp5/?access_token=69d7oeasRdTU7_W9K2x9IS8bO2r53ln1vzZyFMTKLAA',
    cache: new InMemoryCache()
  });
  return (
    <><ApolloProvider client={client}>
      <Head>
        <title key="title">
          {"Waiheke Radio| Your Community Radio"}
        </title>
        <meta
          key="og:description"
          property="og:description"
          content="Waiheke Radio is a community broadcast organisation run by volunteer DJs "
        />
        <meta name="facebook-domain-verification" content="al5atttw71uz7xzkfjt7abch2xku7f" />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:locale" property="og:locale" content="en_IE" />
        
        <link rel="icon" type="image/png" href={"https://waihekeradio.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2018/01/31013454/cropped-waiheke_radio_logo-small-32x32.png"}></link>
      </Head>


        <Component {...pageProps} />


      {/* Preloader */}
 

      {/* Go Top Button */}
    
       </ApolloProvider>
    </>
  );
}
 
export default MyApp;
