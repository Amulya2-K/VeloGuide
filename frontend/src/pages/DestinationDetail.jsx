import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DestinationDetail() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    touristName: '',
    touristEmail: '',
    touristPhone: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    hoursPerDay: 4,
    specialRequests: ''
  });

  useEffect(() => {
    // Prefill tourist info if logged in
    const storedUser = localStorage.getItem('touristUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setBookingData(prev => ({
          ...prev,
          touristName: user.name || '',
          touristEmail: user.email || '',
          touristPhone: user.phone || ''
        }));
      } catch (e) {}
    }

    const fetchLocalGuides = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/guides/city/${encodeURIComponent(cityName)}`
    );

    if (response.data.success) {
      setGuides(response.data.guides || response.data.data || []);
    } else if (Array.isArray(response.data)) {
      setGuides(response.data);
    }

  } catch (err) {
    console.error(
      'Error reaching guide database registry:',
      err
    );

    setGuides([]);
  } finally {
    setLoading(false);
  }
};

    fetchLocalGuides();
  }, [cityName]);

  const openBookingModal = (guide) => {
    setSelectedGuide(guide);
    setShowBookingModal(true);
    setBookingStatus(null);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setBookingStatus('submitting');

    try {
      const token = localStorage.getItem('touristToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post('http://localhost:5000/api/bookings', {
        guideId: selectedGuide._id,
        touristName: bookingData.touristName,
        touristEmail: bookingData.touristEmail,
        touristPhone: bookingData.touristPhone,
        destination: cityName,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        hoursPerDay: bookingData.hoursPerDay,
        specialRequests: bookingData.specialRequests
      }, { headers });

      if (response.data.success) {
        setBookingStatus('success');
      }
    } catch (err) {
      console.error('Failed to submit booking request:', err);
      setBookingStatus('error');
    }
  };

  // Calculate estimated price
  const calculateTotal = () => {
    if (!selectedGuide) return 0;
    const start = new Date(bookingData.startDate || Date.now());
    const end = new Date(bookingData.endDate || bookingData.startDate || Date.now());
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return selectedGuide.hourlyRate * Number(bookingData.hoursPerDay) * diffDays;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/explore" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
          ← Back to All Destinations
        </Link>
      </div>

      <div style={styles.headerBanner}>
        <div>
          <span style={styles.cityBadge}>DESTINATION HUB</span>
          <h1 style={{ fontSize: '36px', color: '#fff', margin: '8px 0' }}>Local Expert Guides in {cityName}</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>
            Connect with verified local storytellers, food masters, and heritage experts.
          </p>
        </div>
      </div>
      
      {loading ? (
        <div style={styles.loadingBox}>📡 Synchronizing active local guide directory...</div>
      ) : guides.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>No registered local guides in {cityName} yet.</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Be the first local resident to register an expert guide profile for this city!</p>
          <Link to="/login/guide" style={styles.guideOnboardBtn}>Register as Local Guide in {cityName} →</Link>
        </div>
      ) : (
        <div style={styles.guidesList}>
          {guides.map(guide => (
            <div key={guide._id} style={styles.guideCard}>
              <div style={styles.guideLeft}>
                <img src={guide.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} alt={guide.name} style={styles.avatarImg} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '22px' }}>{guide.name}</h3>
                    <span style={styles.statusBadge}>✓ {guide.status || 'Verified Guide'}</span>
                  </div>
                  
                  <div style={styles.ratingText}>⭐ {guide.rating || 4.9} ({guide.reviewCount || 20} reviews) • {guide.experienceYears || 3}+ years exp</div>

                  <p style={{ fontSize: '14px', margin: '10px 0', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {guide.bio}
                  </p>

                  <div style={styles.metaRow}>
                    <div><strong>Languages:</strong> {Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages}</div>
                    {guide.specialties && (
                      <div style={styles.specTags}>
                        {guide.specialties.map((s, i) => <span key={i} style={styles.tag}>{s}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.guideRight}>
                <div style={styles.priceContainer}>
                  <span style={styles.priceAmount}>₹{guide.hourlyRate || 500}</span>
                  <span style={styles.priceUnit}> / hour</span>
                </div>

                <button onClick={() => openBookingModal(guide)} style={styles.bookBtn}>
                  ⚡ Book Tour with {guide.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '22px' }}>Book Tour with {selectedGuide?.name}</h2>
              <button onClick={() => setShowBookingModal(false)} style={styles.closeX}>✕</button>
            </div>

            {bookingStatus === 'success' ? (
              <div style={styles.successState}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ color: '#34d399', margin: '0 0 10px 0' }}>Tour Booking Confirmed!</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
                  Your tour booking for <strong>{cityName}</strong> with <strong>{selectedGuide?.name}</strong> has been created. Your guide will confirm your schedule shortly.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={() => navigate('/tourist-bookings')} style={styles.primaryModalBtn}>
                    View My Bookings
                  </button>
                  <button onClick={() => setShowBookingModal(false)} style={styles.secondaryModalBtn}>
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} style={styles.modalForm}>
                <div style={styles.formGroup}>
                  <label style={styles.modalLabel}>Your Full Name</label>
                  <input 
                    type="text" 
                    required 
                    style={styles.modalInput} 
                    value={bookingData.touristName} 
                    onChange={e => setBookingData({...bookingData, touristName: e.target.value})} 
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.modalLabel}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      style={styles.modalInput} 
                      value={bookingData.touristEmail} 
                      onChange={e => setBookingData({...bookingData, touristEmail: e.target.value})} 
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.modalLabel}>Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      style={styles.modalInput} 
                      value={bookingData.touristPhone} 
                      onChange={e => setBookingData({...bookingData, touristPhone: e.target.value})} 
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.modalLabel}>Start Date</label>
                    <input 
                      type="date" 
                      required 
                      style={styles.modalInput} 
                      value={bookingData.startDate} 
                      onChange={e => setBookingData({...bookingData, startDate: e.target.value})} 
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.modalLabel}>End Date</label>
                    <input 
                      type="date" 
                      required 
                      style={styles.modalInput} 
                      value={bookingData.endDate} 
                      onChange={e => setBookingData({...bookingData, endDate: e.target.value})} 
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.modalLabel}>Hours Per Day: <strong>{bookingData.hoursPerDay} hours</strong></label>
                  <input 
                    type="range" 
                    min="2" 
                    max="8" 
                    style={{ width: '100%', accentColor: '#4f46e5' }} 
                    value={bookingData.hoursPerDay} 
                    onChange={e => setBookingData({...bookingData, hoursPerDay: e.target.value})} 
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.modalLabel}>Special Tour Requests / Places of Interest</label>
                  <textarea 
                    rows="2" 
                    placeholder="e.g. Focus on street food walks, photography spots..." 
                    style={{ ...styles.modalInput, resize: 'none' }} 
                    value={bookingData.specialRequests} 
                    onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})} 
                  />
                </div>

                {/* Price Breakdown */}
                <div style={styles.totalBox}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total Estimated Amount</span>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#34d399' }}>₹{calculateTotal().toLocaleString('en-IN')}</div>
                  </div>
                  <button type="submit" disabled={bookingStatus === 'submitting'} style={styles.confirmSubmitBtn}>
                    {bookingStatus === 'submitting' ? 'Processing...' : 'Confirm & Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  headerBanner: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    backdropFilter: 'blur(16px)',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '32px'
  },
  cityBadge: { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: '800' },
  loadingBox: { padding: '40px', color: '#fff', textAlign: 'center', fontSize: '18px' },
  emptyCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', padding: '40px', borderRadius: '16px', textAlign: 'center' },
  guideOnboardBtn: { backgroundColor: '#4f46e5', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' },
  guidesList: { display: 'flex', flexDirection: 'column', gap: '24px' },
  guideCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    backdropFilter: 'blur(16px)',
    padding: '28px',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  guideLeft: { display: 'flex', gap: '20px', flex: 1, minWidth: '280px' },
  avatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #4f46e5' },
  statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 10px', borderRadius: '14px', fontSize: '12px', fontWeight: '700' },
  ratingText: { color: '#fbbf24', fontSize: '13px', fontWeight: '700', marginTop: '4px' },
  metaRow: { marginTop: '12px', fontSize: '13px', color: '#94a3b8' },
  specTags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' },
  tag: { backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  guideRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' },
  priceContainer: { textAlign: 'right' },
  priceAmount: { fontSize: '28px', fontWeight: '800', color: '#34d399' },
  priceUnit: { fontSize: '14px', color: '#94a3b8' },
  bookBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modalCard: { backgroundColor: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '32px', borderRadius: '20px', maxWidth: '520px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeX: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  modalLabel: { fontSize: '12px', fontWeight: '700', color: '#cbd5e1' },
  modalInput: { padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#fff', fontSize: '14px', outline: 'none' },
  totalBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  confirmSubmitBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' },
  successState: { textAlign: 'center', padding: '20px 0' },
  primaryModalBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  secondaryModalBtn: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }
};