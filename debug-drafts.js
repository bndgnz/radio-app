const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '7nd9afqv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});

async function analyzeDrafts() {
  console.log('=== ANALYZING DRAFT VS PUBLISHED PODCASTS ===\n');

  // Get all amazonPodcast documents
  const allPodcasts = await client.fetch(`*[_type == "amazonPodcast"]{
    _id,
    title,
    date,
    "isDraft": _id in path("drafts.**")
  }`);

  console.log(`Total amazonPodcast documents: ${allPodcasts.length}`);

  // Count drafts vs published
  const drafts = allPodcasts.filter(p => p.isDraft);
  const published = allPodcasts.filter(p => !p.isDraft);

  console.log(`\nDrafts: ${drafts.length}`);
  console.log(`Published: ${published.length}`);

  // Show some examples of draft IDs
  console.log('\n=== SAMPLE DRAFT IDS ===');
  drafts.slice(0, 10).forEach(draft => {
    console.log(`${draft._id} - "${draft.title || 'Untitled'}" - ${draft.date || 'No date'}`);
  });

  // Show some examples of published IDs  
  console.log('\n=== SAMPLE PUBLISHED IDS ===');
  published.slice(0, 10).forEach(pub => {
    console.log(`${pub._id} - "${pub.title || 'Untitled'}" - ${pub.date || 'No date'}`);
  });

  // Test the specific queries our component uses
  console.log('\n=== TESTING COMPONENT QUERIES ===');

  const publishedQuery = await client.fetch(`*[_type == "amazonPodcast" && !(_id in path("drafts.**"))] | order(date desc){
    _id,
    title,
    date,
    "isDraft": _id in path("drafts.**")
  }`);

  const draftsQuery = await client.fetch(`*[_type == "amazonPodcast" && _id in path("drafts.**")] | order(date desc){
    _id,
    title,
    date,
    "isDraft": _id in path("drafts.**")
  }`);

  console.log(`Published query result: ${publishedQuery.length} items`);
  console.log(`Drafts query result: ${draftsQuery.length} items`);

  // Show patterns in draft IDs
  console.log('\n=== DRAFT ID PATTERNS ===');
  const draftPatterns = {};
  drafts.forEach(draft => {
    if (draft._id.startsWith('drafts.')) {
      const pattern = draft._id.split('.')[1]?.substring(0, 10) || 'unknown';
      draftPatterns[pattern] = (draftPatterns[pattern] || 0) + 1;
    }
  });

  Object.entries(draftPatterns).slice(0, 10).forEach(([pattern, count]) => {
    console.log(`${pattern}...: ${count} items`);
  });
}

analyzeDrafts().catch(console.error);