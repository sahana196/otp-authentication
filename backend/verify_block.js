// Node fetch removed to use native http

// If node-fetch is not there, we can use http.
// Actually, let's use standard http to be dependency-free in this script.
const http = require('http');

const data = JSON.stringify({ identifier: 'verify-logic-user', otp: '000000' });

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/auth/verify-otp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`BODY: ${body}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
