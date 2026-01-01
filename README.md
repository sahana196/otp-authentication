# OTP Authentication System

A minimal, secure OTP-based authentication system built with Node.js, Express, and React.

## Features
- **OTP Generation & Validation**: Secure 6-digit numeric OTPs.
- **Security**: 
    - 5-minute OTP expiry.
    - Max 3 attempts per OTP.
    - 10-minute account block after 3 failed attempts.
- **Frontend**: Clean, responsive UI with React and Vite.
- **Backend**: In-memory data store for simplicity and speed.

## Prerequisites
- Node.js (v16+ recommended)
- npm

## Installation & Setup

### 1. Backend
```bash
cd backend
npm install
node server.js
```
Server runs at `http://localhost:3000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

## usage
1. Enter your email/phone in the specific login screen.
2. Check the **Backend Terminal** for the generated OTP (Mock SMS).
3. Enter the OTP in the frontend.
4. Upon success, you are redirected to the Welcome page.

## API Endpoints
- `POST /auth/request-otp`: Request a new OTP.
- `POST /auth/verify-otp`: Verify OTP and receive session token.
- `GET /auth/me`: Get current user info (requires Bearer token).

## Assumptions
- **Persistence**: OTPs and Blocks are stored in-memory. Restarting the server clears all state (unblocks users, deletes OTPs).
- **Transport**: OTP sending is mocked (logged to console) instead of using an actual SMS/Email provider.
- **Session**: A simple mock token strategy is used instead of signed JWTs (as per requirements).
- **Security**: This is a proof-of-concept. For production, replace in-memory store with Redis/DB and use a real SMS provider.

## Tech Stack
- **Frontend**: React, Vite, CSS.
- **Backend**: Node.js, Express.

## Screenshots
![Screenshot 1](output%20screenshots/Screenshot%20(415).png)
![Screenshot 2](output%20screenshots/Screenshot%20(416).png)
![Screenshot 4](output%20screenshots/Screenshot%20(419).png)
![Screenshot 5](output%20screenshots/Screenshot%20(420).png)
![Screenshot 6](output%20screenshots/Screenshot%20(421).png)
![Screenshot 7](output%20screenshots/Screenshot%20(424).png)
