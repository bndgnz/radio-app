import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '@/src/lib/sanity.client';
import { sanitizeText } from '@/src/utils/textSanitizer';
import groq from 'groq';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get current day
    const weekday = [
      "Sunday",
      "Monday", 
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const dayName = weekday[today.getDay()];

    // Query for shows that are scheduled for today
    const query = groq`*[_type == "shows" && defined(timeSlots)] {
      title,
      "slug": slug.current,
      introduction,
      "image": image.asset->url,
      "djs": dj[]->title,
      timeSlots[]-> {
        day,
        startTime,
        endTime,
        amPm
      },
      playlistUrl,
      showUrl
    }`;

    const allShows = await sanityClient.fetch(query);
    
    // Sanitize all text data to remove zero-width characters
    const sanitizeShowData = (shows: any[]) => {
      return shows.map((show: any) => ({
        ...show,
        title: sanitizeText(show.title || ''),
        introduction: sanitizeText(show.introduction || ''),
        djs: show.djs?.map((dj: string) => sanitizeText(dj || '')) || [],
        timeSlots: show.timeSlots?.map((slot: any) => ({
          ...slot,
          day: sanitizeText(slot?.day || ''),
          startTime: sanitizeText(slot?.startTime || ''),
          endTime: sanitizeText(slot?.endTime || ''),
          amPm: sanitizeText(slot?.amPm || '')
        })) || []
      }));
    };

    const sanitizedShows = sanitizeShowData(allShows);
    
    // Debug logging to see what we have AFTER sanitization
    console.log('DEBUG: Total shows with timeSlots:', sanitizedShows.length);
    console.log('DEBUG: Looking for day:', dayName);
    
    // Test the sanitization is working
    if (sanitizedShows.length > 0) {
      const firstShow = sanitizedShows[0];
      console.log('SANITIZATION TEST:');
      console.log('  Original title length:', allShows[0]?.title?.length || 0);
      console.log('  Sanitized title length:', firstShow.title?.length || 0);
      console.log('  First time slot day original:', allShows[0]?.timeSlots?.[0]?.day?.length || 0);
      console.log('  First time slot day sanitized:', firstShow.timeSlots?.[0]?.day?.length || 0);
    }
    
    sanitizedShows.slice(0, 2).forEach((show: any, index: number) => {
      console.log(`DEBUG: Show ${index + 1}: "${show.title}" (length: ${show.title?.length})`);
      console.log('  timeSlots:', show.timeSlots?.map((slot: any) => ({
        day: `"${slot?.day}" (${slot?.day?.length})`,
        startTime: `"${slot?.startTime}" (${slot?.startTime?.length})`,
        endTime: slot?.endTime,
        amPm: slot?.amPm
      })));
    });
    
    // Filter shows for today
    const todaysShows = sanitizedShows.filter((show: any) => 
      show.timeSlots?.some((slot: any) => 
        slot.day?.toLowerCase() === dayName.toLowerCase()
      )
    );
    
    console.log('DEBUG: Shows found for today:', todaysShows.length);

    res.status(200).json({
      dayName,
      shows: todaysShows
    });
  } catch (error) {
    console.error('Error fetching today\'s shows:', error);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
}