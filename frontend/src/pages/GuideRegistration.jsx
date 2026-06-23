import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function GuideRegistration() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    assignedCity: 'Mumbai', 
    languages: '', 
    policeClearanceId: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/guides/register', formData);
      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error to the registration service.');
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>Guide Onboarding Portal</h2>
      <p style={styles.subtitle}>Please fill out all security credentials below to register your account.</p>

      {submitted ? (
        <div style={styles.successBox}>
          <h3>Registration Successful! 🎉</h3>
          <p style={{ color: '#333' }}>Your secure profile has been verified and saved.</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/login/guide" style={styles.loginLink}>Go to Guide Login →</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          {error && <div style={styles.errorBox}>❌ {error}</div>}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" required placeholder="Enter full name" style={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" placeholder="e.g. name@example.com" required style={styles.input} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Account Password</label>
            <input type="password" placeholder="Create a secure password" required style={styles.input} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Target City Domain</label>
            <select style={styles.input} value={formData.assignedCity} onChange={e => setFormData({...formData, assignedCity: e.target.value})}>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Goa">Goa</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Languages Spoken</label>
            <input type="text" placeholder="e.g. English, Hindi" required style={styles.input} value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Police Clearance Token ID</label>
            <input type="text" placeholder="PCR-XXXXX" required style={styles.input} value={formData.policeClearanceId} onChange={e => setFormData({...formData, policeClearanceId: e.target.value})} />
          </div>

          <button type="submit" style={styles.submitBtn}>Verify & Save to Registry</button>
        </form>
      )}
    </div>
  );
}

const styles = {
  formContainer: { maxWidth: '480px', margin: '40px auto', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '35px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' },
  title: { margin: '0 0 5px 0', fontSize: '24px', color: '#333' },
  subtitle: { fontSize: '13px', color: '#666', marginBottom: '20px', lineHeight: '1.4' },
  formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', fontWeight: '600', color: '#444', marginBottom: '5px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  successBox: { textAlign: 'center', padding: '20px', color: '#155724' },
  loginLink: { display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' },
  errorBox: { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }
};