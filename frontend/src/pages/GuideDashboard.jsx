import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GuideDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const fetchAssignedJobs = async () => {
    const token = localStorage.getItem('guideToken');
    
    if (!token) {
      navigate('/login/guide');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/bookings/guide', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (err) {
      setError('Failed to authenticate guide session.');
      localStorage.removeItem('guideToken');
      localStorage.removeItem('guideUser');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedJobs();
  }, [navigate]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    try {
      const token = localStorage.getItem('guideToken');
      const response = await axios.patch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        fetchAssignedJobs();
      }
    } catch (err) {
      alert('Failed to update booking status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guideToken');
    localStorage.removeItem('guideUser');
    navigate('/login/guide');
  };

  // Metrics calculation
  const totalBookings = jobs.length;
  const confirmedCount = jobs.filter(j => j.status === 'Confirmed' || j.status === 'Completed').length;
  const totalEarnings = jobs
    .filter(j => j.status === 'Confirmed' || j.status === 'Completed')
    .reduce((sum, j) => sum + (j.totalPrice || 2000), 0);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Guide Assignment Desk</h1>
          <p style={styles.subtitle}>Manage your incoming tour reservations and schedule requests.</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
      </div>

      {/* Metrics Row */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL ASSIGNMENTS</div>
          <div style={styles.metricVal}>{totalBookings}</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>CONFIRMED / ACTIVE</div>
          <div style={{ ...styles.metricVal, color: '#34d399' }}>{confirmedCount}</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>ESTIMATED EARNINGS</div>
          <div style={{ ...styles.metricVal, color: '#38bdf8' }}>₹{totalEarnings.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingBox}>📡 Loading active tour reservation feed...</div>
      ) : error ? (
        <div style={styles.errorCard}>
          ❌ {error} <br/>
          <button onClick={() => navigate('/login/guide')} style={{ marginTop: '10px' }}>Back to Login</button>
        </div>
      ) : jobs.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>No booking requests yet today.</h3>
          <p style={{ color: '#94a3b8' }}>When travelers search your city sector and reserve a tour, your desk feed will update live here.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.jobCard}>
              <div style={styles.metaHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={styles.touristAvatar}>🧳</span>
                  <div>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>{job.touristName}</h3>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      {job.touristPhone && `📞 ${job.touristPhone}`} {job.touristEmail && `• ✉️ ${job.touristEmail}`}
                    </div>
                  </div>
                </div>

                <span style={getStatusBadge(job.status)}>{job.status}</span>
              </div>

              <div style={styles.jobGrid}>
                <div>
                  <div style={styles.subLabel}>DESTINATION SECTOR</div>
                  <div style={styles.subVal}>📍 {job.destination}</div>
                </div>

                <div>
                  <div style={styles.subLabel}>SCHEDULED DATES</div>
                  <div style={styles.subVal}>📅 {job.startDate} to {job.endDate || job.startDate}</div>
                </div>

                <div>
                  <div style={styles.subLabel}>HOURS PER DAY</div>
                  <div style={styles.subVal}>⏰ {job.hoursPerDay || 4} hrs/day</div>
                </div>

                <div>
                  <div style={styles.subLabel}>TOUR PRICE</div>
                  <div style={{ ...styles.subVal, color: '#34d399', fontWeight: '800' }}>
                    ₹{(job.totalPrice || 2000).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {job.specialRequests && (
                <div style={styles.requestsBox}>
                  <strong>Traveler Notes:</strong> {job.specialRequests}
                </div>
              )}

              {/* Action Buttons */}
              <div style={styles.actionsRow}>
                {job.status === 'Pending Confirmation' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(job._id, 'Confirmed')} 
                      disabled={actionLoading === job._id} 
                      style={styles.acceptBtn}
                    >
                      ✓ Accept Booking Request
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(job._id, 'Cancelled')} 
                      disabled={actionLoading === job._id} 
                      style={styles.declineBtn}
                    >
                      ✕ Decline
                    </button>
                  </>
                )}

                {job.status === 'Confirmed' && (
                  <button 
                    onClick={() => handleUpdateStatus(job._id, 'Completed')} 
                    disabled={actionLoading === job._id} 
                    style={styles.completeBtn}
                  >
                    🎉 Mark Tour Completed
                  </button>
                )}

                {job.status === 'Completed' && (
                  <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '700' }}>
                    ✓ Tour Finished Successfully
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'Confirmed':
      return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' };
    case 'Completed':
      return { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' };
    case 'Cancelled':
      return { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' };
    default:
      return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' };
  }
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { color: '#fff', margin: 0, fontSize: '32px', fontWeight: '800' },
  subtitle: { color: '#94a3b8', margin: '4px 0 0 0', fontSize: '15px' },
  logoutBtn: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '8px 18px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' },
  metricCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  metricLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px' },
  metricVal: { fontSize: '32px', fontWeight: '800', color: '#fff', marginTop: '4px' },
  loadingBox: { padding: '40px', color: '#fff', textAlign: 'center', fontSize: '18px' },
  errorCard: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '20px', borderRadius: '12px', textAlign: 'center' },
  emptyCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', padding: '48px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px' },
  jobCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', backdropFilter: 'blur(16px)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  metaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' },
  touristAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginTop: '16px' },
  subLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '2px' },
  subVal: { color: '#f8fafc', fontSize: '14px', fontWeight: '600' },
  requestsBox: { marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#cbd5e1' },
  actionsRow: { display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' },
  acceptBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
  declineBtn: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
  completeBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }
};