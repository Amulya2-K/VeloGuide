import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function TouristRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/tourists/register', formData);

      if (response.data.success) {
        localStorage.setItem('touristToken', response.data.token);
        localStorage.setItem('touristUser', JSON.stringify(response.data.user));
        navigate('/explore');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Create Tourist Account</h2>
      <p style={styles.sub}>Join VeloGuide to plan AI trips and book verified local guides.</p>
      
      <form onSubmit={handleRegister}>
        {error && <div style={styles.errorBox}>❌ {error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Full Name</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Jane Doe" 
            style={styles.input} 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Email Address</label>
          <input 
            type="email" 
            required 
            placeholder="e.g. jane@example.com" 
            style={styles.input} 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        
        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            required 
            placeholder="Create password" 
            style={styles.input} 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Contact Phone Number</label>
          <input 
            type="tel" 
            placeholder="+91 98765 43210" 
            style={styles.input} 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Creating Account...' : 'Register & Start Exploring'}
        </button>
      </form>

      <div style={styles.footerPrompt}>
        Already have an account?{' '}
        <Link to="/login/tourist" style={styles.link}>
          Log In Here
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
  errorBox: { 
    backgroundColor: 'rgba(239, 68, 68, 0.2)', 
    color: '#fca5a5', 
    padding: '12px', 
    borderRadius: '8px', 
    marginBottom: '18px', 
    fontSize: '13px', 
    border: '1px solid rgba(239, 68, 68, 0.4)' 
  },
  footerPrompt: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }
};
