import React from "react";
import "@/styles/bootstrap.min.css";
import "../public/fontawesome.min.css";
import "@/styles/animate.min.css";
import "@/styles/flaticon.css";
import "@/styles/globals.css";
import "@/styles/responsive.scss";
import "@/styles/atom-one-dark.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Script from 'next/script'

import { config } from "dotenv";
 

 
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const dataEnvironment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT  ;

function MyApp({ Component, pageProps, data }) {
 
const client = new ApolloClient({
    uri: "https://graphql.contentful.com/content/v1/spaces/muwn01agnrp5/environments/"+dataEnvironment+"?access_token=69d7oeasRdTU7_W9K2x9IS8bO2r53ln1vzZyFMTKLAA",
    cache: new InMemoryCache()
  });
  return (
    <>
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZVG7HB5HFJ"></script>
  <Script id="google-analytics" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-ZVG7HB5HFJ');
    `}
  </Script>



   <ApolloProvider client={client}>
    


        <Component {...pageProps} />


      {/* Preloader */}
 

      {/* Go Top Button */}
    
       </ApolloProvider>
    </>
  );
}
 
export default MyApp;
