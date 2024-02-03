import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ILandingPageFields } from "../src/@types/contentful";
import styles from "../styles/Home.module.css";
import ContentService from "@/src/utils/content-service";
import generateAllRssFeed from '@/src/utils/generateAllRSSFeed';
import generateAllSpotifyFeed from '@/src/utils/generateAllSpotifyFeed';


import Layout from "@/src/components/Layout";

interface Props {
  articles: ILandingPageFields[];
}

const Home: NextPage<Props> = ({ articles }) => <Layout props={articles} />;

export default Home;

export const getStaticProps: GetStaticProps<Props> = async ({preview = false }) => {
 
  const rssArr = ['Waiheke Radio', 'rss', 'C', 'D'];
 
 
  await generateAllRssFeed(rssArr);
 

  const articles = (
    await ContentService.instance.getEntriesByType<ILandingPageFields>(
      "landingPage"
    )
  ).map((entry) => entry.fields);

  return {
    props: {
      articles,
    },
  };
};
