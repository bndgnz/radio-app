// Script to analyze how Sanity Studio navigation works
// Run this in the browser console when in Sanity Studio

console.log('=== SANITY STUDIO NAVIGATION ANALYSIS ===');

// Monitor URL changes
let lastUrl = window.location.href;
setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    console.log('🔗 URL Changed:');
    console.log('  From:', lastUrl);
    console.log('  To:  ', currentUrl);
    console.log('  Path:', window.location.pathname);
    console.log('  Hash:', window.location.hash);
    console.log('---');
    lastUrl = currentUrl;
  }
}, 100);

// Monitor router state if available
if (window.sanityRouter) {
  console.log('📍 Current Router State:', window.sanityRouter.state);
}

// Monitor clicks on document links
document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-as="a"], a');
  if (target && target.href) {
    console.log('🖱️ Document Link Clicked:');
    console.log('  Target:', target);
    console.log('  Href:', target.href);
    console.log('  Data attributes:', target.dataset);
  }
}, true);

console.log('Navigation monitoring started. Click on document items to see how they navigate.');