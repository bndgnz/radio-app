import type { NextPage } from 'next';
import { sanityClient } from '../src/lib/sanity.client';
import groq from 'groq';
import ContentService from '../src/utils/content-service';

interface Props {
  data: any;
}

const DebugData: NextPage<Props> = ({ data }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Debug: Sanity Data Structure</h1>
      
      <h2>Landing Pages ({data.landingPages?.length || 0})</h2>
      <details>
        <summary>Click to expand landing pages data</summary>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(data.landingPages, null, 2)}
        </pre>
      </details>

      <h2>Shows ({data.shows?.length || 0})</h2>
      <details>
        <summary>Click to expand shows data</summary>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(data.shows?.slice(0, 2), null, 2)}
        </pre>
      </details>

      <h2>Home Page Data</h2>
      <details>
        <summary>Click to expand home page data</summary>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(data.homePage, null, 2)}
        </pre>
      </details>

      <h2>Config Data</h2>
      <details>
        <summary>Click to expand config data</summary>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(data.config, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    // Get landing pages
    const landingPagesQuery = groq`*[_type == "landingPage"][0...10]{
      _id,
      _type,
      title,
      slug,
      path,
      introduction,
      cloudinaryImage
    }`;
    const landingPages = await sanityClient.fetch(landingPagesQuery);

    // Get shows
    const showsQuery = groq`*[_type == "shows"][0...5]{
      _id,
      _type,
      title,
      slug,
      path,
      archived
    }`;
    const shows = await sanityClient.fetch(showsQuery);

    // Try to get home page specifically
    const homePageQuery = groq`*[_type == "landingPage" && (slug.current == "home" || path == "/home")][0]`;
    const homePage = await sanityClient.fetch(homePageQuery);

    // Get config
    const configQuery = groq`*[_type == "config"][0]`;
    const config = await sanityClient.fetch(configQuery);

    return {
      props: {
        data: {
          landingPages,
          shows,
          homePage,
          config,
        },
      },
    };
  } catch (error: any) {
    console.error('Debug page error:', error);
    return {
      props: {
        data: {
          error: error.message || 'Failed to fetch data',
        },
      },
    };
  }
}

export default DebugData;