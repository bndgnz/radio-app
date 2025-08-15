import React, { useEffect, useState } from "react";
import Link from 'next/link'
//import Link from "../../utils/ActiveLink";
import TopMenu from "./topmenu";
import Search from"@/src/components/Layout/components/search/search"
import { FaSearch, FaTimes } from "react-icons/fa";


function Header({ data }) {
  //const [display, setDisplay] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [logo, setLogo] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  useEffect(() => {
    const elementId= document.getElementById("navbar");
    document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        elementId.classList.add("is-sticky"),{passive: true};
      } else {
        elementId.classList.remove("is-sticky"),{passive: true};
      }
    });
    window.scrollTo(0, 0);

   
  }, []);
  const toggleNavbar = () => {
    setCollapsed((collapsed) => !collapsed);
  };

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
      <div id="navbar" className="navbar-area">
        <div className="tuam-nav">
          <div className="container">
            <nav className="navbar navbar-expand-md navbar-light">
            <Link legacyBehavior href="/home">
                <a className="navbar-brand" title={data.menuCollection.items[0].logo.url} key="logo">
                  <img
                    className="navbar-logo-image"
                    src={`${data.menuCollection.items[0].logo.url}`}
                    alt="Waiheke Radio logo"
                    width="100" height="82" title="Waiheke Radio"
                  />
                </a>
              </Link>

              {/* Mobile Search Icon - only visible on mobile */}
              <div className="mobile-search-icon d-md-none">
                <button 
                  className="search-icon-btn"
                  onClick={() => setShowSearchOverlay(true)}
                  aria-label="Open search"
                >
                  {(FaSearch as any)({ size: 25 })}
                </button>
              </div>

              <button
                onClick={toggleNavbar}
                className={
                  collapsed
                    ? "navbar-toggler navbar-toggler-right collapsed"
                    : "navbar-toggler navbar-toggler-right"
                }
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                {collapsed
                    ?
                <span className="navbar-toggler-icon"></span>:
                <span className="navbar-toggler-icon-x  fas fa-times"></span>}

              </button>
              <div
                className={
                  collapsed
                    ? "collapse navbar-collapse"
                    : "collapse navbar-collapse show"
                }
                id="navbarSupportedContent"
                style={{ paddingTop: ".25rem" }}
              >
                <TopMenu data={data} toggleNavbar={toggleNavbar} />
             
               </div>
            
            
            
            
            
            </nav>
          </div>
        </div>
      </div>
      
      {/* Search Overlay - shared between mobile and desktop */}
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
}
export default React.memo(Header);
