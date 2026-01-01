import { useState, useEffect } from 'react';
import { requestOtp, verifyOtp, fetchUser } from './api';

function App() {
  const [view, setView] = useState('LOGIN');

  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchUser(token)
        .then((data) => {
          setUser(data.user);
          setView('WELCOME');
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await requestOtp(identifier);
      setView('OTP');
      setMessage(`OTP sent to ${identifier}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await verifyOtp(identifier, otp);
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);

      const userData = await fetchUser(data.token);
      setUser(userData.user);
      setView('WELCOME');
    } catch (err) {
      setError(err.message);
      if (err.attemptsRemaining !== undefined) {
        setError(`${err.message}. Attempts remaining: ${err.attemptsRemaining}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setIdentifier('');
    setOtp('');
    setView('LOGIN');
    setError('');
    setMessage('');
  };

  if (view === 'WELCOME' && user) {
    return (
      <div className="container fade-in">
        <div className="card welcome-card">
          <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h1>Welcome Back!</h1>
          <p>You have successfully authenticated. You are logged in as:</p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontWeight: '600' }}>
            {user.identifier}
          </div>
          <button onClick={logout} className="btn secondary">Logout from session</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="card">
        {view === 'LOGIN' ? (
          <>
            <h2>Welcome</h2>
            <p>Enter your email or phone number to receive a one-time password.</p>
          </>
        ) : (
          <>
            <h2>Verify Identity</h2>
            <p>We've sent a 6-digit code to <strong>{identifier}</strong></p>
          </>
        )}

        {error && (
          <div className="alert error">
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            {error}
          </div>
        )}
        {message && (
          <div className="alert success">
            <span style={{ fontSize: '1.2rem' }}>✅</span>
            {message}
          </div>
        )}

        {view === 'LOGIN' ? (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label>Email or Phone Number</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com"
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
              {!loading && <span style={{ marginLeft: '4px' }}>→</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="0 0 0 0 0 0"
                style={{ textAlign: 'center', letterSpacing: '0.5em', fontWeight: '700', fontSize: '1.25rem' }}
                maxLength={6}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              type="button"
              className="btn link"
              onClick={() => { setView('LOGIN'); setError(''); }}
              disabled={loading}
            >
              ← Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
