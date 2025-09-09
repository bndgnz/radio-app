const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3006,
    path: '/api/shows-today',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('API Response:');
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.shows && parsed.shows.length > 0) {
          console.log('\nFirst show time slots:');
          console.log(JSON.stringify(parsed.shows[0].timeSlots, null, 2));
        }
      } catch (error) {
        console.error('Error parsing response:', error);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.end();
}

testAPI();