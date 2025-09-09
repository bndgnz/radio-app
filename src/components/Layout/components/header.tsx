import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  props?: any;
  item?: any;
  id?: any;
}

const Header: React.FC<HeaderProps> = ({ props, item, id }) => {
  // Get header data from props, item, or id (the headerConfiguration reference)
  const headerData = props || item || id;
  
  
  if (!headerData) {
    return null;
  }

  // Extract the actual data - it could be nested in various ways depending on how Sanity resolves it
  let actualData = headerData;
  
  // Check for resolved header data from the content-service query
  if (headerData.resolvedHeader) {
    actualData = headerData.resolvedHeader;
  } else if (headerData.itemRef) {
    // If there's an itemRef, the actual data might be nested there
    actualData = headerData.itemRef;
  } else if (headerData._ref && !headerData.title) {
    // This is an unresolved reference
    return null;
  }

  // Extract fields from the actual data
  const title = actualData.title;
  const frequency = actualData.frequency;
  const teReo = actualData.teReo;
  const logo = actualData.logo;
  const link = actualData.link;


  // If we don't have any data to display, don't render
  if (!title && !frequency && !teReo && !logo) {
    return null;
  }

  // Get logo URL from Sanity image asset
  let logoUrl = '';
  
  // Check if logo has already resolved URL
  if (logo?.asset?.url) {
    logoUrl = logo.asset.url;
  } else if (logo?.asset?._ref) {
    // Convert Sanity image reference to URL
    const ref = logo.asset._ref;
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    
    // Parse the reference to get the image ID
    // Format: image-[id]-[dimensions].[format] or image-[id]-[dimensions]-[format]
    const match = ref.match(/^image-([a-z0-9]+)-(\d+x\d+)[.-](\w+)$/);
    if (match && projectId) {
      const [, imageId, dimensions, format] = match;
      logoUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}-${dimensions}.${format}`;
    }
  } else if (typeof logo === 'string') {
    // Direct URL string
    logoUrl = logo;
  }

  // Get link URL
  let linkUrl = '/';
  if (link?.slug?.current) {
    if (link._type === 'show' || link._type === 'shows') {
      linkUrl = `/shows/${link.slug.current}`;
    } else if (link._type === 'podcast') {
      linkUrl = `/podcast/${link.slug.current}`;
    } else {
      linkUrl = `/${link.slug.current}`;
    }
  }

  return (
    <div className="logo-section">
      {logoUrl && (
        <div className="logo">
          {link ? (
            <Link href={linkUrl}>
              <img src={logoUrl} alt={title || 'Logo'} />
            </Link>
          ) : (
            <img src={logoUrl} alt={title || 'Logo'} />
          )}
        </div>
      )}
      <div className="site-info">
        {title && <h1>{title}</h1>}
        {frequency && <div className="frequencies">{frequency}</div>}
        {teReo && <div className="maori">{teReo}</div>}
      </div>
    </div>
  );
};

export default Header;