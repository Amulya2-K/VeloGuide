import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function GuideLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/guides/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('guideToken', response.data.token);
        navigate('/guide-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication node unreachable.');
    }
  };

  return (
    <div style={styles.card}>
      <h2>Unemployed Local Guide Portal</h2>
      <p style={styles.sub}>Securely log in to access your dashboard configuration and claim active tourist logs.</p>
      
      <form onSubmit={handleLogin}>
        {error && <div style={styles.errorBox}>❌ {error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Registered Email Address</label>
          <input 
            type="email" 
            required 
            placeholder="e.g. guide@localhub.org" 
            style={styles.input} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div style={styles.group}>
          <label style={styles.label}>Security Password</label>
          <input 
            type="password" 
            required 
            placeholder="Enter your secret password" 
            style={styles.input} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" style={styles.btn}>Authorize Secure Session</button>
      </form>

      <div style={styles.registerPrompt}>
        Don't have an onboarding profile?{' '}
        <Link to="/register/guide" style={styles.link}>
          Sign Up / Register Here
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: { maxWidth: '400px', margin: '40px auto', backgroundColor: 'rgba(255, 255, 255, 0.96)', padding: '35px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.2)' },
  sub: { color: '#555', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' },
  group: { marginBottom: '18px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#333' },
  input: { width: '100%', padding: '12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', outline: 'none' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '15px' },
  errorBox: { backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', fontWeight: '500', border: '1px solid #f5c6cb' },
  registerPrompt: { marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#444', borderTop: '1px solid #eee', paddingTop: '15px' },
  link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }
};