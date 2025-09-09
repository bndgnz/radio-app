import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/Theme.module.css";
import { sanitizeText } from "../../../utils/textSanitizer";

interface ShowsOnTodayProps {
  props?: any;
  scheduleId?: string;
  component?: any;
  id?: any;
}

function ShowsOnTodaySanity({ props, scheduleId, component, id }: ShowsOnTodayProps) {
  // Use the component data directly instead of making API calls if available
  const scheduleData = id?.item || component || id || props;
  const showTodayOnly = scheduleData?.showTodayOnly;
  
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(!scheduleData);
  const [dayName, setDayName] = useState<string>("");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

  useEffect(() => {
    // If we have schedule data directly, use it instead of fetching
    if (scheduleData && showTodayOnly) {
      const weekday = [
        "Sunday", "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday"
      ];
      const currentDayName = weekday[new Date().getDay()];
      const currentDay = currentDayName.toLowerCase();
      
      let todayShows = [];
      switch (currentDay) {
        case "sunday": todayShows = scheduleData.sunday || []; break;
        case "monday": todayShows = scheduleData.monday || []; break;
        case "tuesday": todayShows = scheduleData.tuesday || []; break;
        case "wednesday": todayShows = scheduleData.wednesday || []; break;
        case "thursday": todayShows = scheduleData.thursday || []; break;
        case "friday": todayShows = scheduleData.friday || []; break;
        case "saturday": todayShows = scheduleData.saturday || []; break;
      }
      
      setShows(todayShows);
      setDayName(currentDayName);
      setLoading(false);
      return;
    }

    // Fall back to API fetch for other cases
    const fetchTodaysShows = async () => {
      try {
        const response = await fetch('/api/shows-today');
        const data = await response.json();
        
        if (response.ok) {
          setShows(data.shows);
          setDayName(data.dayName);
        } else {
          console.error('Error fetching shows:', data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching today\'s shows:', error);
        setLoading(false);
      }
    };

    fetchTodaysShows();
  }, [scheduleData, showTodayOnly]);

  const handlePlayPause = (index: number, showUrl: string) => {
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
        audioRefs.current[index] = new Audio(showUrl);
        audioRefs.current[index]!.play();
      } else {
        audio.play();
      }
      setPlayingIndex(index);
    }
  };

  const getShowTime = (show: any) => {
    // Enhanced debug logging
    console.log('🔍 DETAILED TIME SLOT DEBUG:', {
      showTitle: show.title,
      currentDayName: dayName,
      currentDayLower: dayName.toLowerCase(),
      hasTimeSlots: !!show.timeSlots,
      timeSlotCount: show.timeSlots?.length || 0,
      rawTimeSlots: show.timeSlots,
      parsedSlots: show.timeSlots?.map((slot: any) => ({
        raw: slot,
        day: slot?.day,
        dayLower: slot?.day?.toLowerCase(),
        startTime: slot?.startTime,
        endTime: slot?.endTime,
        amPm: slot?.amPm,
        matchesToday: slot?.day?.toLowerCase() === dayName.toLowerCase(),
        hasAllFields: !!(slot?.day && slot?.startTime),
        // Add sanitization debug info
        sanitizedDay: sanitizeText(slot?.day),
        sanitizedStartTime: sanitizeText(slot?.startTime),
        sanitizedEndTime: sanitizeText(slot?.endTime),
        sanitizedAmPm: sanitizeText(slot?.amPm)
      }))
    });

    // First check if there are any time slots
    if (!show.timeSlots || !Array.isArray(show.timeSlots) || show.timeSlots.length === 0) {
      console.log('❌ No time slots found for:', show.title);
      return '';
    }

    // Try to find a slot that matches today's day name - using sanitized data
    const todaySlot = show.timeSlots.find((slot: any) => {
      if (!slot || !slot.day) return false;
      const sanitizedSlotDay = sanitizeText(slot.day);
      const sanitizedTodayName = sanitizeText(dayName);
      console.log(`🧹 Comparing sanitized: "${sanitizedSlotDay}" vs "${sanitizedTodayName}"`);
      return sanitizedSlotDay.toLowerCase() === sanitizedTodayName.toLowerCase();
    });
    
    console.log('📍 Match result for', show.title, ':', todaySlot);
    
    if (todaySlot && todaySlot.startTime) {
      // Sanitize all time data before formatting
      const startTime = sanitizeText(todaySlot.startTime);
      const endTime = sanitizeText(todaySlot.endTime) || '';
      const amPm = sanitizeText(todaySlot.amPm) || '';
      
      console.log('🧹 Sanitized time components:', {
        startTime: `"${startTime}" (length: ${startTime.length})`,
        endTime: `"${endTime}" (length: ${endTime.length})`,
        amPm: `"${amPm}" (length: ${amPm.length})`
      });
      
      const formatted = endTime ? `${startTime} - ${endTime} ${amPm}`.trim() : `${startTime} ${amPm}`.trim();
      console.log('✅ Formatted time for', show.title, ':', `"${formatted}"`);
      return formatted;
    }
    
    // If no exact day match, return empty string to show "Time TBD"
    console.log('⚠️ No day match found for', show.title, ', showing TBD');
    return '';
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${now.getMinutes().toString().padStart(2, '0')}${ampm}`;
  };

  const isCurrentShow = (show: any) => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if there are any time slots
    if (!show.timeSlots || !Array.isArray(show.timeSlots) || show.timeSlots.length === 0) {
      return false;
    }

    // Try to find a slot that matches today's day name - using sanitized data
    const todaySlot = show.timeSlots.find((slot: any) => {
      if (!slot || !slot.day) return false;
      const sanitizedSlotDay = sanitizeText(slot.day);
      const sanitizedTodayName = sanitizeText(dayName);
      return sanitizedSlotDay.toLowerCase() === sanitizedTodayName.toLowerCase();
    });
    
    if (!todaySlot || !todaySlot.startTime) return false;
    
    // Parse start time and check if current time falls within show time - using sanitized data
    const sanitizedStartTime = sanitizeText(todaySlot.startTime);
    const sanitizedAmPm = sanitizeText(todaySlot.amPm);
    
    const startTime = parseInt(sanitizedStartTime);
    const isAM = sanitizedAmPm?.toLowerCase() === 'am';
    let adjustedStartTime = startTime;
    
    if (!isAM && startTime !== 12) {
      adjustedStartTime = startTime + 12;
    } else if (isAM && startTime === 12) {
      adjustedStartTime = 0;
    }
    
    return currentHour === adjustedStartTime;
  };

  if (loading) {
    return <div className="today-collection">Loading today's shows...</div>;
  }

  if (!shows.length) {
    return (
      <div className="today-collection">
        <h6>Playing on {dayName}</h6>
        <p>No shows scheduled for today.</p>
      </div>
    );
  }

  // Theme page layout when showTodayOnly is true
  if (showTodayOnly) {
    return (
      <div className={styles.column}>
        <h3 className={styles.sectionTitle}>Today - {dayName} Schedule</h3>
        {shows.map((show, idx) => {
          const showTime = getShowTime(show);
          const isCurrent = isCurrentShow(show);
          const displayTime = isCurrent ? 'NOW' : showTime;
          
          return (
            <div className={styles.scheduleItem} key={idx}>
              <div className={styles.scheduleTime}>
                {displayTime || 'Time TBD'}
              </div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>
                  <Link 
                    href={`/shows/${show.slug?.current || show.slug || ''}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {sanitizeText(show.title)}
                  </Link>
                </div>
                <div className={styles.showHost}>
                  {sanitizeText(show.introduction) || 'Radio show'}
                </div>
              </div>
              {show.showUrl && (
                <button 
                  className={styles.miniPlayButton}
                  onClick={() => handlePlayPause(idx, show.showUrl)}
                  aria-label={playingIndex === idx ? 'Pause' : 'Play'}
                  style={{
                    background: playingIndex === idx 
                      ? 'linear-gradient(135deg, #dc2626, #b91c1c)' 
                      : 'linear-gradient(135deg, var(--theme-primary, #ff6b6b), var(--theme-secondary, #ffa726))',
                    transform: playingIndex === idx ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {playingIndex === idx ? '❚❚' : '▶'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Original layout when showTodayOnly is false
  return (
    <div className="today-collection">
      <h6>Playing on {dayName}</h6>
      <div className="container">
        {shows.map((show, idx) => (
          <div className="on-today-item" key={idx}>
            <div
              className="on-today-event-title"
              style={{
                backgroundImage: show.image ? `url(${show.image})` : undefined,
                width: "100%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                minHeight: "80px",
                position: "relative"
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-8 col-xs-12" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {show.showUrl ? (
                      <button
                        onClick={() => handlePlayPause(idx, show.showUrl)}
                        style={{
                          background: playingIndex === idx 
                            ? 'linear-gradient(135deg, #dc2626, #b91c1c)' 
                            : 'linear-gradient(135deg, var(--theme-primary, #ff6b6b), var(--theme-secondary, #ffa726))',
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
                          boxShadow: playingIndex === idx 
                            ? '0 4px 12px rgba(220, 38, 38, 0.4)' 
                            : '0 2px 6px rgba(255, 107, 107, 0.3)',
                          transition: 'all 0.3s ease',
                          flexShrink: 0,
                          aspectRatio: '1/1',
                          transform: playingIndex === idx ? 'scale(1.1)' : 'scale(1)'
                        }}
                        aria-label={playingIndex === idx ? 'Pause' : 'Play'}
                      >
                        {playingIndex === idx ? '❚❚' : '▶'}
                      </button>
                    ) : (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #f97316, #ea580c)',
                          border: 'none',
                          borderRadius: '50%',
                          minWidth: '32px',
                          minHeight: '32px',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'white',
                          boxShadow: '0 2px 6px rgba(249, 115, 22, 0.3)',
                          flexShrink: 0,
                          aspectRatio: '1/1',
                          fontWeight: '600'
                        }}
                        title={getShowTime(show)}
                      >
                        {getShowTime(show).split(' - ')[0] || 'TIME'}
                      </div>
                    )}
                    <Link 
                      href={`/shows/${show.slug?.current || show.slug || ''}`}
                      className="tooltiplink"
                      style={{ 
                        fontSize: '85%', 
                          color: 'white', 
                          textShadow: '1px 1px 2px rgba(0,0,0,0.7)' 
                        }}
                        title={`${sanitizeText(show.title)} - ${sanitizeText(show.introduction) || ''}`}
                      >
                        {sanitizeText(show.title)}
                    </Link>
                    {show.djs && show.djs.length > 0 && (
                      <span style={{ 
                        fontSize: '75%', 
                        color: 'rgba(255,255,255,0.8)',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                      }}>
                        with {show.djs.join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="col-4 col-xs-12">
                    <span 
                      className="on-today-time"
                      style={{ 
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                        fontSize: '85%'
                      }}
                    >
                      {getShowTime(show)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowsOnTodaySanity;