const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/stream',
  method: 'GET',
  headers: {
    'User-Agent': 'probe/1.0'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  console.log('CONTENT-TYPE', res.headers['content-type']);
  req.abort();
});

req.on('error', (e) => {
  console.error('ERROR', e && e.message ? e.message : e);
});

req.end();