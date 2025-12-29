import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CoinProvider } from './context/CoinContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home/Home';
import Videos from './pages/Videos/Videos';
import Ads from './pages/Ads/Ads';
import Premium from './pages/Premium/Premium';
import Profile from './pages/Profile/Profile';
import Upload from './pages/Upload/Upload';
import './index.css';

function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar />
      {!isHome && (
        <Sidebar
          isExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        />
      )}
      <main className={`main-content ${!isHome ? (sidebarExpanded ? 'with-sidebar-expanded' : 'with-sidebar-collapsed') : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CoinProvider>
          <Router>
            <MainLayout />
          </Router>
        </CoinProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

