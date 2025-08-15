import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface AudioPlayerProps {
  audioUrl?: string;
  duration: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setTotalDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Parse duration string (format: "1:59:39")
  const parseDuration = (dur: string) => {
    const parts = dur.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const displayDuration = totalDuration || parseDuration(duration);

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl || '#'} />
      
      <button 
        className="play-button"
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (FaPause as any)({}) : (FaPlay as any)({})}
      </button>

      <div className="progress-container">
        <input
          type="range"
          min="0"
          max={displayDuration}
          value={currentTime}
          onChange={handleProgressChange}
          className="progress-bar"
          aria-label="Seek"
        />
        <div className="time-display">
          {formatTime(currentTime)} / {duration}
        </div>
      </div>

      <style jsx>{`
        .audio-player {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          margin: 20px 0;
        }

        .play-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #c53030;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .play-button:hover {
          background: #b91c1c;
          transform: scale(1.05);
        }

        .play-button:active {
          transform: scale(0.95);
        }

        .progress-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          appearance: none;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          cursor: pointer;
        }

        .progress-bar::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        .progress-bar::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .time-display {
          font-size: 12px;
          color: white;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .audio-player {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;