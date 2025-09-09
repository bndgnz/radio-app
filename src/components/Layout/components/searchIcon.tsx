import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Search from './search/search';

interface SearchIconProps {
  props?: any;
  item?: any;
  id?: any;
}

const SearchIcon: React.FC<SearchIconProps> = ({ props, item, id }) => {
  console.log('SearchIcon component rendering with:', { props, item, id });
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  
  // Extract placeholder from component data
  const placeholder = props?.placeholder || item?.placeholder || "Search shows, podcasts, articles...";

  // Handle escape key and body overflow for search overlay
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchOverlay(false);
      }
    };

    if (showSearchOverlay) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showSearchOverlay]);


  return (
    <>
      <button
        className="search-icon"
        onClick={() => setShowSearchOverlay(true)}
        aria-label="Open search"
        title="Search"
      >
        <FaSearch />
      </button>

      {/* Search Overlay - Rendered via Portal to document.body */}
      {showSearchOverlay && typeof document !== 'undefined' && createPortal(
        <div 
          className="search-overlay"
          onClick={() => setShowSearchOverlay(false)}
        >
          <div 
            className="search-overlay__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="search-overlay__close-btn"
              onClick={() => setShowSearchOverlay(false)}
              aria-label="Close search"
            >
              <FaTimes />
            </button>
            <div>
              <Search autoFocus={true} placeholder={placeholder} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default SearchIcon;