import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { IShowsFields } from "@/src/@types/contentful";
import ContentService from "@/src/utils/content-service";
import Seo from "@/src/components/Layout/components/seo"
import Layout from "@/src/components/Layout";
import generateRssFeed from '@/src/utils/generateRSSFeed';
import ChatOverlay from "@/src/components/Chat/ChatOverlay";
import { useShowChat } from "@/src/hooks/useShowChat";

interface Props {
  showPage: IShowsFields;
}

const ShowPage: NextPage<Props> = ({
  showPage: {
    title,
    cimage,
    components,
    showBanner,
    content,
    introduction,
    timeSlots,
    dj,
    playlistUrl,
    showUrl,
    sponsor,
    slug,
    rss,
    chat
  },
}) => {
  const { isChatVisible, toggleChat } = useShowChat(slug, chat);

  return (
    <>
      <Seo title={title} description={introduction} />
      <Layout
        title={title}
        image={cimage[0].secure_url} 
        components={components}
        introduction={introduction}
        content={content}
        showBanner={showBanner}
        type="shows"
        times={timeSlots}
        dj={dj}
        playlistUrl={playlistUrl}
        showUrl={showUrl}
        sponsor={sponsor}
        slug={slug}
        rss={rss}
      ></Layout>
      
      {chat && (
        <ChatOverlay
          showSlug={slug}
          isVisible={isChatVisible}
          onToggle={toggleChat}
        />
      )}
    </>
  );
};

export default ShowPage;

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (
  ctx
) => {
  const { slug } = ctx.params!;

  const rssArr = ['allPosts', slug, "", 'D'];
 
 
 
  await generateRssFeed(rssArr);

  
  const showPage = await ContentService.instance.getShowPageBySlug(slug);
  if (!showPage) {
    return { notFound: true };
  }
  return {
    props: {
      showPage: showPage.fields,
    },
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const showPages =
    await ContentService.instance.getEntriesByType<IShowsFields>("shows");
  return {
    paths: showPages.map((showPage) => ({
      params: {
        slug: showPage.fields.slug,
      },
    })),
    fallback: "blocking",
  };
};
