import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TouristLogin() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/explore');
  };

  return (
    <div style={styles.card}>
      <h2>Tourist Access Portal</h2>
      <p style={styles.sub}>Enter details to walk through places and secure local guide assistance.</p>
      
      <form onSubmit={handleLogin}>
        <div style={styles.group}>
          <label style={styles.label}>Full Name</label>
          <input type="text" required placeholder="e.g. Jane Doe" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Contact Number (For Police Log Syncing)</label>
          <input type="tel" required placeholder="+91 XXXXX XXXXX" style={styles.input} />
        </div>
        <button type="submit" style={styles.btn}>Log In & View Destinations</button>
      </form>
    </div>
  );
}

const styles = {
  card: { maxWidth: '400px', margin: '40px auto', backgroundColor: '#fff', padding: '35px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  sub: { color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: '1.4' },
  group: { marginBottom: '15px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#444' },
  input: { width: '100%', padding: '10px', marginTop: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};