import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GuideRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    assignedCity: '', 
    languages: 'English, Hindi', 
    hourlyRate: 500,
    specialties: 'History, Street Food',
    experienceYears: 3,
    bio: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/guides/register', formData);
      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error to the guide registration service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>Guide Onboarding Portal</h2>
      <p style={styles.subtitle}>Register your local guide profile to start receiving tourist tour requests.</p>

      {submitted ? (
        <div style={styles.successBox}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <h3>Registration Successful!</h3>
          <p style={{ color: '#cbd5e1', margin: '10px 0 20px 0' }}>Your guide profile is now active on VeloGuide.</p>
          <div>
            <Link to="/login/guide" style={styles.loginLink}>Go to Guide Login →</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          {error && <div style={styles.errorBox}>❌ {error}</div>}

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input type="text" required placeholder="e.g. Aarav Sharma" style={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" placeholder="e.g. guide@example.com" required style={styles.input} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" placeholder="Create secure password" required style={styles.input} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Service Location City</label>
              <input 
                type="text" 
                placeholder="e.g. Mumbai, Fort Kochi, Goa, Udaipur" 
                required 
                style={styles.input} 
                value={formData.assignedCity} 
                onChange={e => setFormData({...formData, assignedCity: e.target.value})} 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Languages Spoken</label>
              <input type="text" placeholder="e.g. English, Hindi, Marathi" required style={styles.input} value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Hourly Rate (INR ₹)</label>
              <input type="number" placeholder="500" required style={styles.input} value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Specialties / Tour Focus</label>
              <input type="text" placeholder="e.g. Food Walks, Architecture, Treks" required style={styles.input} value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value})} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Years of Experience</label>
              <input type="number" placeholder="3" required style={styles.input} value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} />
            </div>
          </div>

          <div style={{ ...styles.formGroup, marginTop: '14px' }}>
            <label style={styles.label}>Bio / Introduction</label>
            <textarea 
              rows="3" 
              placeholder="Tell travelers about your local knowledge and what makes your tours special..." 
              style={{ ...styles.input, resize: 'none' }} 
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating Profile...' : 'Complete Registration & Save Profile'}
          </button>
        </form>
      )}

      <div style={styles.footerPrompt}>
        Already registered as a guide?{' '}
        <Link to="/login/guide" style={styles.link}>
          Log In Here
        </Link>
      </div>
    </div>
  );
}

const styles = {
  formContainer: { maxWidth: '650px', margin: '40px auto', backgroundColor: 'rgba(30, 41, 59, 0.75)', backdropFilter: 'blur(16px)', padding: '36px', borderRadius: '20px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' },
  title: { margin: '0 0 6px 0', fontSize: '26px', color: '#fff' },
  subtitle: { fontSize: '14px', color: '#94a3b8', marginBottom: '28px', lineHeight: '1.4' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#cbd5e1' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '14px', outline: 'none' },
  submitBtn: { width: '100%', padding: '14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', marginTop: '20px' },
  successBox: { textAlign: 'center', padding: '30px 20px', color: '#34d399' },
  loginLink: { display: 'inline-block', padding: '12px 24px', backgroundColor: '#4f46e5', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: '700' },
  errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '18px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.4)' },
  footerPrompt: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }
};