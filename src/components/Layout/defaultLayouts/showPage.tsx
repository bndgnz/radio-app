import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { MdRssFeed } from 'react-icons/md';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaVolumeMute, FaCommentAlt } from 'react-icons/fa';
import React, { useState, useRef, useEffect, ReactElement } from 'react';

function Showpage(props: any) {
  const showlink = props.props.type.showUrl;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [showlink]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  const handleLiveChat = () => {
    if (props.props.type.toggleChat) {
      props.props.type.toggleChat();
    } else {
      alert('Live Chat feature coming soon!');
    }
  };

  const handleRSSFeed = () => {
    window.open(process.env.NEXT_PUBLIC_SITE_URL + "/" + props.props.type.slug + ".xml", '_blank');
  };

  const handleSchedule = () => {
    alert('Full schedule coming soon!');
  };

  const styles = `
    .modern-radio-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .radio-main-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      overflow: hidden;
    }

    .radio-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      min-height: 500px;
    }

    .radio-left-column {
      padding: 32px;
      background: white;
    }

    .radio-right-column {
      padding: 32px;
      background: #f8f9fa;
      border-left: 1px solid #e9ecef;
    }

    .radio-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .radio-title {
      font-size: 28px;
      font-weight: 700;
      color: #212529;
      margin: 0;
    }

    .radio-header-buttons {
      display: flex;
      gap: 12px;
    }

    .radio-button {
      padding: 10px 20px;
      border-radius: 24px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .radio-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .radio-button.live-chat {
      background: linear-gradient(135deg, #1db4e8 0%, #0ea5e9 100%);
    }

    .radio-button.rss-feed {
      background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
    }

    .radio-player {
      background: #f8f9fa;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 32px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .player-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 0;
      width: 100%;
      position: relative;
    }

    .play-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 22px;
      box-shadow: 0 4px 12px rgba(197, 48, 48, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .play-button:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 8px 20px rgba(197, 48, 48, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .play-button:active {
      transform: scale(0.98);
    }

    .progress-container {
      flex: 1;
      max-width: 75%;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: #dee2e6;
      border-radius: 5px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
      border-radius: 5px;
      transition: width 0.1s ease;
    }

    .time-display {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 13px;
      color: #6c757d;
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 20%;
      min-width: 100px;
      flex-shrink: 0;
      height: 64px;
      margin-top: -24px;
    }

    .volume-icon {
      color: #c53030;
      font-size: 22px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .volume-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    .volume-slider {
      width: 100%;
      height: 10px;
      appearance: none;
      background: #dee2e6;
      border-radius: 5px;
      outline: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .volume-slider::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: #c53030;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .volume-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: #c53030;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .radio-about {
      margin-bottom: 32px;
    }

    .radio-about h3 {
      font-size: 20px;
      font-weight: 600;
      color: #212529;
      margin-bottom: 16px;
    }

    .radio-about-content {
      color: #495057;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .sponsor-banner {
      background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
      border-radius: 12px;
      padding: 20px 24px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(197, 48, 48, 0.25);
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .sponsor-banner::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      animation: shimmer 3s infinite;
    }

    .sponsor-banner h5 {
      margin: 0;
      font-size: 16px;
      color: white;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sponsor-banner h5::before {
      content: '🏆';
      font-size: 18px;
      animation: bounce 2s infinite;
    }

    .sponsor-banner strong {
      color: #fff;
      font-weight: 700;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-5px);
      }
      60% {
        transform: translateY(-3px);
      }
    }

    .presenters-section h3 {
      font-size: 20px;
      font-weight: 600;
      color: #212529;
      margin-bottom: 20px;
    }

    .presenter-card {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .presenter-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .presenter-avatar {
      width: 94px;
      height: 94px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 26px;
      flex-shrink: 0;
    }

    .presenter-avatar-img {
      width: 94px;
      height: 94px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .presenter-info {
      flex: 1;
    }

    .presenter-name {
      font-size: 16px;
      font-weight: 600;
      color: #212529;
      margin-bottom: 4px;
    }

    .presenter-description {
      font-size: 14px;
      color: #6c757d;
      line-height: 1.5;
    }

    .schedule-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 24px;
    }

    .schedule-button {
      flex: 1;
      min-width: calc(50% - 4px);
      padding: 10px 12px;
      border-radius: 24px;
      border: none;
      background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      line-height: 1.2;
    }

    .schedule-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(197, 48, 48, 0.25);
    }

    @media (max-width: 992px) {
      .radio-grid {
        grid-template-columns: 1fr;
      }

      .radio-right-column {
        border-left: none;
        border-top: 1px solid #e9ecef;
      }
    }

    @media (max-width: 576px) {
      .radio-left-column,
      .radio-right-column {
        padding: 20px;
      }

      .radio-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .radio-header-buttons {
        width: 100%;
      }

      .radio-button {
        flex: 1;
        justify-content: center;
      }

      .player-controls {
        flex-wrap: wrap;
      }

      .progress-container {
        width: 100%;
        margin-top: 12px;
        order: 3;
      }

      .volume-control {
        width: 100%;
        margin-top: 8px;
        order: 4;
      }

      .schedule-buttons {
        flex-direction: column;
      }
    }

    /* Modern Playlist Styling */
    :global(section.playlist.container.page-block),
    :global(section.playlist.container.page-block.amazon-playlist) {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      padding: 32px;
      margin: 32px auto;
      max-width: 1200px;
      border: 1px solid #e9ecef;
    }

    :global(.row.amazon-playlist-row) {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
    }

    :global(.row.amazon-playlist-row:hover) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    :global(.amazon-podcast-image img) {
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      height: auto;
    }

    :global(.amazon-podcast-card-title) {
      margin-bottom: 12px;
    }

    :global(.amazon-podcast-card-title a) {
      color: #212529;
      text-decoration: none;
      font-size: 18px;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    :global(.amazon-podcast-card-title a:hover) {
      color: #c53030;
    }

    :global(.amazon-podcast-card-description) {
      color: #495057;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    :global(.amazonplaylist-audio) {
      background: white;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #e9ecef;
    }

    :global(.amazonplaylist-audio p) {
      margin-bottom: 12px;
      font-size: 14px;
    }

    :global(.amazonplaylist-audio a) {
      color: #c53030;
      text-decoration: none;
      font-weight: 600;
    }

    :global(.amazonplaylist-audio a:hover) {
      color: #e53e3e;
    }

    :global(.amazonplaylist-audio audio) {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      background: #f8f9fa;
      margin-bottom: 12px;
    }

    :global(a.tooltiplink.playlist-title-link) {
      display: block;
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      color: #212529;
      margin-bottom: 32px;
      text-decoration: none;
    }

    :global(a.tooltiplink.playlist-title-link:hover) {
      color: #c53030;
    }

    @media (max-width: 992px) {
      :global(section.playlist.container.page-block),
      :global(section.playlist.container.page-block.amazon-playlist) {
        padding: 20px;
        margin: 20px auto;
      }

      :global(.row.amazon-playlist-row) {
        padding: 16px;
      }

      :global(.amazon-podcast-content) {
        margin-top: 16px;
        margin-bottom: 16px;
      }
    }
  `;

  const presenters = props.props.type.dj || [];
  const times = props.props.type.times || [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="modern-radio-container">
        <div className="radio-main-container">
          <div className="radio-grid">
            <div className="radio-left-column">
              <div className="radio-header">
                <h1 className="radio-title">Latest show</h1>
                <div className="radio-header-buttons">
                  {props.props.type.chat && (
                    <button className="radio-button live-chat" onClick={handleLiveChat}>
                      {React.createElement(FaCommentAlt as any)} Live Chat
                    </button>
                  )}
                  {props.props.type.rss && (
                    <button className="radio-button rss-feed" onClick={handleRSSFeed}>
                      {React.createElement(MdRssFeed as any)} RSS Feed
                    </button>
                  )}
                </div>
              </div>

              {showlink && (
                <div className="radio-player">
                  <audio 
                    ref={audioRef} 
                    src={showlink} 
                    id={props.props.type.slug + "-audio-player"}
                  />
                  <div className="player-controls">
                    <button className="play-button" onClick={togglePlayPause}>
                      {isPlaying ? React.createElement(FaPause as any) : React.createElement(FaPlay as any)}
                    </button>
                    <div className="progress-container">
                      <div className="progress-bar" onClick={handleSeek}>
                        <div 
                          className="progress-fill" 
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="time-display">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                    <div className="volume-control">
                      <span className="volume-icon">
                        {volume === 0 ? React.createElement(FaVolumeMute as any) : volume < 0.5 ? React.createElement(FaVolumeDown as any) : React.createElement(FaVolumeUp as any)}
                      </span>
                      <div className="volume-container">
                        <input
                          type="range"
                          className="volume-slider"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="radio-about">
                <h3>About {props.props.type.title || "Island Life"}</h3>
                <div className="radio-about-content">
                  {props.props.type.content ? (
                    documentToReactComponents(props.props.type.content)
                  ) : (
                    <p>
                      Island Life is broadcast every Saturday morning between 10am and noon. 
                      Tune in for the latest news, views and interviews from around the island.
                    </p>
                  )}
                </div>
                {props.props.type.sponsor && (
                  <div className="sponsor-banner">
                    <h5>
                      <strong>Proudly sponsored by:</strong> {props.props.type.sponsor.fields.title}
                    </h5>
                  </div>
                )}
              </div>
            </div>

            <div className="radio-right-column">
              <div className="presenters-section">
                <h3>Presenters</h3>
                {presenters.length > 0 ? (
                  presenters.map((presenter, index) => {
                    const hasImage = presenter.fields?.headshot?.[0]?.secure_url;
                    const initials = presenter.fields?.title
                      ?.split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase() || 'DJ';
                    
                    return (
                      <div key={index} className="presenter-card">
                        {hasImage ? (
                          <img 
                            className="presenter-avatar-img"
                            src={presenter.fields.headshot[0].secure_url}
                            alt={presenter.fields?.title || 'Presenter'}
                          />
                        ) : (
                          <div className="presenter-avatar">
                            {initials}
                          </div>
                        )}
                        <div className="presenter-info">
                          <div className="presenter-name">
                            {presenter.fields?.title || 'Presenter'}
                          </div>
                          <div className="presenter-description">
                            {presenter.fields?.shortBio || `Host of ${props.props.type.title || 'the show'}`}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="presenter-card">
                      <div className="presenter-avatar">CW</div>
                      <div className="presenter-info">
                        <div className="presenter-name">Chris Walker</div>
                        <div className="presenter-description">
                          Bringing you the latest island news and interviews
                        </div>
                      </div>
                    </div>
                    <div className="presenter-card">
                      <div className="presenter-avatar">GT</div>
                      <div className="presenter-info">
                        <div className="presenter-name">Greg Treadwell</div>
                        <div className="presenter-description">
                          Your guide to island life and community events
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {times.length > 0 && (
                  <div className="schedule-buttons">
                    {times.map((time, index) => (
                      <button key={index} className="schedule-button">
                        {time.fields.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Showpage;0