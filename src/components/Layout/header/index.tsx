import React, { useEffect, useState } from "react";
import Link from 'next/link'
//import Link from "../../utils/ActiveLink";
import TopMenu from "./topmenu";
import Search from"@/src/components/Layout/components/search/search"


function Header({ data }) {
  //const [display, setDisplay] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [logo, setLogo] = useState("");

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
    </>
  );
}
export default React.memo(Header);
