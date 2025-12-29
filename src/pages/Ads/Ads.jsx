import { useState, useEffect } from 'react';
import { useCoins } from '../../context/CoinContext';
import './Ads.css';

const ADS = [
    { id: 1, icon: '🎮', name: 'Gaming', reward: 20, duration: 15 },
    { id: 2, icon: '🛒', name: 'Shopping', reward: 20, duration: 15 },
    { id: 3, icon: '🍔', name: 'Food', reward: 20, duration: 15 },
    { id: 4, icon: '🚗', name: 'Auto', reward: 20, duration: 15 },
    { id: 5, icon: '📱', name: 'Tech', reward: 20, duration: 15 },
    { id: 6, icon: '✈️', name: 'Travel', reward: 20, duration: 15 },
    { id: 7, icon: '💄', name: 'Beauty', reward: 20, duration: 15 },
    { id: 8, icon: '🏠', name: 'Home', reward: 20, duration: 15 },
    { id: 9, icon: '📚', name: 'Education', reward: 20, duration: 15 },
    { id: 10, icon: '🎬', name: 'Entertainment', reward: 20, duration: 15 },
];

const AD_IMAGES = [
    'https://picsum.photos/seed/ad1/800/450',
    'https://picsum.photos/seed/ad2/800/450',
    'https://picsum.photos/seed/ad3/800/450',
    'https://picsum.photos/seed/ad4/800/450',
    'https://picsum.photos/seed/ad5/800/450',
];

export default function Ads() {
    const { coins, addCoins, adsWatchedToday, coinsEarnedToday } = useCoins();
    const [watchedAds, setWatchedAds] = useState(() => {
        const saved = localStorage.getItem('watchedAds');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentAd, setCurrentAd] = useState(null);
    const [adState, setAdState] = useState('idle'); // idle, playing, complete
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        localStorage.setItem('watchedAds', JSON.stringify(watchedAds));
    }, [watchedAds]);

    useEffect(() => {
        let timer;
        if (adState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
                setProgress(prev => prev + (100 / currentAd.duration));
            }, 1000);
        } else if (adState === 'playing' && timeLeft === 0) {
            completeAd();
        }
        return () => clearTimeout(timer);
    }, [adState, timeLeft]);

    const startAd = (ad) => {
        if (watchedAds.includes(ad.id)) return;
        setCurrentAd(ad);
        setAdState('playing');
        setTimeLeft(ad.duration);
        setProgress(0);
    };

    const completeAd = () => {
        setAdState('complete');
        setWatchedAds(prev => [...prev, currentAd.id]);
        addCoins(currentAd.reward, 'ad');
    };

    const watchAnother = () => {
        const nextAd = ADS.find(ad => !watchedAds.includes(ad.id));
        if (nextAd) {
            startAd(nextAd);
        } else {
            setAdState('idle');
            setCurrentAd(null);
        }
    };

    const resetToIdle = () => {
        setAdState('idle');
        setCurrentAd(null);
    };

    const adsRemaining = ADS.length - watchedAds.length;

    return (
        <div className="ads-page">
            <div className="ads-container">
                {/* Header */}
                <header className="page-header">
                    <div className="header-icon">💰</div>
                    <h1>Watch Ads & Earn More</h1>
                    <p>Each ad you watch earns you <span className="highlight">+20 coins</span></p>
                </header>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-info">
                            <span className="stat-value">{adsWatchedToday}</span>
                            <span className="stat-label">Ads Watched Today</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💵</div>
                        <div className="stat-info">
                            <span className="stat-value">{coinsEarnedToday}</span>
                            <span className="stat-label">Coins Earned Today</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-info">
                            <span className="stat-value">{adsRemaining}</span>
                            <span className="stat-label">Ads Available</span>
                        </div>
                    </div>
                </div>

                {/* Ad Player Section */}
                <div className="ad-section">
                    <div className="ad-player">
                        {adState === 'idle' && (
                            <div className="ad-placeholder" onClick={() => {
                                const nextAd = ADS.find(ad => !watchedAds.includes(ad.id));
                                if (nextAd) startAd(nextAd);
                            }}>
                                <div className="play-icon">▶</div>
                                <p>{adsRemaining > 0 ? 'Click to watch an ad' : 'All ads watched!'}</p>
                                {adsRemaining > 0 && <span className="reward-preview">+20 🪙</span>}
                            </div>
                        )}

                        {adState === 'playing' && currentAd && (
                            <div className="ad-playing">
                                <div className="ad-content">
                                    <img
                                        src={AD_IMAGES[Math.floor(Math.random() * AD_IMAGES.length)]}
                                        alt="Ad"
                                    />
                                    <div className="ad-overlay">
                                        <span className="ad-label">AD</span>
                                        <div className="ad-timer">{timeLeft}</div>
                                    </div>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}

                        {adState === 'complete' && (
                            <div className="ad-complete">
                                <div className="success-animation">
                                    <div className="checkmark">✓</div>
                                </div>
                                <h3>Congratulations!</h3>
                                <p className="coins-earned">+20 Coins Earned!</p>
                                <button className="watch-another-btn" onClick={watchAnother}>
                                    {adsRemaining > 1 ? 'Watch Another Ad' : 'Done'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ad Queue */}
                <div className="ad-queue">
                    <h2>Available Ads</h2>
                    <div className="queue-grid">
                        {ADS.map(ad => (
                            <div
                                key={ad.id}
                                className={`queue-item ${watchedAds.includes(ad.id) ? 'watched' : ''}`}
                                onClick={() => !watchedAds.includes(ad.id) && startAd(ad)}
                            >
                                <div className="ad-icon">{ad.icon}</div>
                                <div className="ad-reward">
                                    {watchedAds.includes(ad.id) ? '✓ Done' : `+${ad.reward} 🪙`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="tips-section">
                    <h3>💡 Tips to Earn More</h3>
                    <ul>
                        <li>Watch up to 10 ads per day for maximum earnings</li>
                        <li>Complete each ad to receive full rewards</li>
                        <li>Check back daily for new ads</li>
                        <li>Combine with video watching for even more coins!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
