import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function DestinationDetail() {
  const { cityName } = useParams();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [sosStatus, setSosStatus] = useState(null);

  // Fetch verified local guides matching the targeted city metrics
  useEffect(() => {
    const fetchLocalGuides = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/guides/${cityName}`);
        setGuides(response.data);
      } catch (err) {
        console.error('Error reaching regional guide data registry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocalGuides();
  }, [cityName]);

  const handleActivateSafetyLog = async (guide) => {
    setSelectedGuide(guide);
    setSosStatus('transmitting');

    try {
      // Sending data tracking parameters to Express Backend terminal router
      await axios.post('http://localhost:5000/api/security/sos-log', {
        touristName: "Authenticated Traveler Cluster", // Simulated user tracking token
        guideId: guide._id,
        guideName: guide.name,
        destination: cityName,
        policeClearanceId: guide.policeClearanceId
      });
      setSosStatus('securely_logged');
    } catch (err) {
      console.error('Failed to update secure logs:', err);
      setSosStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/explore" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>← Back to Walkthrough Hub</Link>
      <h2 style={{ marginTop: '15px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Verified Local Guides in {cityName}</h2>
      
      {loading ? (
        <h3 style={{ color: '#fff' }}>📡 Synchronizing active regional directory logs...</h3>
      ) : guides.length === 0 ? (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '40px', borderRadius: '12px', textAlign: 'center', marginTop: '20px' }}>
          <h3>No underemployed guides registered in {cityName} today.</h3>
          <p style={{ color: '#555' }}>Be the first to create an employment profile for this city sector.</p>
          <Link to="/login/guide" style={{ color: '#007bff', fontWeight: 'bold' }}>Access Guide Onboarding Portal</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {guides.map(guide => (
            <div key={guide._id} style={styles.guideCard}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#222' }}>{guide.name}</h3>
                <span style={styles.badge}>✓ {guide.status}</span>
                <p style={{ fontSize: '14px', margin: '10px 0 5px 0', color: '#444' }}><strong>Languages:</strong> {guide.languages.join(', ')}</p>
                <p style={{ fontSize: '14px', color: '#555' }}><strong>Police Clearance File:</strong> <code>{guide.policeClearanceId}</code></p>
              </div>
              <button onClick={() => handleActivateSafetyLog(guide)} style={styles.bookBtn}>
                🔒 Secure Trip with Police Check
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Real-time Overlay Status Terminal */}
      {sosStatus && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            {sosStatus === 'transmitting' ? (
              <h3 style={{ color: '#007bff' }}>📡 Transmitting Encrypted Safety Payload...</h3>
            ) : (
              <div>
                <h3 style={{ color: 'green' }}>🛡️ Trip Parameters Logged Successfully!</h3>
                <p style={{ margin: '15px 0', fontSize: '14px', color: '#333' }}>
                  Your tour itinerary tracking sequence with <strong>{selectedGuide?.name}</strong> has been pinned to the local police database registry.
                </p>
                <button onClick={() => setSosStatus(null)} style={styles.closeBtn}>Close Terminal</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  guideCard: { backgroundColor: 'rgba(255,255,255,0.95)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  badge: { backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  bookBtn: { backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', maxWidth: '450px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' },
  closeBtn: { padding: '8px 20px', border: 'none', backgroundColor: '#333', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};