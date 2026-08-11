import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AITripPlanner() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('Mumbai');
  const [durationDays, setDurationDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Cultural & Experiential');
  const [budget, setBudget] = useState('Moderate');
  const [interests, setInterests] = useState('Heritage, Local Street Food, Photography');
  
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [recommendedGuides, setRecommendedGuides] = useState([]);
  const [error, setError] = useState('');

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlanResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/plan-trip', {
        destination,
        durationDays,
        travelStyle,
        budget,
        interests
      });

      if (response.data.success) {
        setPlanResult(response.data.plan);
        setRecommendedGuides(response.data.recommendedGuides || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to VeloGuide AI engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.aiTag}>✨ POWERED BY GEMINI AI</div>
        <h1 style={styles.title}>VeloGuide AI Trip Planner</h1>
        <p style={styles.subtitle}>
          Specify your travel preferences and let AI generate a customized day-by-day itinerary while automatically matching top local guides.
        </p>
      </div>

      {/* Input Form Card */}
      <div style={styles.formCard}>
        <form onSubmit={handleGeneratePlan} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination City</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Mumbai, Fort Kochi, Goa, Udaipur" 
              style={styles.input} 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Duration (Days)</label>
            <input 
              type="number" 
              min="1" 
              max="14" 
              required 
              style={styles.input} 
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Travel Style</label>
            <select 
              style={styles.select} 
              value={travelStyle} 
              onChange={(e) => setTravelStyle(e.target.value)}
            >
              <option value="Cultural & Experiential">Cultural & Experiential</option>
              <option value="Foodie & Culinary Trail">Foodie & Culinary Trail</option>
              <option value="Historical & Architectural">Historical & Architectural</option>
              <option value="Relaxed & Scenic Escapes">Relaxed & Scenic Escapes</option>
              <option value="Adventure & Nature Treks">Adventure & Nature Treks</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Budget Level</label>
            <select 
              style={styles.select} 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="Budget-Friendly">Budget-Friendly</option>
              <option value="Moderate">Moderate</option>
              <option value="Premium / Luxury">Premium / Luxury</option>
            </select>
          </div>

          <div style={{ ...styles.inputGroup, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Specific Interests / Preferences</label>
            <input 
              type="text" 
              placeholder="e.g. Street food, Photography, Hidden temples, Art galleries" 
              style={styles.input} 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={loading} style={styles.generateBtn}>
              {loading ? '🧠 Gemini AI is crafting your trip plan...' : '✨ Generate AI Itinerary & Match Guides'}
            </button>
          </div>
        </form>
      </div>

      {error && <div style={styles.errorCard}>❌ {error}</div>}

      {/* Plan Results View */}
      {planResult && (
        <div style={styles.resultsContainer}>
          {/* Summary Card */}
          <div style={styles.summaryBox}>
            <div style={styles.summaryMeta}>
              <span style={styles.destinationBadge}>📍 {planResult.destination}</span>
              <span style={styles.budgetBadge}>💰 {planResult.estimatedBudget}</span>
              <span style={styles.styleBadge}>⚡ {planResult.travelStyle}</span>
            </div>
            <h2 style={{ fontSize: '24px', color: '#fff', margin: '16px 0 10px 0' }}>Your Custom AI Trip Overview</h2>
            <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.6' }}>{planResult.summary}</p>
          </div>

          {/* Timeline Days */}
          <h2 style={{ fontSize: '26px', color: '#fff', margin: '40px 0 20px 0' }}>🗓️ Day-by-Day Itinerary</h2>
          <div style={styles.timelineList}>
            {planResult.itinerary.map((dayItem) => (
              <div key={dayItem.day} style={styles.dayCard}>
                <div style={styles.dayHeader}>
                  <div style={styles.dayBadge}>DAY {dayItem.day}</div>
                  <h3 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>{dayItem.title}</h3>
                </div>

                <div style={styles.activitiesGrid}>
                  <div style={styles.activityBlock}>
                    <div style={styles.timeLabel}>🌅 MORNING</div>
                    <p style={styles.activityText}>{dayItem.morning}</p>
                  </div>

                  <div style={styles.activityBlock}>
                    <div style={styles.timeLabel}>☀️ AFTERNOON</div>
                    <p style={styles.activityText}>{dayItem.afternoon}</p>
                  </div>

                  <div style={styles.activityBlock}>
                    <div style={styles.timeLabel}>🌙 EVENING</div>
                    <p style={styles.activityText}>{dayItem.evening}</p>
                  </div>
                </div>

                {dayItem.insiderTip && (
                  <div style={styles.tipBox}>
                    💡 <strong>Insider Tip:</strong> {dayItem.insiderTip}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Matched Local Guides */}
          <h2 style={{ fontSize: '26px', color: '#fff', margin: '50px 0 20px 0' }}>
            🎖️ Recommended Local Guides for {planResult.destination}
          </h2>

          {recommendedGuides.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No local guides currently registered for this destination.</p>
          ) : (
            <div style={styles.guidesGrid}>
              {recommendedGuides.map((guide) => (
                <div key={guide._id} style={styles.guideCard}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img src={guide.avatar} alt={guide.name} style={styles.avatarImg} />
                    <div>
                      <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>{guide.name}</h3>
                      <div style={styles.ratingBadge}>⭐ {guide.rating} ({guide.reviewCount} reviews)</div>
                      <span style={styles.cityText}>📍 {guide.assignedCity}</span>
                    </div>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '14px 0', lineHeight: '1.4' }}>
                    {guide.bio}
                  </p>

                  <div style={styles.tagsRow}>
                    {guide.specialties && guide.specialties.map((spec, i) => (
                      <span key={i} style={styles.specTag}>{spec}</span>
                    ))}
                  </div>

                  <div style={styles.priceRow}>
                    <div>
                      <span style={styles.rateAmount}>₹{guide.hourlyRate}</span>
                      <span style={styles.rateUnit}> / hour</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/destination/${guide.assignedCity}`)} 
                      style={styles.bookGuideBtn}
                    >
                      Book Tour with {guide.name.split(' ')[0]} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '32px' },
  aiTag: {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '20px',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    color: '#38bdf8',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '12px'
  },
  title: { fontSize: '38px', color: '#fff', fontWeight: '800', marginBottom: '10px' },
  subtitle: { color: '#94a3b8', fontSize: '16px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.5' },
  formCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    backdropFilter: 'blur(16px)',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '40px'
  },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  select: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  generateBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '800',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)',
    transition: 'all 0.25s'
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid rgba(239, 68, 68, 0.4)'
  },
  resultsContainer: { marginTop: '30px' },
  summaryBox: {
    backgroundColor: 'linear-gradient(145deg, rgba(79, 70, 229, 0.2), rgba(30, 41, 59, 0.8))',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '20px',
    padding: '28px'
  },
  summaryMeta: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  destinationBadge: { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '700' },
  budgetBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '700' },
  styleBadge: { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '700' },
  timelineList: { display: 'flex', flexDirection: 'column', gap: '24px' },
  dayCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  dayHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' },
  dayBadge: { backgroundColor: '#4f46e5', color: '#fff', fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px' },
  activitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' },
  activityBlock: { backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
  timeLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' },
  activityText: { color: '#e2e8f0', fontSize: '14px', lineHeight: '1.4' },
  tipBox: { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderLeft: '4px solid #f59e0b', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '13px', color: '#fbbf24' },
  guidesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  guideCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  avatarImg: { width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4f46e5' },
  ratingBadge: { fontSize: '12px', fontWeight: '700', color: '#fbbf24', marginTop: '2px' },
  cityText: { fontSize: '12px', color: '#94a3b8' },
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' },
  specTag: { backgroundColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  rateAmount: { fontSize: '20px', fontWeight: '800', color: '#34d399' },
  rateUnit: { fontSize: '12px', color: '#94a3b8' },
  bookGuideBtn: { backgroundColor: '#4f46e5', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }
};
