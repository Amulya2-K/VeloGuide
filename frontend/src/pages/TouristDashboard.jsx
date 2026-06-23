import React from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_DESTINATIONS = [
  { id: 1, name: 'Mumbai', description: 'A vibrant coastal metropolis famous for Bollywood and the Gateway of India.', imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=500' },
  { id: 2, name: 'Delhi', description: 'Rich historical landscape featuring historic forts and incredible food cultures.', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500' },
  { id: 3, name: 'Goa', description: 'Stunning sandy shorelines coupled with unique local heritage sites.', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500' }
];

export default function TouristDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={styles.mainTitle}>Frequently Visited Places</h2>
      <p style={styles.subtitle}>Select a destination to find local, verified community guides.</p>
      
      <div style={styles.grid}>
        {MOCK_DESTINATIONS.map((place) => (
          <div key={place.id} style={styles.card} onClick={() => navigate(`/destination/${place.name}`)}>
            <img src={place.imageUrl} alt={place.name} style={styles.cardImage} />
            <div style={styles.cardBody}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{place.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.4' }}>{place.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  mainTitle: { color: '#ffffff', marginBottom: '5px', fontSize: '32px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' },
  subtitle: { color: '#f0f0f0', marginBottom: '40px', fontSize: '16px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'transform 0.2s' },
  cardImage: { width: '100%', height: '200px', objectFit: 'cover' },
  cardBody: { padding: '20px' }
};