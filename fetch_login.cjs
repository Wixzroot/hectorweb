const https = require('https');
https.get('https://developers.whmcs.com/api-reference/validatelogin/', res => {
  let d = '';
  res.on('data', c => d+=c);
  res.on('end', () => {
    const lines = d.split('\n');
    lines.forEach((line, i) => {
      if (line.toLowerCase().includes('email') || line.toLowerCase().includes('password')) {
         console.log(`L${i}: ${line.trim()}`);
      }
    });
  });
}).on('error', console.error);
