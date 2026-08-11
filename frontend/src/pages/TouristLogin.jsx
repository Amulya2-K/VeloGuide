import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function TouristLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/tourists/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('touristToken', response.data.token);
        localStorage.setItem('touristUser', JSON.stringify(response.data.user));
        navigate('/explore');
      }
    } catch (err) {
      if (email && !password) {
        const guestUser = { name: email.split('@')[0] || 'Traveler', email, role: 'tourist' };
        localStorage.setItem('touristUser', JSON.stringify(guestUser));
        navigate('/explore');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials or connection error.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGuestAccess = () => {
    const guestUser = { name: 'Guest Traveler', email: 'guest@veloguide.com', role: 'tourist' };
    localStorage.setItem('touristUser', JSON.stringify(guestUser));
    navigate('/explore');
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Tourist Access Portal</h2>
      <p style={styles.sub}>Log in to access your saved AI itineraries and book local guides.</p>
      
      <form onSubmit={handleLogin}>
        {error && <div style={styles.errorBox}>❌ {error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Email Address</label>
          <input 
            type="email" 
            required 
            placeholder="e.g. traveler@example.com" 
            style={styles.input} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        
        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            required
            placeholder="Enter password" 
            style={styles.input} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Authenticating...' : 'Log In & Explore Destinations'}
        </button>

        <button type="button" onClick={handleQuickGuestAccess} style={styles.guestBtn}>
          ⚡ Continue as Guest Traveler
        </button>
      </form>

      <div style={styles.registerPrompt}>
        Don't have a tourist account?{' '}
        <Link to="/register/tourist" style={styles.link}>
          Register Here
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: { 
    maxWidth: '420px', 
    margin: '40px auto', 
    backgroundColor: 'rgba(30, 41, 59, 0.75)', 
    backdropFilter: 'blur(16px)',
    padding: '36px', 
    borderRadius: '16px', 
    boxShadow: '0 12px 32px rgba(0,0,0,0.3)', 
    border: '1px solid rgba(255,255,255,0.1)' 
  },
  title: { fontSize: '24px', color: '#fff', marginBottom: '8px' },
  sub: { color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.4' },
  group: { marginBottom: '18px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' },
  input: { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid rgba(255,255,255,0.15)', 
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    color: '#fff', 
    fontSize: '14px', 
    outline: 'none' 
  },
  btn: { 
    width: '100%', 
    padding: '14px', 
    backgroundColor: '#4f46e5', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    marginTop: '10px', 
    fontSize: '15px' 
  },
  guestBtn: { 
    width: '100%', 
    padding: '12px', 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    color: '#f8fafc', 
    border: '1px solid rgba(255, 255, 255, 0.15)', 
    borderRadius: '8px', 
    fontWeight: '600', 
    cursor: 'pointer', 
    marginTop: '10px', 
    fontSize: '13px' 
  },
  errorBox: { 
    backgroundColor: 'rgba(239, 68, 68, 0.2)', 
    color: '#fca5a5', 
    padding: '12px', 
    borderRadius: '8px', 
    marginBottom: '18px', 
    fontSize: '13px', 
    border: '1px solid rgba(239, 68, 68, 0.4)' 
  },
  registerPrompt: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }
};