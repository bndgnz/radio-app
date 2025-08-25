import React from 'react';

interface PlaylistPlayerProps {
  playlistUrl: string;
  showName?: string;
}

const PlaylistPlayer: React.FC<PlaylistPlayerProps> = ({ playlistUrl, showName }) => {
  // Check if URL is Mixcloud or SoundCloud
  const isMixcloud = playlistUrl.includes('mixcloud.com');
  const isSoundCloud = playlistUrl.includes('soundcloud.com');

  const containerStyles: React.CSSProperties = {
    marginTop: '24px',
    marginBottom: '24px',
    padding: '20px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const iframeContainerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  if (isMixcloud) {
    // Extract the Mixcloud path from the URL
    const mixcloudPath = playlistUrl.replace('https://www.mixcloud.com', '').replace('https://mixcloud.com', '');
    const embedUrl = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=${encodeURIComponent(mixcloudPath)}`;
    
    return (
      <div style={containerStyles}>
        <div style={titleStyles}>
          Latest Mixes
        </div>
        <div style={iframeContainerStyles}>
          <iframe
            width="100%"
            height="120"
            src={embedUrl}
            frameBorder="0"
            allow="autoplay"
            title={`${showName || 'Show'} Mixcloud Player`}
            style={{ border: 'none' }}
          />
        </div>
      </div>
    );
  }

  if (isSoundCloud) {
    // For SoundCloud, we'll use their embed API
    // Extract track/playlist ID from URL if needed
    const soundCloudUrl = encodeURIComponent(playlistUrl);
    const embedUrl = `https://w.soundcloud.com/player/?url=${soundCloudUrl}&color=%23c53030&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
    
    return (
      <div style={containerStyles}>
        <div style={titleStyles}>
          Latest Tracks
        </div>
        <div style={iframeContainerStyles}>
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="0"
            allow="autoplay"
            src={embedUrl}
            title={`${showName || 'Show'} SoundCloud Player`}
            style={{ border: 'none' }}
          />
        </div>
      </div>
    );
  }

  // If it's neither Mixcloud nor SoundCloud, show a link button
  return (
    <div style={containerStyles}>
      <div style={titleStyles}>
        Playlist
      </div>
      <a
        href={playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
          color: 'white',
          borderRadius: '24px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(197, 48, 48, 0.25)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(197, 48, 48, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(197, 48, 48, 0.25)';
        }}
      >
        View Playlist →
      </a>
    </div>
  );
};

export default PlaylistPlayer;