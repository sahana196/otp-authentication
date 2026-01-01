# Simple Architecture Overview

This project is a simple **OTP (One-Time Password) Authentication System**. It has two main parts that talk to each other.

## 1. The Frontend (Client)
*   **What it is:** The visual part of the app that you see in your browser.
*   **Built with:** React (a popular JavaScript library) and Vite (makes it fast).
*   **What it does:**
    *   Shows the "Login" and "Verify OTP" screens.
    *   Takes your email/phone and OTP code.
    *   Sends them to the server.
    *   Remembers you are logged in using a "token".

## 2. The Backend (Server)
*   **What it is:** The brain of the app that runs behind the scenes.
*   **Built with:** Node.js and Express.
*   **What it does:**
    *   **Generates OTPs:** Creates a random 6-digit number.
    *   **"Sends" OTP:** Since this is a demo, it just prints the code to the server console (CMD/Terminal) so you can copy it.
    *   **Verifies OTP:** Checks if the code you entered matches the one it created.
    *   **Security:** If you enter the wrong code 3 times, it blocks you for 10 minutes to prevent guessing.

## How They Talk
The Frontend sends messages (HTTP requests) to the Backend like:
1.  "Hey, send an OTP to `user@example.com`"
2.  "Here is the code `123456` for `user@example.com`, is it right?"

If the code is right, the Backend says "Yes!" and gives a special key (token) so the Frontend knows the user is safe.
