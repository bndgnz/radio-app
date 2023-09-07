import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ILandingPageFields } from "../src/@types/contentful";
import ContentService from "@/src/utils/content-service";
import Layout from "@/src/components/Layout";
import Seo from "@/src/components/Layout/components/seo"
 

interface Props {
  landingPage: ILandingPageFields;
}

const LandingPage: NextPage<Props> = ({
  landingPage: {
    title,
    introduction,
    showIntroduction,
    showContent,
    cloudinaryImage,
    content,
    teReoTitle,
    components,
    showBanner,
  },
}) => (
  <>
<Seo title={title} description={introduction} /> 


 
  <Layout
      title={title}
      image={cloudinaryImage[0].secure_url}
      teReoTitle={teReoTitle}
      components={components}
      introduction={introduction}
      content={content}
      showBanner={showBanner}
      showIntroduction={showIntroduction}
      showContent={showContent}
    >
 

</Layout>



  </>
);

export default LandingPage;

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (
  ctx
) => {
  const { slug } = ctx.params!;
 
  const landingPage = await ContentService.instance.getLandingPageBySlug(slug);
  if (!landingPage) {
    return { notFound: true };
  }
  return {
    props: {
      landingPage: landingPage.fields,
    },
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const landingPages =
    await ContentService.instance.getEntriesByType<ILandingPageFields>(
      "landingPage"
    );

  return {
    paths: landingPages.map((landingPage) => ({
      params: {
        slug: landingPage.fields.slug,
      },
    })),
    fallback: false,
  };
};
