import React from 'react';
import Layout from '@/src/components/Layout';
import Link from 'next/link';

export default function Custom404() {
  return (
    <Layout
      title="Page Not Found"
      components={[]}
      menuData={null}
    >
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for could not be found.</p>
        <Link href="/" style={{ color: '#ff6b6b', textDecoration: 'underline' }}>
          Return to Homepage
        </Link>
      </div>
    </Layout>
  );
}