import React from 'react';
import { urlFor } from '../../lib/sanity.image';

export default function PortableTextHelper({ content }: { content: any[] }) {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  const renderChild = (child: any, block: any) => {
    // Handle marks (bold, italic, links, etc.)
    let element = <span key={child._key}>{child.text}</span>;
    
    if (child.marks && child.marks.length > 0) {
      // Process each mark
      child.marks.forEach((mark: string) => {
        if (mark === 'strong') {
          element = <strong key={child._key}>{child.text}</strong>;
        } else if (mark === 'em') {
          element = <em key={child._key}>{child.text}</em>;
        } else if (mark === 'underline') {
          element = <u key={child._key}>{child.text}</u>;
        } else if (mark === 'code') {
          element = <code key={child._key}>{child.text}</code>;
        } else {
          // Check if it's a link mark (referenced by key in markDefs)
          const markDef = block.markDefs?.find((def: any) => def._key === mark);
          if (markDef && markDef._type === 'link') {
            element = (
              <a 
                key={child._key} 
                href={markDef.href} 
                target={markDef.blank ? "_blank" : "_self"} 
                rel={markDef.blank ? "noopener noreferrer" : undefined}
              >
                {child.text}
              </a>
            );
          }
        }
      });
    }
    
    return element;
  };

  const renderImage = (block: any) => {
    // Handle Cloudinary images
    if (block._type === 'cloudinary.asset') {
      const cloudinaryUrl = block.secure_url || block.url;
      if (cloudinaryUrl) {
        return (
          <img 
            key={block._key}
            src={cloudinaryUrl}
            alt={block.context?.alt || block.public_id || 'Embedded image'}
            style={{ maxWidth: '100%', height: 'auto' }}
            loading="lazy"
          />
        );
      }
    }

    // Handle legacy Sanity images
    if (block._type === 'image' && block.asset) {
      try {
        const imageUrl = urlFor(block.asset).url();
        return (
          <img 
            key={block._key}
            src={imageUrl}
            alt={block.alt || 'Embedded image'}
            style={{ maxWidth: '100%', height: 'auto' }}
            loading="lazy"
          />
        );
      } catch (error) {
        console.error('Error generating image URL:', error);
        return <div key={block._key} style={{ color: 'red' }}>Error loading image</div>;
      }
    }

    return <div key={block._key} style={{ color: 'orange' }}>Unsupported image format</div>;
  };

  return (
    <div>
      {content.map((block) => {
        // Handle text blocks
        if (block._type === 'block') {
          const style = block.style || 'normal';
          const children = block.children?.map((child: any) => renderChild(child, block));
          
          switch (style) {
            case 'h1':
              return <h1 key={block._key}>{children}</h1>;
            case 'h2':
              return <h2 key={block._key}>{children}</h2>;
            case 'h3':
              return <h3 key={block._key}>{children}</h3>;
            case 'h4':
              return <h4 key={block._key}>{children}</h4>;
            case 'h5':
              return <h5 key={block._key}>{children}</h5>;
            case 'h6':
              return <h6 key={block._key}>{children}</h6>;
            case 'blockquote':
              return <blockquote key={block._key}>{children}</blockquote>;
            default:
              return <p key={block._key}>{children}</p>;
          }
        }

        // Handle embedded images
        if (block._type === 'image' || block._type === 'cloudinary.asset') {
          return renderImage(block);
        }

        // Handle unknown block types
        console.warn('Unknown block type:', block._type, block);
        return null;
      })}
    </div>
  );
}