import React from 'react';
import { NextPageContext } from 'next';
import Layout from '@/src/components/Layout';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <Layout
      title={`${statusCode ? statusCode : 'Client'} Error`}
      components={[]}
      menuData={null}
    >
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>
          {statusCode
            ? `A ${statusCode} error occurred on server`
            : 'An error occurred on client'}
        </h1>
        <p>
          {statusCode === 404
            ? 'This page could not be found.'
            : 'Something went wrong. Please try again later.'}
        </p>
      </div>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;