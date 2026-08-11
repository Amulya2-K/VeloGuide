import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import LandingGateway from './pages/LandingGateway';
import TouristLogin from './pages/TouristLogin';
import TouristRegister from './pages/TouristRegister';
import GuideLogin from './pages/GuideLogin';
import GuideRegistration from './pages/GuideRegistration';
import TouristDashboard from './pages/TouristDashboard';
import DestinationDetail from './pages/DestinationDetail';
import AITripPlanner from './pages/AITripPlanner';
import TouristBookings from './pages/TouristBookings';
import GuideDashboard from './pages/GuideDashboard';

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [touristUser, setTouristUser] = useState(null);
  const [guideUser, setGuideUser] = useState(null);

  useEffect(() => {
    const storedTourist = localStorage.getItem('touristUser');
    const storedGuide = localStorage.getItem('guideUser');
    
    if (storedTourist) {
      try { setTouristUser(JSON.parse(storedTourist)); } catch (e) {}
    } else {
      setTouristUser(null);
    }

    if (storedGuide) {
      try { setGuideUser(JSON.parse(storedGuide)); } catch (e) {}
    } else {
      setGuideUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('touristToken');
    localStorage.removeItem('touristUser');
    localStorage.removeItem('guideToken');
    localStorage.removeItem('guideUser');
    setTouristUser(null);
    setGuideUser(null);
    navigate('/');
  };

  return (
    <header style={styles.navHeader}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logoGroup}>
          <div style={styles.logoIcon}>⚡</div>
          <div>
            <span style={styles.logoText}>VeloGuide</span>
            <span style={styles.logoTag}>AI PLATFORM</span>
          </div>
        </Link>

        <nav style={styles.navLinks}>
          <Link to="/" style={location.pathname === '/' ? styles.activeLink : styles.navLink}>
            Home
          </Link>
          <Link to="/explore" style={location.pathname.startsWith('/explore') || location.pathname.startsWith('/destination') ? styles.activeLink : styles.navLink}>
            Explore Destinations
          </Link>
          <Link to="/ai-planner" style={location.pathname === '/ai-planner' ? styles.aiLinkActive : styles.aiLink}>
            ✨ AI Trip Planner
          </Link>
          {touristUser && (
            <Link to="/tourist-bookings" style={location.pathname === '/tourist-bookings' ? styles.activeLink : styles.navLink}>
              🧳 My Bookings
            </Link>
          )}
          {guideUser && (
            <Link to="/guide-dashboard" style={location.pathname === '/guide-dashboard' ? styles.activeLink : styles.navLink}>
              🏡 Guide Workspace
            </Link>
          )}
        </nav>

        <div style={styles.userSection}>
          {touristUser ? (
            <div style={styles.userBadge}>
              <span style={styles.avatarMini}>🧳</span>
              <span style={styles.userName}>{touristUser.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtnSmall}>Sign Out</button>
            </div>
          ) : guideUser ? (
            <div style={styles.userBadge}>
              <span style={styles.avatarMini}>🎖️</span>
              <span style={styles.userName}>{guideUser.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtnSmall}>Sign Out</button>
            </div>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login/tourist" style={styles.loginBtn}>Tourist Login</Link>
              <Link to="/login/guide" style={styles.guideBtn}>Guide Portal</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        <NavigationBar />

        <main style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<LandingGateway />} />
            
            {/* Tourist Authentication */}
            <Route path="/login/tourist" element={<TouristLogin />} />
            <Route path="/register/tourist" element={<TouristRegister />} />
            
            {/* Guide Authentication */}
            <Route path="/login/guide" element={<GuideLogin />} />
            <Route path="/register/guide" element={<GuideRegistration />} />
            
            {/* Core User Platform Pages */}
            <Route path="/explore" element={<TouristDashboard />} />
            <Route path="/destination/:cityName" element={<DestinationDetail />} />
            <Route path="/ai-planner" element={<AITripPlanner />} />
            <Route path="/tourist-bookings" element={<TouristBookings />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.18), transparent 70%), linear-gradient(180deg, #0b0f19 0%, #0f172a 100%)`,
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column'
  },
  navHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
    display: 'block',
    lineHeight: '1.1'
  },
  logoTag: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#38bdf8',
    letterSpacing: '1px'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  navLink: {
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    padding: '6px 12px',
    borderRadius: '8px'
  },
  activeLink: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '6px 12px',
    borderRadius: '8px'
  },
  aiLink: {
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(6, 182, 212, 0.2))',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    color: '#38bdf8',
    fontSize: '14px',
    fontWeight: '700',
    padding: '6px 14px',
    borderRadius: '20px'
  },
  aiLinkActive: {
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    padding: '6px 14px',
    borderRadius: '20px',
    boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center'
  },
  authButtons: {
    display: 'flex',
    gap: '10px'
  },
  loginBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#f8fafc',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.12)'
  },
  guideBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600'
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '6px 12px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  avatarMini: { fontSize: '16px' },
  userName: { fontSize: '13px', fontWeight: '700', color: '#f8fafc' },
  logoutBtnSmall: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    padding: '4px 10px',
    borderRadius: '14px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  mainContent: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    padding: '30px 24px 60px 24px',
    flex: 1
  }
};

export default App;