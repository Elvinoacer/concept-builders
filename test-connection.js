const https = require('https');
const dns = require('dns');

const hostname = 'oauth2.googleapis.com';

dns.lookup(hostname, { all: true }, (err, addresses) => {
  if (err) {
    console.error('DNS lookup failed:', err);
    return;
  }
  console.log('DNS lookup successful. Addresses:', addresses);

  const options = {
    hostname: hostname,
    port: 443,
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('Attempting to connect to Google...');

  const req = https.request(options, (res) => {
    console.log('Connection successful!');
    console.log('statusCode:', res.statusCode);
  });

  req.on('error', (e) => {
    console.error('Connection failed:');
    console.error(e);
  });

  req.on('timeout', () => {
      console.error('Connection timed out.');
      req.destroy();
  });

  req.setTimeout(10000); // 10 second timeout
  req.end();
});