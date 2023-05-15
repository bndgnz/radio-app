/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

function Footer({ data }: any) {
  const [footerData, setFooterData] = useState([]);
  const [logo, setLogo] = useState("");
  const [social, setSocial] = useState([]);
  const [quick, setQuick] = useState([]);
  const [rightColumMessage, setRightColumMessage] = useState<any>([]);
  const [copyright, setCopyright] = useState("");
  const [websiteLink, setWebLinkState] = useState("");
   
  useEffect(() => {
    setFooterData(data);

    setSocial(data.footerCollection.items[0].socialLinksCollection);

    setQuick(data.footerCollection.items[0].quickLInksCollection);
    setRightColumMessage(
      data.footerCollection.items[0].rightColumn.overview.json
    );
    setCopyright(data.footerCollection.items[0].copyright);
    setWebLinkState("d-none");
    
  }, []);

  return (
    <>
      <footer className="footer-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <div className="logo">
                  <Link href="/" legacyBehavior>
                    <a title="logo-footer" key="logo-footer">
                      <img
                        src={data.footerCollection.items[0].logo.url}
                        key="logo-footer-image"
                        alt="logo"
                        width="160"
                        height="108"
                      />
                    </a>
                  </Link>
                </div>
                <SocialLinks social={social} />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h3>Quick Links</h3>
                <QuickLinks quick={quick} />
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <p
                  dangerouslySetInnerHTML={{
                    __html: documentToHtmlString(rightColumMessage),
                  }}
                  style={
                    {
                      //backgroundImage: `url(${backgImg.backgroundImage})`,
                      //backgroundRepeat: 'no-repeat'
                    }
                  }
                ></p>
              </div>
            </div>
          </div>

          <div className="copyright-area">
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-6 col-md-6">
                <p>
                  <i className="far fa-copyright"></i> {copyright}{" "}
                </p>
              </div>

              <div className="col-lg-6 col-sm-6 col-md-6">
                <ul>
                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions">Terms and conditions</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function QuickLinks({ quick }) {
  if (!quick.items || quick.items.length === 0) {
    return <span />;
  } else {
    return (
      <ul className="footer-quick-links">
        {quick.items.map(function (item, index) {
          return (
            <li key={item.linkText}>
              {/* check for external links and also having a slug in internal link or not */}
              <Link
                legacyBehavior
                href={
                  item.externalLink
                    ? `${item.externalLink}`
                    : item.externalLink
                    ? `/${item.slug}`
                    : item.internalLink
                    ? `/${item.internalLink.slug}`
                    : "/"
                }
              >
                <a target="_self" title={item.linkText} key={index}>
                  {item.linkText}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

function SocialLinks({ social }: any) {
  if (!social.items || social.items.length === 0) {
    return <p>Loading...</p>;
  } else {
    return (
      <ul className="social">
        {social.items.map(function (item, index) {
          return (
            <li key={item.title}>
              <Link legacyBehavior href={item.link}>
                <a target="_blank" title={item.title} key={index}>
                  <i className={item.fontAwesomeClasses}></i>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Footer;
