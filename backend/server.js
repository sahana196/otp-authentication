const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Log all requests
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);

    // Strip Content-Type for GET requests to prevent express.json() from parsing body
    if (req.method === 'GET') {
        delete req.headers['content-type'];
    }

    next();
});

app.use(express.json());

app.use((err, req, res, next) => {
    console.error('[Middleware Error]', err); // Log the error to console
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON payload provided. Please check your request body (Make sure to select "None" in Body tab for GET requests).' });
    }
    next(err);
});

const otpStore = {};

const BLOCK_DURATION = 10 * 60 * 1000;
const OTP_EXPIRY = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;

const isBlocked = (identifier) => {
    const data = otpStore[identifier];
    if (data && data.blockedUntil && data.blockedUntil > Date.now()) {
        return true;
    }
    return false;
};

app.post('/auth/request-otp', (req, res) => {
    const { identifier } = req.body;

    if (!identifier) {
        return res.status(400).json({ message: 'Identifier (email/phone) is required' });
    }

    if (isBlocked(identifier)) {
        const remainingTime = Math.ceil((otpStore[identifier].blockedUntil - Date.now()) / 1000);
        return res.status(403).json({ message: `Account blocked. Try again in ${remainingTime} seconds.` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[identifier] = {
        otp,
        expiresAt: Date.now() + OTP_EXPIRY,
        attempts: 0,
        blockedUntil: null,
    };

    console.log(`[OTP] Sending OTP to ${identifier}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
});

app.post('/auth/verify-otp', (req, res) => {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
        return res.status(400).json({ message: 'Identifier and OTP are required' });
    }

    if (isBlocked(identifier)) {
        const remainingTime = Math.ceil((otpStore[identifier].blockedUntil - Date.now()) / 1000);
        return res.status(403).json({ message: `Account blocked. Try again in ${remainingTime} seconds.` });
    }

    const data = otpStore[identifier];

    if (!data || !data.otp) {
        return res.status(400).json({ message: 'No OTP request found for this identifier' });
    }

    if (Date.now() > data.expiresAt) {
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (data.otp !== otp) {
        data.attempts += 1;

        if (data.attempts >= MAX_ATTEMPTS) {
            data.blockedUntil = Date.now() + BLOCK_DURATION;
            return res.status(403).json({ message: 'Too many failed attempts. Account blocked for 10 minutes.' });
        }

        return res.status(401).json({ message: 'Invalid OTP', attemptsRemaining: MAX_ATTEMPTS - data.attempts });
    }

    delete otpStore[identifier];

    const token = `mock-token-${identifier}-${Date.now()}`;

    res.json({ token, message: 'Authentication successful' });
});

app.get('/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!token.startsWith('mock-token-')) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const identifier = token.substring(11, token.lastIndexOf('-'));

    res.json({ user: { identifier } });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
