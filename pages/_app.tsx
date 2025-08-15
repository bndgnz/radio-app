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

const dataEnvironment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

function MyApp({ Component, pageProps, data }) {
  const client = new ApolloClient({
    uri: `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${dataEnvironment}?access_token=${accessToken}`,
    cache: new InMemoryCache(),
  });
  return (
    <>
        <Script id="google-tag-manager" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TN7WZMGM');
      `}
    </Script>
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
