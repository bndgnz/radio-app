const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-11',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function checkData() {
  try {
    console.log('Checking showSlot documents...');
    const showSlots = await client.fetch(`*[_type == "showSlot"][0...5]{...}`);
    console.log('ShowSlots found:', showSlots.length);
    console.log(JSON.stringify(showSlots, null, 2));

    console.log('\nChecking shows with timeSlots...');
    const shows = await client.fetch(`*[_type == "shows" && defined(timeSlots)][0...3]{
      title,
      timeSlots[]-> {
        day,
        startTime,
        endTime,
        amPm
      }
    }`);
    console.log('Shows with timeSlots:', shows.length);
    console.log(JSON.stringify(shows, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

checkData();