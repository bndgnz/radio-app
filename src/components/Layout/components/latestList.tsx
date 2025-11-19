import React, { useState, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import Link from "next/link";
import { FacebookShareButton, FacebookIcon } from "next-share";
import { TelegramShareButton, TelegramIcon } from "next-share";
import { TwitterShareButton, TwitterIcon } from "next-share";
import { EmailShareButton, EmailIcon } from "next-share";
import { RedditShareButton, RedditIcon } from "next-share";

function Message(props: any) {
  const limit = props.limit;
  const showTitle = props.showtitle;
  const title = props.title;
  const show = props.filter;
  const pagination = props.pagination;
  const countPerPage = props.countPerPage || 5;
  const showSorting = props.showSorting;
  
  const [shareModalData, setShareModalData] = useState<{isOpen: boolean, href: string, title: string, intro: string} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const MESSAGE = gql`
    query GetList($limit: Int!) {
      amazonPodcastCollection(limit: $limit, order: date_DESC) {
        items {
          amazonUrl
          title
          description
          show {
            title
            slug
          }
          podcastImage
          date
          slug
        }
      }
    }
  `;

  function SortingButtons({ sortBy, setSortBy, sortOrder, setSortOrder, onSort }: any) {
    const handleDateSort = () => {
      if (sortBy === 'date') {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy('date');
        setSortOrder('desc');
      }
      onSort('date', sortBy === 'date' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc');
    };

    const handleNameSort = () => {
      if (sortBy === 'name') {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy('name');
        setSortOrder('asc');
      }
      onSort('name', sortBy === 'name' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
    };

    return (
      <div style={{
        display: 'inline-flex',
        gap: '8px',
        marginRight: '16px'
      }}>
        <button
          onClick={handleDateSort}
          style={{
            padding: '8px 16px',
            background: sortBy === 'date' 
              ? 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)' 
              : 'white',
            color: sortBy === 'date' ? 'white' : '#c53030',
            border: sortBy === 'date' ? 'none' : '2px solid #c53030',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: sortBy === 'date' ? '0 2px 6px rgba(197, 48, 48, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (sortBy !== 'date') {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f8d7da 0%, #f5c2c7 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (sortBy !== 'date') {
              e.currentTarget.style.background = 'white';
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Date {sortBy === 'date' && (sortOrder === 'desc' ? '(Newest)' : '(Oldest)')}
        </button>
        
        <button
          onClick={handleNameSort}
          style={{
            padding: '8px 16px',
            background: sortBy === 'name' 
              ? 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)' 
              : 'white',
            color: sortBy === 'name' ? 'white' : '#c53030',
            border: sortBy === 'name' ? 'none' : '2px solid #c53030',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: sortBy === 'name' ? '0 2px 6px rgba(197, 48, 48, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (sortBy !== 'name') {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f8d7da 0%, #f5c2c7 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (sortBy !== 'name') {
              e.currentTarget.style.background = 'white';
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 8 7 4 11 8"></polyline>
            <line x1="7" y1="4" x2="7" y2="16"></line>
            <polyline points="21 16 17 20 13 16"></polyline>
            <line x1="17" y1="20" x2="17" y2="8"></line>
          </svg>
          Name {sortBy === 'name' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
        </button>
      </div>
    );
  }

  function PaginationControls({ currentPage, totalPages, onPageChange }: any) {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        padding: '20px 0',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            background: currentPage === 1 ? '#e9ecef' : 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
            color: currentPage === 1 ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(197, 48, 48, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = currentPage === 1 ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)';
          }}
        >
          « First
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            background: currentPage === 1 ? '#e9ecef' : 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
            color: currentPage === 1 ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(197, 48, 48, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = currentPage === 1 ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)';
          }}
        >
          ‹ Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              style={{
                padding: '8px 12px',
                background: 'white',
                color: '#c53030',
                border: '2px solid #c53030',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                minWidth: '40px'
              }}
            >
              1
            </button>
            {startPage > 2 && <span style={{ color: '#6c757d' }}>...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            style={{
              padding: '8px 12px',
              background: currentPage === number 
                ? 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)' 
                : 'white',
              color: currentPage === number ? 'white' : '#c53030',
              border: currentPage === number ? 'none' : '2px solid #c53030',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              minWidth: '40px',
              transition: 'all 0.3s ease',
              boxShadow: currentPage === number ? '0 2px 6px rgba(197, 48, 48, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== number) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f8d7da 0%, #f5c2c7 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== number) {
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ color: '#6c757d' }}>...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              style={{
                padding: '8px 12px',
                background: 'white',
                color: '#c53030',
                border: '2px solid #c53030',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                minWidth: '40px'
              }}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            background: currentPage === totalPages ? '#e9ecef' : 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
            color: currentPage === totalPages ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: currentPage === totalPages ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(197, 48, 48, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = currentPage === totalPages ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)';
          }}
        >
          Next ›
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            background: currentPage === totalPages ? '#e9ecef' : 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
            color: currentPage === totalPages ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: currentPage === totalPages ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(197, 48, 48, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = currentPage === totalPages ? 'none' : '0 2px 4px rgba(197, 48, 48, 0.2)';
          }}
        >
          Last »
        </button>
        
        <div style={{
          marginLeft: '20px',
          fontSize: '14px',
          color: '#6c757d',
          fontWeight: '500'
        }}>
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  }

  function ShareModal() {
    if (!shareModalData || !shareModalData.isOpen) return null;

    return (
      <>
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShareModalData(null)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShareModalData(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '4px',
                lineHeight: '1'
              }}
              aria-label="Close"
            >
              ×
            </button>
            
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>
              Share: {shareModalData.title}
            </h3>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <FacebookShareButton
                url={"https://waihekeradio.org.nz" + shareModalData.href}
                quote={shareModalData.title}
                hashtag={"#waihekeradio"}
              >
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={"https://waihekeradio.org.nz" + shareModalData.href}
                title={shareModalData.title}
              >
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <RedditShareButton
                url={"https://waihekeradio.org.nz" + shareModalData.href}
                title={shareModalData.title}
              >
                <RedditIcon size={40} round />
              </RedditShareButton>
              <EmailShareButton
                url={"https://waihekeradio.org.nz" + shareModalData.href}
                subject={shareModalData.title}
                body={shareModalData.intro + "\n\n"}
              >
                <EmailIcon size={40} round />
              </EmailShareButton>
            </div>
          </div>
        </div>
      </>
    );
  }

  function ShareButton(props: any) {
    return (
      <button
        onClick={() => setShareModalData({
          isOpen: true,
          href: props.href,
          title: props.title,
          intro: props.intro
        })}
        style={{
          background: 'linear-gradient(135deg, #4267B2 0%, #5B7EC2 100%)',
          border: 'none',
          borderRadius: '6px',
          padding: '3px 10px',
          cursor: 'pointer',
          fontSize: '12.6px',
          color: 'white',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(66, 103, 178, 0.2)',
          fontWeight: '500',
          marginLeft: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 3px 6px rgba(66, 103, 178, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(66, 103, 178, 0.2)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span className="share-button-text">Share</span>
      </button>
    );
  }

  const { data, loading, error } = useQuery(MESSAGE, { variables: { limit } });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

  let arr = [...data.amazonPodcastCollection.items];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].slug === props.featuredPodcastSlug) {
      delete arr[i];
    }
  }

  var filteredPodcastList = arr.filter(function (el) {
    return el != null;
  });

  function DateDisplay(date: any) {
    let year = date.date.substring(0, 4);
    let month = date.date.substring(5, 7);
    let day = date.date.substring(8, 10);
    return (
      <strong>
        <strong>{day + "-" + month + "-" + year}</strong>{" "}
      </strong>
    );
  }

  function FeaturedPodcast() {
    if (props.showFeatured) {
      return (
        <div
          className="featured-podcast"
          style={{
            backgroundImage: `url(${props.featuredPodcastImage})`,
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="show-name">
            {" "}
            <a
              href={"/shows/" + props.featuredPodcastShowSlug}
              title={
                "Find out more about the " +
                props.featuredPodcastShowTitle +
                " show"
              }
            >
              {props.featuredPodcastShowTitle}
            </a>{" "}
          </div>

          <ShareButton
            href={"/podcast/" + props.featuredPodcastSlug}
            intro={props.featuredPodcastDescription}
            title={props.featuredPodcastTitle}
          />

          <br />

          <div className="featured-podcast-title">
            {" "}
            <a
              href={"../podcast/" + props.featuredPodcastSlug}
              title={"Find out more about " + props.featuredPodcastTitle}
              className="featured-podcast-title"
            >
              {" "}
              {props.featuredPodcastTitle}{" "}
            </a>
          </div>

          <div className="featured-podcast-description">
            {props.featuredPodcastDescription}
          </div>

          <audio
            controls
            src={props.featuredPodcastUrl}
            id={props.featuredPodcastTitle.replaceAll(" ", "-") + "-stream"}
          >
            Your browser does not support the
            <code>audio</code> element.d
          </audio>
        </div>
      );
    }
  }

  function SecondaryPodcast(props: any) {
    const item = filteredPodcastList.at(props.position);

    return (
      <div
        className="featured-podcast-4"
        style={{
          backgroundImage: `url(${item.podcastImage[0].secure_url})`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="show-name-4">
          <a
            href={"/shows/" + item.show.slug}
            title={"Find out more about the " + item.show.title + " show"}
          >
            {item.show.title}
          </a>
        </div>
        <ShareButton
          href={"/podcast/" + item.slug}
          title={item.title}
          intro={item.description}
        />
        <br />

        <div className="featured-podcast-title-4">
          <a
            href={"../podcast/" + item.slug}
            title={"Find out more about " + item.title}
          >
            {item.title}{" "}
          </a>
        </div>

        <audio
          className="featured-podcast-4"
          controls
          src={item.amazonUrl}
          id={item.show.title.replaceAll(" ", "-") + "-stream"}
        >
          Your browser does not support the
          <code>audio</code> element.d
        </audio>
      </div>
    );
  }

  function FeaturedRight() {
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
    // Show 5 items for desktop, 4 for tablet and mobile
    const culledListDesktop = filteredPodcastList.slice(5, 10); // 5 items for desktop
    const culledListTabletMobile = filteredPodcastList.slice(5, 9); // 4 items for tablet/mobile

    const handlePlayPause = (index: number, audioUrl: string) => {
      const audio = audioRefs.current[index];
      
      if (playingIndex === index && audio && !audio.paused) {
        audio.pause();
        setPlayingIndex(null);
      } else {
        // Pause any currently playing audio
        if (playingIndex !== null && audioRefs.current[playingIndex]) {
          audioRefs.current[playingIndex]?.pause();
        }
        
        if (!audio) {
          audioRefs.current[index] = new Audio(audioUrl);
          audioRefs.current[index]!.play();
        } else {
          audio.play();
        }
        setPlayingIndex(index);
      }
    };

    const renderItems = (itemList: any[], classModifier: string = '') => {
      return itemList.map((podcast, idx) => {
      return (
        <div className="row featured-right-row" key={idx}>
          <div className="featured-right-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handlePlayPause(idx, podcast.amazonUrl)}
              style={{
                background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: '0',
                minWidth: '32px',
                minHeight: '32px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: 'white',
                boxShadow: '0 2px 6px rgba(197, 48, 48, 0.3)',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                aspectRatio: '1/1'
              }}
              aria-label={playingIndex === idx ? 'Pause' : 'Play'}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(197, 48, 48, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(197, 48, 48, 0.3)';
              }}
            >
              {playingIndex === idx ? '❚❚' : '▶'}
            </button>
            <a
              href={"../podcast/" + podcast.slug}
              title={"Find out more about " + podcast.title}
              style={{ flex: 1 }}
            >
              {podcast.title}
            </a>
          </div>

          <div className="featured-right-desc">{podcast.description}</div>

          <div className="featured-right-show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
            <div className="show-from-section" style={{ display: 'inline-flex', alignItems: 'center' }}>
              From:{" "}
              <a
                href={"../shows/" + podcast.show.slug}
                title={"Find out more about " + podcast.show.title}
                style={{ marginLeft: '4px' }}
              >
                {podcast.show.title}
              </a>
            </div>
            <button
              onClick={() => setShareModalData({
                isOpen: true,
                href: "/podcast/" + podcast.slug,
                title: podcast.title,
                intro: podcast.description
              })}
              style={{
                background: 'linear-gradient(135deg, #4267B2 0%, #5B7EC2 100%)',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer',
                fontSize: '11px',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(66, 103, 178, 0.2)',
                fontWeight: '500',
                marginRight: '7px',
                marginTop: '-4px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(66, 103, 178, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(66, 103, 178, 0.2)';
              }}
              aria-label="Share"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
          </div>
        </div>
      );
    });
    };

    return (
      <div>
        {/* Desktop version - show 5 items */}
        <div className="d-none d-lg-block">
          {renderItems(culledListDesktop)}
        </div>
        {/* Tablet and Mobile version - show 4 items */}
        <div className="d-lg-none">
          {renderItems(culledListTabletMobile)}
        </div>
      </div>
    );
  }

  function Featured() {
    if (props.showFeatured) {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-12">
                      <FeaturedPodcast />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <SecondaryPodcast position="0" />
                    </div>
                    <div className="col-md-6">
                      <SecondaryPodcast position="1" />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="row">
                    <div className="col-md-12">
                      <SecondaryPodcast position="2" />
                      <SecondaryPodcast position="3" />
                      <SecondaryPodcast position="4" />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="row">
                    <div className="col-md-12">
                      <FeaturedRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  function StandardItems() {
    let standardArray;

    if (props.showFeatured === true) {
      standardArray = filteredPodcastList.slice(10, 99);
    } else {
      standardArray = data.amazonPodcastCollection.items;
    }

    // Apply sorting if enabled
    const shouldSort = !props.showFeatured && showSorting === true;
    if (shouldSort) {
      standardArray = [...standardArray].sort((a, b) => {
        if (sortBy === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        } else if (sortBy === 'name') {
          const nameA = a.title.toLowerCase();
          const nameB = b.title.toLowerCase();
          return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        }
        return 0;
      });
    }

    // Apply pagination if enabled and showFeatured is not true
    const shouldPaginate = !props.showFeatured && pagination === true;
    const itemsPerPage = countPerPage;
    const totalPages = shouldPaginate ? Math.ceil(standardArray.length / itemsPerPage) : 1;
    
    // Get current page items
    let paginatedArray = standardArray;
    if (shouldPaginate) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      paginatedArray = standardArray.slice(startIndex, endIndex);
    }

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSort = (newSortBy: 'date' | 'name', newSortOrder: 'asc' | 'desc') => {
      // Reset to first page when sorting changes
      setCurrentPage(1);
    };

    const listOfItems = paginatedArray.map((podcast, idx) => {
      return (
        <div className="row amazon-playlist-row standard-items" key={idx}>
          <div className="col-lg-2 col-xs-12 amazon-podcast-image">
            <a
              href={"../podcast/" + podcast.slug}
              title={"Read more about " + podcast.title}
            >
              <img
                src={podcast.podcastImage[0].url}
                alt={podcast.title}
                className="latest-amazon-podcast-image"
              />
            </a>
          </div>

          <div className="col-lg-7 col-xs-12 amazon-podcast-content">
            <div className=" amazon-podcast-card-title">
              <a
                href={"../podcast/" + podcast.slug}
                title={"Read more about " + podcast.title}
              >
                <strong>{podcast.title}</strong>
              </a>
            </div>

            <div className=" amazon-podcast-card-description-latest-list">
              {podcast.description}
            </div>

            <strong>
              {" "}
              <Link href={"podcast/" + podcast.slug}>Read more</Link>
            </strong>

            <ShareButton
              href={"/podcast/" + podcast.slug}
              title={podcast.title}
              intro={podcast.description}
            />
          </div>
          <div className="col-lg-3 col-xs-12 ">
            {" "}
            <div className="amazonplaylist-audio">
              <p>
                {" "}
                <b>Show:</b>{" "}
                <a
                  href={"../shows/" + podcast.show.slug}
                  title={"Read more about " + podcast.show.title}
                >
                  <strong>{podcast.show.title}</strong>
                </a>{" "}
              </p>
              <audio
                controls
                src={podcast.amazonUrl}
                id={
                  podcast.show.title.replaceAll(" ", "-") + "-" + podcast.slug
                }
              >
                Your browser does not support the
                <code>audio</code> element.
              </audio>
              <DateDisplay date={podcast.date} />
            </div>{" "}
          </div>
        </div>
      );
    });

    return (
      <>
        {(shouldPaginate || shouldSort) && (
          <>
            <div style={{
              textAlign: 'center',
              padding: '10px',
              fontSize: '16px',
              color: '#495057',
              fontWeight: '500',
              marginBottom: '10px'
            }}>
              {shouldPaginate && `Showing ${((currentPage - 1) * itemsPerPage) + 1} - ${Math.min(currentPage * itemsPerPage, standardArray.length)} of ${standardArray.length} podcasts`}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '10px 0'
            }}>
              {shouldSort && (
                <SortingButtons 
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  onSort={handleSort}
                />
              )}
              {shouldPaginate && (
                <PaginationControls 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )}
        {listOfItems}
        {(shouldPaginate || shouldSort) && (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '10px 0'
            }}>
              {shouldSort && (
                <SortingButtons 
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  onSort={handleSort}
                />
              )}
              {shouldPaginate && (
                <PaginationControls 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
            {shouldPaginate && (
              <div style={{
                textAlign: 'center',
                padding: '10px',
                fontSize: '14px',
                color: '#6c757d',
                marginTop: '10px'
              }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, standardArray.length)} of {standardArray.length} podcasts
              </div>
            )}
          </>
        )}
      </>
    );
  }
  return (
    <>
      <ShareModal />
      {props.showtitle != false ? (
        <section className="playlist container page-block amazon-playlist">
          <div className="container">
            <div className="row">
              <div className="col-lg-12  ">
                <div className="layout-title">
                  <h3> {title}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="playlist container page-block amazon-playlist">
        <Featured />

        <StandardItems />
      </section>
    </>
  );
}

export default Message;
