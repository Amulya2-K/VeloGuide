import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingGateway() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to LocalGuide Link</h1>
      <p style={styles.subtitle}>Connecting travelers with knowledgeable, underemployed local guides under regional public safety oversight.</p>
      
      <div style={styles.boxGrid}>
        <div style={styles.box} onClick={() => navigate('/login/tourist')}>
          <div style={styles.icon}>🧳</div>
          <h2 style={styles.boxTitle}>I am a Tourist</h2>
          <p style={styles.boxText}>Explore historic city metrics, walk through destination hubs, and book trusted regional security-cleared neighborhood guides.</p>
        </div>

        <div style={styles.box} onClick={() => navigate('/login/guide')}>
          <div style={styles.icon}>🏡</div>
          <h2 style={styles.boxTitle}>I am a Local Resident</h2>
          <p style={styles.boxText}>Are you a local resident seeking community-led employment? Register your city knowledge base and access tourist booking logs.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '60px' },
  title: { fontSize: '42px', color: '#ffffff', marginBottom: '15px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.6)' },
  subtitle: { fontSize: '18px', color: '#f0f0f0', maxWidth: '700px', margin: '0 auto 50px auto', lineHeight: '1.6', textShadow: '0 1px 3px rgba(0,0,0,0.5)' },
  boxGrid: { display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' },
  box: { 
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Semi-transparent glass look
    backdropFilter: 'blur(10px)',
    padding: '40px 30px', 
    borderRadius: '16px', 
    width: '320px', 
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.2)' 
  },
  icon: { fontSize: '54px', marginBottom: '15px' },
  boxTitle: { color: '#ffffff', margin: '0 0 10px 0', fontSize: '24px' },
  boxText: { color: '#e0e0e0', fontSize: '14px', lineHeight: '1.5' }
};