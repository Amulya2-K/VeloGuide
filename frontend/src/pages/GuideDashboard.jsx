import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GuideDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedJobs = async () => {
      const token = localStorage.getItem('guideToken');
      
      // Security Check: If no token exists, boot them back out to login portal
      if (!token) {
        navigate('/login/guide');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/guides/dashboard/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (err) {
        setError('Failed to authenticate session dashboard parameters.');
        localStorage.removeItem('guideToken'); // Clear broken credentials
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedJobs();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('guideToken');
    navigate('/login/guide');
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Your Guide Assignment Desk</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
      </div>
      <p style={styles.subtitle}>Manage incoming local safety logs, traveler checkpoints, and verified tours.</p>

      {loading ? (
        <h3 style={{ color: '#fff' }}>📡 Loading live police desk feed allocations...</h3>
      ) : error ? (
        <div style={styles.errorCard}>❌ {error} <br/><button onClick={() => navigate('/login/guide')}>Back to Login</button></div>
      ) : jobs.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3>📭 No active assignments today.</h3>
          <p>When travelers search your city zone and lock in a booking log, your workspace terminal will sound alert coordinates here.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.jobCard}>
              <div style={styles.meta}>
                <span style={styles.statusBadge}>{job.status}</span>
                <span style={styles.timeStr}>{new Date(job.timestamp).toLocaleString()}</span>
              </div>
              <h3 style={{ margin: '10px 0 5px 0', color: '#111' }}>🧳 Traveler: {job.touristName}</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#444' }}><strong>Target Sector:</strong> {job.destination}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#555' }}><strong>Your Logged ID:</strong> <code>{job.policeClearanceId}</code></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
  title: { color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.6)' },
  subtitle: { color: '#f0f0f0', margin: '5px 0 30px 0', textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontSize: '15px' },
  logoutBtn: { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  emptyCard: { backgroundColor: 'rgba(255,255,255,0.95)', padding: '40px', borderRadius: '12px', textAlign: 'center' },
  jobCard: { backgroundColor: 'rgba(255,255,255,0.96)', padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  statusBadge: { backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  timeStr: { fontSize: '12px', color: '#666' },
  errorCard: { backgroundColor: '#f8d7da', color: '#721c24', padding: '20px', borderRadius: '8px', textAlign: 'center' }
};