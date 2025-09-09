// Network monitoring script for Sanity navigation analysis
console.log('🌐 NETWORK MONITORING STARTED');

// Intercept fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  const options = args[1] || {};
  
  if (url.includes('sanity') || url.includes('doc') || url.includes('structure')) {
    console.log('🔗 FETCH REQUEST:', {
      url: url,
      method: options.method || 'GET',
      body: options.body,
      headers: options.headers
    });
  }
  
  return originalFetch.apply(this, args).then(response => {
    if (url.includes('sanity') || url.includes('doc') || url.includes('structure')) {
      console.log('✅ FETCH RESPONSE:', {
        url: url,
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  });
};

// Intercept XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  if (url.includes('sanity') || url.includes('doc') || url.includes('structure')) {
    console.log('📡 XHR REQUEST:', {
      method: method,
      url: url
    });
  }
  return originalXHROpen.call(this, method, url, ...args);
};

console.log('✅ Network monitoring active. Click on documents to see requests.');