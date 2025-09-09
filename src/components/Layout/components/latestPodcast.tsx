import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity.client';
import groq from 'groq';
import { sanitizeText, sanitizeHtmlAttribute } from '@/src/utils/textSanitizer';
import styles from '@/styles/Theme.module.css';

interface Podcast {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  date: string;
  description: any;
  amazonUrl: string;
  podcastImage?: {
    url?: string;
    secure_url?: string;
  };
  show?: {
    title: string;
    slug: {
      current: string;
    };
  };
}

interface LatestPodcastProps {
  title?: string;
  limit?: number;
  showTitle?: boolean;
  showFeatured?: boolean;
  filterByShow?: string;
  props?: any;
  id?: any;
}

// Helper function to convert Portable Text to plain text
function portableTextToPlainText(portableText: any): string {
  if (!portableText) return '';
  if (typeof portableText === 'string') return portableText;
  if (!Array.isArray(portableText)) return '';
  
  return portableText
    .map(block => {
      if (block._type === 'block') {
        return block.children?.map((child: any) => child.text).join('') || '';
      }
      return '';
    })
    .join(' ')
    .trim();
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const LatestPodcast: React.FC<LatestPodcastProps> = ({ 
  title = "Latest Podcasts",
  limit = 10,
  showTitle = true,
  showFeatured = false,
  filterByShow,
  props,
  id
}) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Extract data from props if provided (for Sanity CMS integration)
  // Handle both direct props and itemRef structure used by the layout system
  let componentData;
  if (props?.itemRef) {
    // This component is being called through the pageDesign system with an itemRef
    // We need to use the id parameter which should contain the resolved data
    componentData = id;
  } else {
    // Direct component usage
    componentData = props?.item || props?.component || props || id;
  }
  
  const actualTitle = componentData?.title || title;
  const actualLimit = componentData?.numberToShow || limit;
  const actualShowTitle = componentData?.showTitle !== false && showTitle;
  const actualShowFeatured = componentData?.showFeatured || showFeatured;
  const actualFilter = componentData?.filterByShow?.title || filterByShow;


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use the same query pattern as latestList.tsx that works
        const query = groq`*[_type == "amazonPodcast"]{
          ...,
          podcastImage,
          show->{
            title,
            slug
          }
        } | order(date desc)`;
        
        // We'll limit the results after fetching, just like latestList.tsx does

        const allPodcasts = await sanityClient.fetch(query);
        
        // Apply filtering and limiting on the client side, just like latestList.tsx
        let filteredPodcasts = allPodcasts || [];
        
        // Filter by show if specified
        if (actualFilter) {
          filteredPodcasts = filteredPodcasts.filter(podcast => 
            podcast.show?.title?.toLowerCase().includes(actualFilter.toLowerCase())
          );
        }
        
        // Limit results
        if (actualLimit && actualLimit > 0) {
          filteredPodcasts = filteredPodcasts.slice(0, actualLimit);
        }
        
        const podcastData = filteredPodcasts;
        setPodcasts(podcastData || []);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [actualFilter, actualLimit]);

  const handlePlayPause = (podcastId: string, audioUrl: string) => {
    const currentAudio = audioRefs.current[podcastId];
    
    if (currentlyPlaying === podcastId && currentAudio && !currentAudio.paused) {
      // Pause current audio
      currentAudio.pause();
      setCurrentlyPlaying(null);
    } else {
      // Stop any other playing audio
      if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying].pause();
      }
      
      // Create or get audio element
      if (!currentAudio) {
        audioRefs.current[podcastId] = new Audio(audioUrl);
        const audio = audioRefs.current[podcastId];
        
        audio.addEventListener('ended', () => {
          setCurrentlyPlaying(null);
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          setCurrentlyPlaying(null);
        });
      }
      
      // Play audio
      audioRefs.current[podcastId].play();
      setCurrentlyPlaying(podcastId);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio && !audio.paused) {
          audio.pause();
        }
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="latest-podcast-component">
        <div className={styles.sectionTitle}>Loading...</div>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="latest-podcast-component">
        {actualShowTitle && (
          <h3 className={styles.sectionTitle}>{sanitizeText(actualTitle)}</h3>
        )}
        <p>No podcasts available</p>
      </div>
    );
  }

  const featuredPodcast = actualShowFeatured ? podcasts[0] : null;
  const regularPodcasts = actualShowFeatured ? podcasts.slice(1) : podcasts;

  return (
    <div className="latest-podcast-component">
      {actualShowTitle && (
        <h3 className={styles.sectionTitle}>{sanitizeText(actualTitle)}</h3>
      )}

      {/* Featured Podcast */}
      {featuredPodcast && (
        <div className={styles.featuredInterview}>
          <div 
            className={styles.featuredImage}
            style={{
              backgroundImage: `url(${featuredPodcast.podcastImage?.secure_url || featuredPodcast.podcastImage?.url || 'https://via.placeholder.com/300x200/666/fff?text=🎙️'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <div className={styles.featuredTitle}>
            {sanitizeText(featuredPodcast.title)}
          </div>
          <div className={styles.featuredDesc}>
            {sanitizeText(portableTextToPlainText(featuredPodcast.description).slice(0, 120))}...
          </div>
          <button 
            className={styles.playButton}
            onClick={() => handlePlayPause(featuredPodcast._id, featuredPodcast.amazonUrl)}
          >
            {currentlyPlaying === featuredPodcast._id ? 'Stop' : 'Listen Now'}
          </button>
        </div>
      )}

      {/* Regular Podcast Items */}
      {regularPodcasts.map((podcast) => {
        const isPlaying = currentlyPlaying === podcast._id;
        const imageUrl = podcast.podcastImage?.secure_url || 
                       podcast.podcastImage?.url || 
                       'https://via.placeholder.com/64x64/666/fff?text=🎙️';
        
        return (
          <div key={podcast._id} className={styles.candidateItem}>
            <div 
              className={styles.candidateAvatar}
              style={{
                backgroundImage: `url(${imageUrl})`
              }}
            ></div>
            <button 
              className={styles.miniPlayButton}
              onClick={() => handlePlayPause(podcast._id, podcast.amazonUrl)}
              title={sanitizeHtmlAttribute(isPlaying ? "Stop" : `Play ${podcast.title}`)}
            >
              {isPlaying ? '⏹' : '▶'}
            </button>
            <div className={styles.showInfo}>
              <div className={styles.candidateName}>
                <Link href={`/podcast/${podcast.slug.current}`}>
                  <span>{sanitizeText(podcast.title)}</span>
                </Link>
              </div>
              <div className={styles.candidateRole}>
                {podcast.show ? (
                  <Link href={`/shows/${podcast.show.slug.current}`}>
                    <span>{sanitizeText(podcast.show.title)}</span>
                  </Link>
                ) : (
                  'Podcast'
                )}
                {podcast.date && ` • ${formatDate(podcast.date)}`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LatestPodcast;