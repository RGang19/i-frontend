import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCoins } from '../../context/CoinContext';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();
    const { coins } = useCoins();
    const { user, isAuthenticated, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const isHome = location.pathname === '/';

    if (isHome) return null;

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="4" width="20" height="16" rx="3" fill="url(#logoGradient)" />
                                <path d="M10 8.5V15.5L16 12L10 8.5Z" fill="white" />
                                <defs>
                                    <linearGradient id="logoGradient" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FF0844" />
                                        <stop offset="1" stopColor="#FFB199" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="logo-text">I<span className="underscore">_</span>tube</span>
                    </Link>
                </div>

                <div className="nav-center">
                    <Link to="/videos" className={`nav-link ${location.pathname === '/videos' ? 'active' : ''}`}>
                        Videos
                    </Link>
                    <Link to="/ads" className={`nav-link ${location.pathname === '/ads' ? 'active' : ''}`}>
                        Earn
                    </Link>
                    <Link to="/upload" className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
                        Upload
                    </Link>
                    <Link to="/premium" className={`nav-link ${location.pathname === '/premium' ? 'active' : ''}`}>
                        Premium
                    </Link>
                </div>

                <div className="nav-right">
                    <div className="coins-display">
                        <span className="coin-icon">🪙</span>
                        <span className="coin-count">{coins}</span>
                    </div>

                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="user-avatar">
                                {user?.avatar || user?.name?.charAt(0) || 'U'}
                            </Link>
                            <button className="auth-btn logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button className="auth-btn login-btn" onClick={() => setShowAuthModal(true)}>
                            Login
                        </button>
                    )}
                </div>
            </nav>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
}
