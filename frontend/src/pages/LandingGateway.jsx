import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingGateway() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.badgeBanner}>
          <span style={styles.sparkle}>✨</span> NEXT-GEN TRAVEL EXPERIENCE
        </div>
        <h1 style={styles.heroTitle}>
          AI-Powered Local Guide Discovery & Trip Planning
        </h1>
        <p style={styles.heroSubtitle}>
          Plan tailor-made travel itineraries in seconds with Gemini AI and connect directly with top-rated local expert guides across top cultural destinations.
        </p>

        <div style={styles.ctaGroup}>
          <button onClick={() => navigate('/ai-planner')} style={styles.primaryCta}>
            ✨ Plan Your Trip with AI
          </button>
          <button onClick={() => navigate('/explore')} style={styles.secondaryCta}>
            🧭 Explore Destinations & Guides
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🧠</div>
          <h3 style={styles.featureTitle}>Gemini AI Itineraries</h3>
          <p style={styles.featureDesc}>
            Custom day-by-day itineraries generated instantly based on your travel dates, budget, and personal interests.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🎖️</div>
          <h3 style={styles.featureTitle}>Verified Local Experts</h3>
          <p style={styles.featureDesc}>
            Connect with passionate neighborhood storytellers, food walk hosts, and heritage experts with transparent reviews.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>⚡</div>
          <h3 style={styles.featureTitle}>Instant Transparent Booking</h3>
          <p style={styles.featureDesc}>
            Upfront hourly rates, instant schedule confirmation, and direct guide communication without hidden clearance steps.
          </p>
        </div>
      </div>

      {/* User Portal Gateway Grid */}
      <div style={styles.gatewaySection}>
        <h2 style={styles.gatewayHeading}>Get Started on VeloGuide</h2>
        
        <div style={styles.gatewayGrid}>
          <div style={styles.portalCard} onClick={() => navigate('/explore')}>
            <div style={styles.portalBadge}>FOR TRAVELERS</div>
            <div style={styles.portalIcon}>🧳</div>
            <h3 style={styles.portalTitle}>Explore & Book Guides</h3>
            <p style={styles.portalText}>
              Browse top travel destinations, read verified guide reviews, and book customized local tours with flexible schedules.
            </p>
            <div style={styles.cardArrow}>Explore Destinations →</div>
          </div>

          <div style={styles.portalCardHighlight} onClick={() => navigate('/login/guide')}>
            <div style={styles.portalBadgeHighlight}>FOR LOCAL GUIDES</div>
            <div style={styles.portalIcon}>🏡</div>
            <h3 style={styles.portalTitle}>Join as a Local Guide</h3>
            <p style={styles.portalText}>
              Are you a local expert or resident seeking community-led employment? Register your profile, set hourly rates, and receive booking requests.
            </p>
            <div style={styles.cardArrowHighlight}>Access Guide Portal →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '20px'
  },
  heroSection: {
    textAlign: 'center',
    maxWidth: '840px',
    margin: '0 auto 60px auto',
    padding: '40px 20px'
  },
  badgeBanner: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '30px',
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#818cf8',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    marginBottom: '24px'
  },
  sparkle: { fontSize: '14px' },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1.15',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '36px',
    fontWeight: '400'
  },
  ctaGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  primaryCta: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
    transition: 'all 0.25s'
  },
  secondaryCta: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    cursor: 'pointer',
    transition: 'all 0.25s'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '70px'
  },
  featureCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '32px 24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'all 0.3s ease'
  },
  featureIcon: {
    fontSize: '36px',
    marginBottom: '16px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '10px'
  },
  featureDesc: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.5'
  },
  gatewaySection: {
    marginTop: '20px'
  },
  gatewayHeading: {
    textAlign: 'center',
    fontSize: '30px',
    color: '#ffffff',
    marginBottom: '32px',
    fontWeight: '700'
  },
  gatewayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px'
  },
  portalCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(16px)',
    borderRadius: '20px',
    padding: '36px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  portalCardHighlight: {
    background: 'linear-gradient(145deg, rgba(79, 70, 229, 0.25), rgba(15, 23, 42, 0.8))',
    backdropFilter: 'blur(16px)',
    borderRadius: '20px',
    padding: '36px',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  portalBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: '1px',
    marginBottom: '16px'
  },
  portalBadgeHighlight: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: '1px',
    marginBottom: '16px'
  },
  portalIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  portalTitle: {
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '12px',
    fontWeight: '700'
  },
  portalText: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  cardArrow: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#38bdf8'
  },
  cardArrowHighlight: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#a78bfa'
  }
};