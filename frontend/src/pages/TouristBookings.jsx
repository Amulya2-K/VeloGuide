import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function TouristBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem('touristToken');
      const user = localStorage.getItem('touristUser');
      let email = '';

      if (user) {
        try { email = JSON.parse(user).email; } catch (e) {}
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/tourist?email=${email}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (err) {
        setError('Failed to fetch your bookings list.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' };
      case 'Completed':
        return { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' };
      case 'Cancelled':
        return { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)' };
      default:
        return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ fontSize: '32px', color: '#fff', margin: 0 }}>🧳 My Booked Tours</h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', margin: '4px 0 0 0' }}>Track your guide confirmations and trip schedules.</p>
      </div>

      {loading ? (
        <div style={styles.loadingBox}>📡 Loading your trip reservations...</div>
      ) : error ? (
        <div style={styles.errorCard}>❌ {error}</div>
      ) : bookings.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>No active tour bookings found.</h3>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Explore destination cities or generate a custom AI itinerary to book your local guide!</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/explore" style={styles.btnPrimary}>Browse Destinations</Link>
            <Link to="/ai-planner" style={styles.btnSecondary}>✨ Try AI Planner</Link>
          </div>
        </div>
      ) : (
        <div style={styles.list}>
          {bookings.map((item) => (
            <div key={item._id} style={styles.bookingCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>📍 {item.destination} Tour</h3>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
                    Reserved on {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ ...styles.badge, ...getStatusBadgeStyle(item.status) }}>
                  {item.status}
                </span>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoCol}>
                  <div style={styles.label}>LOCAL GUIDE</div>
                  <div style={styles.val}>🎖️ {item.guideName}</div>
                </div>

                <div style={styles.infoCol}>
                  <div style={styles.label}>TRAVEL DATES</div>
                  <div style={styles.val}>📅 {item.startDate} to {item.endDate || item.startDate}</div>
                </div>

                <div style={styles.infoCol}>
                  <div style={styles.label}>DAILY DURATION</div>
                  <div style={styles.val}>⏰ {item.hoursPerDay || 4} hours / day</div>
                </div>

                <div style={styles.infoCol}>
                  <div style={styles.label}>TOTAL PRICE</div>
                  <div style={{ ...styles.val, color: '#34d399', fontWeight: '800' }}>
                    ₹{item.totalPrice ? item.totalPrice.toLocaleString('en-IN') : '2,000'}
                  </div>
                </div>
              </div>

              {item.specialRequests && (
                <div style={styles.notesBox}>
                  <strong>Tour Notes:</strong> {item.specialRequests}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  loadingBox: { padding: '40px', color: '#fff', textAlign: 'center', fontSize: '18px' },
  errorCard: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '16px', borderRadius: '12px' },
  emptyCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', padding: '48px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' },
  btnPrimary: { backgroundColor: '#4f46e5', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' },
  btnSecondary: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px' },
  bookingCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', backdropFilter: 'blur(16px)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' },
  badge: { padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' },
  cardBody: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '16px' },
  infoCol: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '4px' },
  val: { color: '#f8fafc', fontSize: '14px', fontWeight: '600' },
  notesBox: { marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px', color: '#cbd5e1' }
};
