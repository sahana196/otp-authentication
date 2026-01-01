const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function request(path, method, body, headers = {}) {
    const url = new URL(path, BASE_URL);
    const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, body: json });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting Backend Verification ---');

    const testUser = `test-user-${Date.now()}@example.com`;


    console.log(`\nTest 1: Requesting OTP for ${testUser}...`);
    const reqRes = await request('/auth/request-otp', 'POST', { identifier: testUser });
    console.log('Status:', reqRes.status);
    console.log('Body:', reqRes.body);

    if (reqRes.status !== 200) {
        console.error('FAILED: Status should be 200');
        process.exit(1);
    }




    console.log('\nTest 2: Verifying with WRONG OTP (Attempt 1)...');
    let verifyRes = await request('/auth/verify-otp', 'POST', { identifier: testUser, otp: '000000' });
    console.log('Status:', verifyRes.status);
    console.log('Body:', verifyRes.body);
    if (verifyRes.status !== 401 || verifyRes.body.attemptsRemaining !== 2) {
        console.error('FAILED: Status should be 401 and attemptsRemaining should be 2');
    }


    console.log('\nTest 3: Verifying with WRONG OTP (Attempt 2)...');
    verifyRes = await request('/auth/verify-otp', 'POST', { identifier: testUser, otp: '000000' });
    console.log('Status:', verifyRes.status);
    console.log('Body:', verifyRes.body);
    if (verifyRes.status !== 401 || verifyRes.body.attemptsRemaining !== 1) {
        console.error('FAILED: Status should be 401 and attemptsRemaining should be 1');
    }


    console.log('\nTest 4: Verifying with WRONG OTP (Attempt 3 - BLOCK)...');
    verifyRes = await request('/auth/verify-otp', 'POST', { identifier: testUser, otp: '000000' });
    console.log('Status:', verifyRes.status);
    console.log('Body:', verifyRes.body);
    if (verifyRes.status !== 403 || !verifyRes.body.message.includes('blocked')) {
        console.error('FAILED: Status should be 403 and message should include "blocked"');
    }


    console.log('\nTest 5: Requesting OTP while BLOCKED...');
    const blockedReqRes = await request('/auth/request-otp', 'POST', { identifier: testUser });
    console.log('Status:', blockedReqRes.status);
    console.log('Body:', blockedReqRes.body);
    if (blockedReqRes.status !== 403 || !blockedReqRes.body.message.includes('blocked')) {
        console.error('FAILED: Status should be 403 and message should include "blocked"');
    }

    console.log('\n--- Backend Verification Completed ---');
}

runTests().catch(console.error);
