import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCoins } from '../../context/CoinContext';
import { useAuth } from '../../context/AuthContext';
import VideoCard from '../../components/common/VideoCard';
import VideoModal from '../../components/common/VideoModal';
import './Profile.css';

const API_URL = 'https://i-backend-nve4.onrender.com/api';

export default function Profile() {
    const { coins, coinsEarnedToday, adsWatchedToday, addCoins } = useCoins();
    const { user, isAuthenticated } = useAuth();
    const [savedVideos, setSavedVideos] = useState([]);
    const [myUploads, setMyUploads] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(true);
    const [loadingUploads, setLoadingUploads] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeTab, setActiveTab] = useState('saved');

    const videoCoins = Math.floor(coins * 0.4);
    const adCoins = Math.floor(coins * 0.6);

    // Fetch saved videos
    useEffect(() => {
        const fetchSavedVideos = async () => {
            try {
                setLoadingSaved(true);
                const savedIds = JSON.parse(localStorage.getItem('saved_videos') || '[]');

                if (savedIds.length === 0) {
                    setSavedVideos([]);
                    setLoadingSaved(false);
                    return;
                }

                // Fetch files from API
                const folderId = '1qBOdBEk60VTBpHfEGNX3BeLNFrnfF9ur';
                const response = await fetch(`${API_URL}/files?folderId=${folderId}&limit=50`);
                const data = await response.json();

                if (data.success) {
                    // Filter only saved videos
                    const saved = data.data
                        .filter(file => savedIds.includes(file.id))
                        .filter(file =>
                            file.mimeType?.startsWith('video/') ||
                            file.mimeType?.startsWith('image/')
                        )
                        .map(file => {
                            let rawName = file.name.replace(/\.[^/.]+$/, '');
                            let title = rawName;
                            const categoryMatch = rawName.match(/^\[([^\]]+)\]\s*/);
                            if (categoryMatch) {
                                title = rawName.replace(/^\[[^\]]+\]\s*/, '');
                            }
                            return {
                                id: file.id,
                                title: title,
                                channel: 'I_tube Creator',
                                channelInitial: 'I',
                                views: Math.floor(Math.random() * 1000) + 'K',
                                date: 'Saved',
                                duration: file.mimeType?.startsWith('video/') ? '00:00' : 'Image',
                                coins: 5,
                                thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w640`,
                                webViewLink: file.webViewLink,
                                mimeType: file.mimeType,
                            };
                        });
                    setSavedVideos(saved);
                }
            } catch (error) {
                console.error('Error fetching saved videos:', error);
            } finally {
                setLoadingSaved(false);
            }
        };

        fetchSavedVideos();
    }, []);

    // Fetch user uploads
    useEffect(() => {
        const fetchMyUploads = async () => {
            try {
                setLoadingUploads(true);
                const folderId = '1qBOdBEk60VTBpHfEGNX3BeLNFrnfF9ur';
                const response = await fetch(`${API_URL}/files?folderId=${folderId}&limit=50`);
                const data = await response.json();

                if (data.success) {
                    const uploads = data.data
                        .filter(file =>
                            file.mimeType?.startsWith('video/') ||
                            file.mimeType?.startsWith('image/')
                        )
                        .map(file => {
                            let rawName = file.name.replace(/\.[^/.]+$/, '');
                            let title = rawName;
                            let category = 'General';
                            const categoryMatch = rawName.match(/^\[([^\]]+)\]\s*/);
                            if (categoryMatch) {
                                category = categoryMatch[1];
                                title = rawName.replace(/^\[[^\]]+\]\s*/, '');
                            }
                            return {
                                id: file.id,
                                title: title,
                                category: category,
                                channel: 'You',
                                channelInitial: 'Y',
                                views: Math.floor(Math.random() * 1000) + 'K',
                                date: formatDate(file.createdTime),
                                duration: file.mimeType?.startsWith('video/') ? '00:00' : 'Image',
                                coins: 5,
                                thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w640`,
                                webViewLink: file.webViewLink,
                                mimeType: file.mimeType,
                            };
                        });
                    setMyUploads(uploads);
                }
            } catch (error) {
                console.error('Error fetching uploads:', error);
            } finally {
                setLoadingUploads(false);
            }
        };

        fetchMyUploads();
    }, []);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleCloseModal = () => {
        setSelectedVideo(null);
    };

    const handleEarnCoins = (amount) => {
        addCoins(amount, 'video');
    };

    const handleRemoveSaved = (videoId) => {
        const savedIds = JSON.parse(localStorage.getItem('saved_videos') || '[]');
        const updated = savedIds.filter(id => id !== videoId);
        localStorage.setItem('saved_videos', JSON.stringify(updated));
        setSavedVideos(prev => prev.filter(v => v.id !== videoId));
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <section className="profile-header">
                    <div className="avatar-section">
                        <div className="avatar">
                            {isAuthenticated ? (user?.name?.charAt(0) || 'U') : 'G'}
                        </div>
                        <button className="edit-avatar-btn">📷</button>
                    </div>
                    <div className="user-info">
                        <h1>{isAuthenticated ? user?.name : 'Guest User'}</h1>
                        <p className="user-handle">
                            {isAuthenticated ? `@${user?.email?.split('@')[0] || 'user'}` : '@guest'}
                        </p>
                        <div className="user-stats">
                            <div className="stat">
                                <span className="stat-value">42</span>
                                <span className="stat-label">Videos Watched</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{adsWatchedToday}</span>
                                <span className="stat-label">Ads Today</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{savedVideos.length}</span>
                                <span className="stat-label">Saved</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Saved Videos Section */}
                <section className="saved-section">
                    <div className="section-header">
                        <h2>💾 My Library</h2>
                        <div className="tab-buttons">
                            <button
                                className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                                onClick={() => setActiveTab('saved')}
                            >
                                Saved ({savedVideos.length})
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
                                onClick={() => setActiveTab('uploads')}
                            >
                                My Uploads ({myUploads.length})
                            </button>
                        </div>
                    </div>

                    {/* Saved Videos Tab */}
                    {activeTab === 'saved' && (
                        <>
                            {loadingSaved ? (
                                <div className="loading-saved">
                                    <div className="loading-spinner"></div>
                                    <p>Loading saved videos...</p>
                                </div>
                            ) : savedVideos.length === 0 ? (
                                <div className="empty-saved">
                                    <div className="empty-icon">📚</div>
                                    <h3>No saved videos yet</h3>
                                    <p>Save videos while watching to find them here later!</p>
                                    <Link to="/videos" className="browse-btn">Browse Videos</Link>
                                </div>
                            ) : (
                                <div className="saved-grid">
                                    {savedVideos.map(video => (
                                        <div key={video.id} className="saved-video-wrapper">
                                            <VideoCard
                                                video={video}
                                                onClick={() => handleVideoClick(video)}
                                            />
                                            <button
                                                className="remove-saved-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveSaved(video.id);
                                                }}
                                            >
                                                ✕ Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* My Uploads Tab */}
                    {activeTab === 'uploads' && (
                        <>
                            {loadingUploads ? (
                                <div className="loading-saved">
                                    <div className="loading-spinner"></div>
                                    <p>Loading your uploads...</p>
                                </div>
                            ) : myUploads.length === 0 ? (
                                <div className="empty-saved">
                                    <div className="empty-icon">📤</div>
                                    <h3>No uploads yet</h3>
                                    <p>Share your content with the world!</p>
                                    <Link to="/upload" className="browse-btn">Upload Video</Link>
                                </div>
                            ) : (
                                <div className="saved-grid">
                                    {myUploads.map(video => (
                                        <div key={video.id} className="saved-video-wrapper">
                                            <VideoCard
                                                video={video}
                                                onClick={() => handleVideoClick(video)}
                                            />
                                            <span className="upload-category">{video.category}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* Wallet Section */}
                <section className="wallet-section">
                    <h2>💰 My Wallet</h2>
                    <div className="wallet-cards">
                        <div className="wallet-card main-balance">
                            <div className="wallet-icon">🪙</div>
                            <div className="wallet-info">
                                <span className="wallet-label">Total Coins</span>
                                <span className="wallet-value">{coins}</span>
                            </div>
                            <div className="wallet-trend positive">
                                <span>↑ +{coinsEarnedToday} today</span>
                            </div>
                        </div>
                        <div className="wallet-card">
                            <div className="wallet-icon">📹</div>
                            <div className="wallet-info">
                                <span className="wallet-label">From Videos</span>
                                <span className="wallet-value">{videoCoins}</span>
                            </div>
                        </div>
                        <div className="wallet-card">
                            <div className="wallet-icon">📺</div>
                            <div className="wallet-info">
                                <span className="wallet-label">From Ads</span>
                                <span className="wallet-value">{adCoins}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Earnings Chart */}
                <section className="history-section">
                    <div className="section-header">
                        <h2>📊 Earnings History</h2>
                        <select>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>All Time</option>
                        </select>
                    </div>
                    <div className="earnings-chart">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                            <div
                                key={day}
                                className={`chart-bar ${day === 'Sun' ? 'active' : ''}`}
                                style={{ '--height': `${30 + Math.random() * 70}%` }}
                                data-day={day}
                                data-coins={Math.floor(20 + Math.random() * 30)}
                            ></div>
                        ))}
                    </div>
                </section>

                {/* Redeem Section */}
                <section className="redeem-section">
                    <h2>🎁 Redeem Coins</h2>
                    <div className="redeem-grid">
                        <div className="redeem-card">
                            <div className="redeem-icon">👑</div>
                            <h3>1 Month Premium</h3>
                            <p className="redeem-cost">5000 🪙</p>
                            <button className="redeem-btn">Redeem</button>
                        </div>
                        <div className="redeem-card">
                            <div className="redeem-icon">🎁</div>
                            <h3>₹100 Gift Card</h3>
                            <p className="redeem-cost">2000 🪙</p>
                            <button className="redeem-btn">Redeem</button>
                        </div>
                        <div className="redeem-card">
                            <div className="redeem-icon">🎨</div>
                            <h3>Exclusive Theme</h3>
                            <p className="redeem-cost">500 🪙</p>
                            <button className="redeem-btn">Redeem</button>
                        </div>
                        <div className="redeem-card">
                            <div className="redeem-icon">🏆</div>
                            <h3>Profile Badge</h3>
                            <p className="redeem-cost">200 🪙</p>
                            <button className="redeem-btn">Redeem</button>
                        </div>
                    </div>
                </section>

                {/* Settings */}
                <section className="settings-section">
                    <h2>⚙️ Settings</h2>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <span className="setting-icon">🔔</span>
                                <span>Push Notifications</span>
                            </div>
                            <label className="toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <span className="setting-icon">🌙</span>
                                <span>Dark Mode</span>
                            </div>
                            <label className="toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <Link to="/premium" className="setting-item clickable">
                            <div className="setting-info">
                                <span className="setting-icon">👑</span>
                                <span>Upgrade to Premium</span>
                            </div>
                            <span className="setting-arrow">→</span>
                        </Link>
                    </div>
                </section>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    onClose={handleCloseModal}
                    onEarnCoins={handleEarnCoins}
                />
            )}
        </div>
    );
}

function formatDate(dateString) {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
}
