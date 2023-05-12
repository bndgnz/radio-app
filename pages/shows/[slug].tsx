import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { IShowsFields } from "@/src/@types/contentful";
import ContentService from "@/src/utils/content-service";
 
import Layout from "@/src/components/Layout";
 

interface Props {
  showPage: IShowsFields;
}

const ShowPage: NextPage<Props> = ({
  showPage: {
    title,
    image,
    components,
    showBanner,
    content,
    introduction,
    timeSlots,
    dj,
    playlistUrl,
    showUrl,
    sponsor,
  },
}) => (
  <>
    <Layout
      title={title}
      image={image.fields.file.url}
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
    ></Layout>
  </>
);

export default ShowPage;

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (
  ctx
) => {
  const { slug } = ctx.params!;
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
    fallback: false,
  };
};
