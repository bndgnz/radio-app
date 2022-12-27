import Footer from "./footer";
import Header from "./header";
import { useQuery, gql } from "@apollo/client";
import SecondaryHero from "@/src/components/Layout/components/secondary";
import Components from "@/src/components/Layout/components/index";
import DefaultLayouts from "@/src/components/Layout/defaultLayouts";

const MENU = gql`
  query {
    menuCollection(where: { title: "Top Menu" }, limit: 1) {
      items {
        title
        logo {
          url
        }
        linksCollection(limit: 8) {
          items {
            linkText
            internalLink {
              ...LanMenulink
              ...ShowMenulink
              ...ShowMenulink
              ...PodcastMenulink
            }
            sublinksCollection {
              items {
                linkText
                internalLink {
                  ...LanMenulink
                  ...ShowMenulink
                  ...PodcastMenulink
                }
              }
            }
          }
        }
        featuredButton {
          headline
          linkUrl
          overview {
            json
          }
        }
      }
    }
    footerCollection {
      items {
        title
        logo {
          url
        }
        socialLinksCollection(limit: 6) {
          items {
            title
            fontAwesomeClasses
            link
          }
        }
        quickLInksCollection(limit: 15) {
          items {
            linkText
            internalLink {
              ...LanMenulink
            }
          }
        }
        copyright
        rightColumn {
          headline
          overview {
            json
          }
          image {
            url
          }
          backgroundColor {
            colorName
          }
          iconClass
        }
      }
    }
  }
  fragment LanMenulink on LandingPage {
    title
    slug
    image {
      url
    }
    path
    showBanner
  }

  fragment ShowMenulink on Shows {
    title
    slug
    path
    image {
      url
    }
  }

  fragment PodcastMenulink on Podcast {
    title
    slug
    path
    image {
      url
    }
  }
`;

function Layout(props: any) {
  const { data, loading, error } = useQuery(MENU);
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  return (
    <>
      <Header data={data} />
      <SecondaryHero
        title={props.title}
        background={props.image}
        tereo={props.teReoTitle}
        showBanner={props.showBanner}
        showIntro={props.introduction}
      />

      <DefaultLayouts type={props} />

      <Components
        components={props.components}
        introduction={props.introduction}
        content={props.content}
        title={props.title}
        allProps={props}
      />

      <Footer data={data} />
    </>
  );
}

export default Layout;
