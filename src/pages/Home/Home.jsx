import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    const handleWorkspaceClick = (workspace) => {
        navigate(`/${workspace}`);
    };

    return (
        <div className="home">
            {/* Animated Background */}
            <div className="bg-animation">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {/* Main Container */}
            <div className="home-container">
                {/* Logo Section */}
                <header className="header">
                    <div className="logo">
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
                        <h1 className="logo-text">I<span className="underscore">_</span>tube</h1>
                    </div>
                    <p className="tagline">Watch • Earn • Enjoy</p>
                </header>

                {/* Workspace Cards */}
                <main className="workspaces">
                    {/* Videos Card */}
                    <div
                        className="workspace-card card-videos"
                        onClick={() => handleWorkspaceClick('videos')}
                    >
                        <div className="card-glow"></div>
                        <div className="card-content">
                            <div className="card-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M10 9V15L15 12L10 9Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h2 className="card-title">Videos</h2>
                            <p className="card-subtitle">watch and earn</p>
                            <div className="card-badge">
                                <span className="coin-icon">🪙</span>
                                <span>+5 coins/video</span>
                            </div>
                        </div>
                        <div className="card-decoration">
                            <div className="floating-icon">▶️</div>
                            <div className="floating-icon delay-1">🎬</div>
                            <div className="floating-icon delay-2">📺</div>
                        </div>
                    </div>

                    {/* Ads Card */}
                    <div
                        className="workspace-card card-ads"
                        onClick={() => handleWorkspaceClick('ads')}
                    >
                        <div className="card-glow"></div>
                        <div className="card-content">
                            <div className="card-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h2 className="card-title">Only Watch Ads</h2>
                            <p className="card-subtitle">watch and earn more</p>
                            <div className="card-badge badge-gold">
                                <span className="coin-icon">💰</span>
                                <span>+20 coins/ad</span>
                            </div>
                        </div>
                        <div className="card-decoration">
                            <div className="floating-icon">💵</div>
                            <div className="floating-icon delay-1">💎</div>
                            <div className="floating-icon delay-2">🏆</div>
                        </div>
                    </div>

                    {/* Premium Card */}
                    <div
                        className="workspace-card card-premium"
                        onClick={() => handleWorkspaceClick('premium')}
                    >
                        <div className="card-glow"></div>
                        <div className="card-content">
                            <div className="card-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="card-title">Premium</h2>
                            <p className="card-subtitle">seamless watching</p>
                            <div className="card-badge badge-premium">
                                <span className="badge-icon">👑</span>
                                <span>No Ads Ever</span>
                            </div>
                        </div>
                        <div className="card-decoration">
                            <div className="floating-icon">⭐</div>
                            <div className="floating-icon delay-1">✨</div>
                            <div className="floating-icon delay-2">👑</div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer">
                    <p>Choose your experience and start watching</p>
                </footer>
            </div>
        </div>
    );
}
