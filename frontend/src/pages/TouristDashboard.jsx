import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DESTINATIONS = [
  { id: 1, name: 'Mumbai', description: 'Vibrant coastal metropolis famous for heritage architecture, street food walks, and Gateway of India.', imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80', badge: 'Heritage & Food' },
  { id: 2, name: 'Delhi', description: 'Rich historical landscape featuring Mughal forts, sprawling spice bazaars, and legendary food trails.', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', badge: 'Mughal History' },
  { id: 3, name: 'Goa', description: 'Stunning shorelines, Portuguese Latin Quarter (Fontainhas), spice plantations, and vibrant beach trails.', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', badge: 'Beaches & Latin Culture' },
  { id: 4, name: 'Fort Kochi', description: 'Historic seaside town known for colonial architecture, Chinese fishing nets, and Malabar arts.', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=600&q=80', badge: 'Colonial & Backwaters' },
  { id: 5, name: 'Udaipur', description: 'The majestic City of Lakes, featuring romantic palaces, royal heritage, and traditional crafts.', imageUrl: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=600&q=80', badge: 'Royal Palaces' },
  { id: 6, name: 'Munnar', description: 'Tranquil Western Ghats hill station wrapped in mist with expansive tea gardens and trekking routes.', imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80', badge: 'Tea Gardens & Hikes' },
  { id: 7, name: 'Varanasi', description: 'One of the world’s oldest living cities, spiritual heart of India, famous for historic river ghats.', imageUrl: 'https://images.unsplash.com/photo-1561361068-6199171ee235?auto=format&fit=crop&w=600&q=80', badge: 'Spiritual Ghats' },
  { id: 8, name: 'Hampi', description: 'Surreal boulder landscapes surrounding ancient ruins of the medieval Vijayanagara Empire.', imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e45df7f2?auto=format&fit=crop&w=600&q=80', badge: 'Ancient Ruins' },
  { id: 9, name: 'Rishikesh', description: 'Foothills spiritual hub famous for Himalayan suspension bridges, yoga retreats, and river rafting.', imageUrl: 'https://images.unsplash.com/photo-1598977123418-45f0470c61ec?auto=format&fit=crop&w=600&q=80', badge: 'Yoga & Rafting' }
];

export default function TouristDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDestinations = DESTINATIONS.filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Banner AI Teaser */}
      <div style={styles.aiBanner}>
        <div>
          <h2 style={{ fontSize: '24px', color: '#fff', margin: '0 0 6px 0' }}>✨ Not sure where to start?</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Let VeloGuide AI generate a personalized multi-day travel itinerary tailored to your interests.</p>
        </div>
        <button onClick={() => navigate('/ai-planner')} style={styles.aiBannerBtn}>
          Plan Trip with AI →
        </button>
      </div>

      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.mainTitle}>Explore Cultural Destinations</h1>
          <p style={styles.subtitle}>Select a destination to discover verified local expert guides and storytellers.</p>
        </div>

        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="🔍 Search city or interest (e.g. Mumbai, Food, Palaces)..." 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div style={styles.grid}>
        {filteredDestinations.map((place) => (
          <div key={place.id} style={styles.card}>
            <div style={styles.imgContainer}>
              <img src={place.imageUrl} alt={place.name} style={styles.cardImage} />
              <span style={styles.cardBadge}>{place.badge}</span>
            </div>
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>{place.name}</h3>
              <p style={styles.cardDesc}>{place.description}</p>
              
              <div style={styles.actionRow}>
                <button 
                  onClick={() => navigate(`/destination/${place.name}`)} 
                  style={styles.viewGuidesBtn}
                >
                  View Local Guides
                </button>
                <button 
                  onClick={() => navigate('/ai-planner')} 
                  style={styles.aiQuickBtn}
                  title="Plan AI Itinerary for this city"
                >
                  ✨ AI Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  aiBanner: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    borderRadius: '16px',
    padding: '24px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px'
  },
  aiBannerBtn: {
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '32px'
  },
  mainTitle: { color: '#ffffff', fontSize: '36px', fontWeight: '800', marginBottom: '4px' },
  subtitle: { color: '#94a3b8', fontSize: '16px' },
  searchInput: {
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    color: '#ffffff',
    fontSize: '14px',
    width: '320px',
    outline: 'none'
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  imgContainer: { position: 'relative', height: '200px', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover' },
  cardBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(6px)',
    color: '#38bdf8',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700'
  },
  cardBody: { padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' },
  cardTitle: { color: '#ffffff', margin: '0 0 10px 0', fontSize: '22px', fontWeight: '700' },
  cardDesc: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' },
  actionRow: { display: 'flex', gap: '10px' },
  viewGuidesBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer'
  },
  aiQuickBtn: {
    padding: '12px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#38bdf8',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer'
  }
};