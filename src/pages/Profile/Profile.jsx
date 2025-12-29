import { Link } from 'react-router-dom';
import { useCoins } from '../../context/CoinContext';
import './Profile.css';

export default function Profile() {
    const { coins, coinsEarnedToday, adsWatchedToday } = useCoins();

    const videoCoins = Math.floor(coins * 0.4);
    const adCoins = Math.floor(coins * 0.6);

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <section className="profile-header">
                    <div className="avatar-section">
                        <div className="avatar">R</div>
                        <button className="edit-avatar-btn">📷</button>
                    </div>
                    <div className="user-info">
                        <h1>Rahul</h1>
                        <p className="user-handle">@rahul_user</p>
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
                                <span className="stat-value">7</span>
                                <span className="stat-label">Days Active</span>
                            </div>
                        </div>
                    </div>
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
        </div>
    );
}
