import React, { useEffect, useState } from "react";
import Link from "next/link";
import Search from"@/src/components/Layout/components/search/search"
import { FaSearch, FaTimes } from "react-icons/fa";

const TopMenu = ({ data, toggleNavbar }) => {
 


  const [topNav, setTopNav] = useState<any>([]);
  const [callus, setCallus] = useState<any>([]);
  const [phoneNumber, setPhoneNumber] = useState();
  const [linkUrl, setLinkUrl] = useState();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  useEffect(() => {
      setTopNav(data.menuCollection.items[0].linksCollection.items);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchOverlay(false);
      }
    };

    if (showSearchOverlay) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
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
      <ul className="navbar-nav">
        {/* Choosing the various top nav */}
        {topNav.map(function (item, index) {
          return (
            <li className="nav-item" key={index}>
              <NavLinkComponent item={item} toggleNavbar={toggleNavbar} />

              {/* Drop Down */}
              {/* condition in dropdown: filter any emty array that does not have an item for dropdown( you can find out by testing next line log) */}
              {item.sublinksCollection.items.length !== 0 ? (
                <ul className="dropdown-menu">
                  {/* condition : filter any item inside dropdown which is null that can distrupt our map loop */}
                  {item.sublinksCollection.items[0] !== null
                    ? item.sublinksCollection.items.map((subItem, index) => (
                        <li className="nav-item" key={index}>
                          <NavLinkComponent
                            item={subItem}
                            toggleNavbar={toggleNavbar}
                          />{" "}
                        </li>
                      ))
                    : null}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
      {/* Search Icon */}
      <div className="search-icon-wrapper">
        <button 
          className="search-icon-btn"
          onClick={() => setShowSearchOverlay(true)}
          aria-label="Open search"
        >
{(FaSearch as any)({ size: 25 })}
        </button>
      </div>
      
      {/* phone number  */}
      <div className="others-option">
        <div className="call-us">
      
         
        </div>




      </div>
    
      {/* Search Overlay */}
      {showSearchOverlay && (
        <div 
          className="search-overlay"
          onClick={() => setShowSearchOverlay(false)}
        >
          <div 
            className="search-overlay-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="search-close-btn"
              onClick={() => setShowSearchOverlay(false)}
              aria-label="Close search"
            >
{(FaTimes as any)({ size: 24 })}
            </button>
            <div className="search-container">
              <Search />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NavLinkComponent = ({ item, index, toggleNavbar }: any) => {
  return (
    <>
      {item ? (
        <Link legacyBehavior
          href={
            item.externalLink
              ? `${item.externalLink}`
              : item.slug
              ? `${item.slug}`
              : item.internalLink
              ? `${item.internalLink.path}${item.internalLink.slug}`
              : ""
          }
        >
         <a
            onClick={toggleNavbar}
            className="nav-link"
            title={item.internalLink.title}
            key={index}
          >
            
         
            {item.linkText ? item.linkText : item.internalLink.title}{" "}
            {item.sublinksCollection && item.sublinksCollection.items.length ? (              
              <i className="fas fa-chevron-down"></i>
            ) : null}
       </a>
        </Link>
      ) : (
        ""
      )}
    </>
  );
};

export default React.memo(TopMenu);
