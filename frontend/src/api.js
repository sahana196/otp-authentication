export const API_URL = 'http://localhost:3000/auth';

export const requestOtp = async (identifier) => {
    const response = await fetch(`${API_URL}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error requesting OTP');
    }
    return data;
};

export const verifyOtp = async (identifier, otp) => {
    const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
    });

    const data = await response.json();
    if (!response.ok) {
        const error = new Error(data.message || 'Error verifying OTP');
        if (data.attemptsRemaining !== undefined) {
            error.attemptsRemaining = data.attemptsRemaining;
        }
        throw error;
    }
    return data;
};

export const fetchUser = async (token) => {
    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error fetching user');
    }
    return data;
};
