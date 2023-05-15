import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import {IAmazonPodcastFields } from "@/src/@types/contentful";
import ContentService from "@/src/utils/content-service";
import Layout from "@/src/components/Layout";
import Seo from "@/src/components/Layout/components/seo"

interface Props {
  podcastPage: IAmazonPodcastFields;
}

const PodcastPage: NextPage<Props> = ({
  podcastPage: {
    podcastImage,
    title,
   description,  
   date,
   amazonUrl,
   show,
   slug 
 },
}) => (
  <><Seo title={title} description={description} />
    <Layout
      title={title}
   date={date}
      intro={description}
      image={podcastImage[0].url}
      showBanner="1"
      type="amazonPodcast"
      url={amazonUrl}
      show={show}
 
    >

 




    </Layout>
  </>
);

export default PodcastPage;

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (
  ctx
) => {
  const { slug } = ctx.params!;
  const podcastPage = await ContentService.instance.getPodcastBySlug(slug);
  if (!podcastPage) {
    return { notFound: true };
  }
  return {
    props: {
      podcastPage: podcastPage.fields,
    },
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const showPages =
    await ContentService.instance.getEntriesByType<IAmazonPodcastFields>("amazonPodcast");
  return {
    paths: showPages.map((showPage) => ({
      params: {
        slug: showPage.fields.slug,
      },
    })),
    fallback: false,
  };
};
