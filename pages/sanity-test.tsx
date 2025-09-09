import type { NextPage } from 'next';
import { sanityClient } from '../src/lib/sanity.client';
import groq from 'groq';

interface Props {
  data: any;
}

const SanityTest: NextPage<Props> = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Sanity Connection Test</h1>
      <p>This page tests if the Sanity connection is working properly.</p>
      
      <h2>Test Results:</h2>
      {data.error ? (
        <div style={{ color: 'red' }}>
          <h3>Error:</h3>
          <pre>{JSON.stringify(data.error, null, 2)}</pre>
        </div>
      ) : (
        <div style={{ color: 'green' }}>
          <h3>Success! Found {data.count} documents</h3>
          <details>
            <summary>View document types</summary>
            <pre>{JSON.stringify(data.types, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    // Test query to get all document types
    const query = groq`*[]{_type} | order(_type) [0...100]`;
    const results = await sanityClient.fetch(query);
    
    // Count documents by type
    const typeCounts = results.reduce((acc: any, doc: any) => {
      acc[doc._type] = (acc[doc._type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      props: {
        data: {
          count: results.length,
          types: typeCounts,
        },
      },
    };
  } catch (error: any) {
    return {
      props: {
        data: {
          error: error.message || 'Failed to connect to Sanity',
        },
      },
    };
  }
}

export default SanityTest;