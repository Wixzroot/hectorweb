const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/whmcs/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Test:', data));
});

req.write(JSON.stringify({
  email: 'johbnnkk5@example.com',
  password: 'Password123'
}));
req.end();
