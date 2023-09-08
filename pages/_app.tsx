import React from "react";
import "@/styles/bootstrap.min.css";
import "../public/fontawesome.min.css";
import "@/styles/animate.min.css";
import "@/styles/flaticon.css";
import "@/styles/globals.css";
import "@/styles/responsive.scss";
import "@/styles/atom-one-dark.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Script from "next/script";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

import { config } from "dotenv";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const dataEnvironment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT;

function MyApp({ Component, pageProps, data }) {
  const client = new ApolloClient({
    uri:
      "https://graphql.contentful.com/content/v1/spaces/muwn01agnrp5/environments/" +
      dataEnvironment +
      "?access_token=69d7oeasRdTU7_W9K2x9IS8bO2r53ln1vzZyFMTKLAA",
    cache: new InMemoryCache(),
  });
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-GTM-TN7WZMGM');`}}></script>

      <ApolloProvider client={client}>
        <ContentfulLivePreviewProvider
          locale="en-US"
          enableInspectorMode={true}
          enableLiveUpdates={true}
          debugMode
        >
          <Component {...pageProps} />
        </ContentfulLivePreviewProvider>
        {/* Preloader */}

        {/* Go Top Button */}
      </ApolloProvider>
    </>
  );
}

export default MyApp;
