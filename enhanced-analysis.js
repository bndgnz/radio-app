// Enhanced Sanity Studio Navigation Analysis
console.log('🔍 ENHANCED NAVIGATION ANALYSIS STARTED');

// Capture all events that might trigger navigation
const events = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup'];

events.forEach(eventType => {
  document.addEventListener(eventType, (event) => {
    const target = event.target;
    const closest = target.closest('[data-ui="Button"], [data-ui="Card"], a, button, [role="button"], [tabindex="0"]');
    
    if (closest) {
      console.log(`📍 ${eventType.toUpperCase()} Event:`, {
        target: target.tagName,
        closest: closest.tagName,
        'data-ui': closest.getAttribute('data-ui'),
        'data-as': closest.getAttribute('data-as'),
        href: closest.href,
        onclick: closest.onclick ? 'has onclick' : 'no onclick',
        textContent: closest.textContent?.trim().substring(0, 50) + '...',
        classList: Array.from(closest.classList),
        dataset: closest.dataset
      });
    }
  }, true);
});

// Monitor browser history API calls
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  console.log('📋 history.pushState called:', args);
  return originalPushState.apply(this, args);
};

history.replaceState = function(...args) {
  console.log('🔄 history.replaceState called:', args);
  return originalReplaceState.apply(this, args);
};

// Monitor popstate events
window.addEventListener('popstate', (event) => {
  console.log('⬅️ popstate event:', event.state);
});

// Monitor URL changes more aggressively
let currentUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    console.log('🌐 URL CHANGED:');
    console.log('  FROM:', currentUrl);
    console.log('  TO  :', window.location.href);
    console.log('  PATH:', window.location.pathname);
    console.log('  HASH:', window.location.hash);
    currentUrl = window.location.href;
  }
});

urlObserver.observe(document, { subtree: true, childList: true });

// Check for React Router or other routing libraries
setTimeout(() => {
  console.log('🔧 Checking for routing systems:');
  console.log('  React Router:', window.ReactRouter ? 'Found' : 'Not found');
  console.log('  Next Router:', window.next?.router ? 'Found' : 'Not found');
  console.log('  Sanity Router:', window.sanityRouter ? 'Found' : 'Not found');
  
  // Look for Sanity-specific objects
  const sanityGlobals = Object.keys(window).filter(key => key.toLowerCase().includes('sanity'));
  console.log('  Sanity globals:', sanityGlobals);
}, 1000);

console.log('✅ Enhanced monitoring active. Try clicking on Amazon Podcasts and individual items.');