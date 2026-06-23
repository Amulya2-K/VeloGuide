import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingGateway from './pages/LandingGateway';
import TouristLogin from './pages/TouristLogin';
import GuideLogin from './pages/GuideLogin';
import TouristDashboard from './pages/TouristDashboard';
import DestinationDetail from './pages/DestinationDetail';
import GuideRegistration from './pages/GuideRegistration';
import GuideDashboard from './pages/GuideDashboard';

function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        {/* Global Transparent Blur Navbar */}
        <nav style={styles.navbar}>
          <Link to="/" style={styles.navLogo}>📍 LocalGuide Link</Link>
          <span style={styles.tagline}>Community Empowerment & Safety Portal</span>
        </nav>

        {/* Scrollable layout area */}
        <main style={styles.mainContent}>
          <Routes>
            {/* Core Gateway Routes */}
            <Route path="/" element={<LandingGateway />} />
            
            {/* Authentication Portals */}
            <Route path="/login/tourist" element={<TouristLogin />} />
            <Route path="/login/guide" element={<GuideLogin />} />
            
            <Route path="/register/guide" element={<GuideRegistration />} /> 
            
            {/* Active User Spaces */}
            <Route path="/explore" element={<TouristDashboard />} />
            <Route path="/destination/:cityName" element={<DestinationDetail />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Poppins', sans-serif",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1920')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  navLogo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#007bff',
    textDecoration: 'none'
  },
  tagline: {
    fontSize: '13px',
    color: '#555',
    fontWeight: '500',
    fontStyle: 'italic'
  },
  mainContent: {
    padding: '40px 20px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
    flex: 1
  }
};

export default App;