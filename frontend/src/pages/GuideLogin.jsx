import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function GuideLogin() {
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
      const response = await axios.post('http://localhost:5000/api/auth/guides/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('guideToken', response.data.token);
        localStorage.setItem('guideUser', JSON.stringify(response.data.user));
        navigate('/guide-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Guide authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Local Guide Portal</h2>
      <p style={styles.sub}>Log in to access your tour assignments desk and manage incoming tourist bookings.</p>
      
      <form onSubmit={handleLogin}>
        {error && <div style={styles.errorBox}>❌ {error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Registered Guide Email</label>
          <input 
            type="email" 
            required 
            placeholder="e.g. guide@veloguide.com" 
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
          {loading ? 'Authenticating...' : 'Access Guide Dashboard'}
        </button>
      </form>

      <div style={styles.registerPrompt}>
        Don't have a guide profile?{' '}
        <Link to="/register/guide" style={styles.link}>
          Register as Local Guide
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: { maxWidth: '420px', margin: '40px auto', backgroundColor: 'rgba(30, 41, 59, 0.75)', backdropFilter: 'blur(16px)', padding: '36px', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' },
  title: { fontSize: '24px', color: '#fff', marginBottom: '8px' },
  sub: { color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.4' },
  group: { marginBottom: '18px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '14px', outline: 'none' },
  btn: { width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '10px', fontSize: '15px' },
  errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '18px', fontSize: '13px', border: '1px solid rgba(239, 68, 68, 0.4)' },
  registerPrompt: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }
};