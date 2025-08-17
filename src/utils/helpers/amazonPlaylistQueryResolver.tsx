import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import { FacebookShareButton, FacebookIcon } from "next-share";
import { TelegramShareButton, TelegramIcon } from "next-share";
import { TwitterShareButton, TwitterIcon } from "next-share";
import { EmailShareButton, EmailIcon } from "next-share";
import { RedditShareButton, RedditIcon } from "next-share";

function FilteredAmazonPlaylistResolver(props: any) {
  const pagination = props.data.filteredAmazonPlaylist.pagination;
  const countPerPage = props.data.filteredAmazonPlaylist.countPerPage || 5;
  const showSorting = props.data.filteredAmazonPlaylist.sorting;
  
  const [shareModalData, setShareModalData] = useState<{isOpen: boolean, href: string, title: string, intro: string} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  const { origin } = absoluteUrl(router.req);

  function PlaylistTitle() {
    if (props.data.filteredAmazonPlaylist.displayTitle == true) {
      return (
        <h2 className="filtered-playlisttitle">
          {props.data.filteredAmazonPlaylist.title}
        </h2>
      );
    }
  }

  const show = props.data.filteredAmazonPlaylist.showName
    ? props.data.filteredAmazonPlaylist.showName
    : "";
  const date1 = props.data.filteredAmazonPlaylist.startDate
    ? props.data.filteredAmazonPlaylist.startDate
    : "2000-01-10T00:00:00.000Z";
  const date2 = props.data.filteredAmazonPlaylist.endDate
    ? props.data.filteredAmazonPlaylist.endDate
    : "2200-01-10T00:00:00.000Z";
  const titleContains = props.data.filteredAmazonPlaylist.titleContains
    ? props.data.filteredAmazonPlaylist.titleContains
    : "";
  const descriptionContains = props.data.filteredAmazonPlaylist
    .descriptionContains
    ? props.data.filteredAmazonPlaylist.descriptionContains
    : "";
  const sort = props.data.filteredAmazonPlaylist.sort
    ? props.data.filteredAmazonPlaylist.sort
    : "none";
 
 let sortType;
  if (sort == "Ascending") {
    sortType = "date_ASC";
 ;
  }
   if (sort == "Descending") {
    sortType = "date_DESC";
   
  } if (sort == "none"){ 
     sortType = "date_DESC";
 
  }

  const PLAYLISTITEMS = gql`
    query GetFilteredItems(
      $show: String!
      $date1: DateTime!
      $date2: DateTime!
      $titleContains: String!
      $descriptionContains: String!
      $sortType: AmazonPodcastOrder!
    ) {
      amazonPodcastCollection(
        limit: 300
        where: {
          AND: [
            {
              AND: [
                { show: { title_contains: $show } }
                { date_gt: $date1 }
                { date_lt: $date2 }
                { title_contains: $titleContains }
                { description_contains: $descriptionContains }
              ]
            }
          ]
        }
        order: [$sortType]
      ) {
        total
        items {
          title
          date
          description
          amazonUrl
          slug
          podcastImage
          show {
            ...showname
          }
        }
      }
    }

    fragment showname on Shows {
      title
    }
  `;

  const { data, loading, error } = useQuery(PLAYLISTITEMS, {
    variables: {
      show,
      date1,
      date2,
      descriptionContains,
      titleContains,
      sortType,
    },
  });
  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }

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
        >
          First
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
        >
          Previous
        </button>
        
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
              transition: 'all 0.3s ease',
              boxShadow: currentPage === number ? '0 2px 6px rgba(197, 48, 48, 0.3)' : 'none'
            }}
          >
            {number}
          </button>
        ))}
        
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
        >
          Next
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
        >
          Last
        </button>
      </div>
    );
  }

  function ShareButton({ podcast }: any) {
    const handleShare = () => {
      const href = `${origin}/podcast/${podcast.slug}`;
      setShareModalData({
        isOpen: true,
        href,
        title: podcast.title,
        intro: podcast.description
      });
    };

    return (
      <>
        <button
          onClick={handleShare}
          style={{
            backgroundColor: '#1877f2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(24, 119, 242, 0.2)',
            marginTop: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#166fe5';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(24, 119, 242, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1877f2';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(24, 119, 242, 0.2)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span className="share-button-text">Share</span>
        </button>

        {shareModalData?.isOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}>
              <button
                onClick={() => setShareModalData(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
              
              <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>Share "{shareModalData.title}"</h3>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <FacebookShareButton url={shareModalData.href} quote={shareModalData.title}>
                  <FacebookIcon size={48} round />
                </FacebookShareButton>
                
                <TwitterShareButton url={shareModalData.href} title={shareModalData.title}>
                  <TwitterIcon size={48} round />
                </TwitterShareButton>
                
                <TelegramShareButton url={shareModalData.href} title={shareModalData.title}>
                  <TelegramIcon size={48} round />
                </TelegramShareButton>
                
                <EmailShareButton url={shareModalData.href} subject={shareModalData.title} body={shareModalData.intro}>
                  <EmailIcon size={48} round />
                </EmailShareButton>
                
                <RedditShareButton url={shareModalData.href} title={shareModalData.title}>
                  <RedditIcon size={48} round />
                </RedditShareButton>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  function Items() {
    const handleSort = (field: 'date' | 'name', order: 'asc' | 'desc') => {
      setCurrentPage(1); // Reset to first page when sorting
    };
    
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
    
    // Apply sorting
    let sortedPodcasts = [...data.amazonPodcastCollection.items];
    
    if (sortBy === 'date') {
      sortedPodcasts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === 'name') {
      sortedPodcasts.sort((a, b) => {
        const nameA = a.title.toLowerCase();
        const nameB = b.title.toLowerCase();
        if (sortOrder === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }
    
    // Apply pagination if enabled
    let paginatedPodcasts = sortedPodcasts;
    let totalPages = 1;
    
    if (pagination) {
      const startIndex = (currentPage - 1) * countPerPage;
      const endIndex = startIndex + countPerPage;
      paginatedPodcasts = sortedPodcasts.slice(startIndex, endIndex);
      totalPages = Math.ceil(sortedPodcasts.length / countPerPage);
    }
    
    const listOfItems = paginatedPodcasts.map(
      (podcast, idx) => {
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
                <a href={"podcast/" + podcast.slug}>Read more</a>
              </strong>
            </div>
            <div className="col-lg-3 col-xs-12 ">
              {" "}
              <div className="amazonplaylist-audio">
                <p>
                  {" "}
                  <b>Show:</b>{" "}
                  <a
                    href={"../shows/" + podcast.show?.slug}
                    title={"Read more about " + podcast.show?.title}
                  >
                    <strong>{podcast.show?.title}</strong>
                  </a>{" "}
                </p>
                <audio
                  controls
                  src={podcast.amazonUrl}
                  id={
                    podcast.show?.title?.replaceAll(" ", "-") + "-" + podcast.slug
                  }
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
                <DateDisplay date={podcast.date} />
                <ShareButton podcast={podcast} />
              </div>{" "}
            </div>
          </div>
        );
      }
    );

    return (
      <div className="featured-podcasts-overflow">
        {showSorting && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <SortingButtons 
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              onSort={handleSort}
            />
            {pagination && totalPages > 1 && (
              <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
        
        {!showSorting && pagination && totalPages > 1 && (
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        
        {listOfItems}
        
        {pagination && totalPages > 1 && (
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <section className="playlist container page-block amazon-playlist">
        <div className="container">
          <PlaylistTitle />

          <Items />
        </div>
      </section>
    </>
  );
}

export default FilteredAmazonPlaylistResolver;
