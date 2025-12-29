import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CoinProvider } from './context/CoinContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Videos from './pages/Videos/Videos';
import Ads from './pages/Ads/Ads';
import Premium from './pages/Premium/Premium';
import Profile from './pages/Profile/Profile';
import Upload from './pages/Upload/Upload';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CoinProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </Router>
      </CoinProvider>
    </AuthProvider>
  );
}

export default App;

