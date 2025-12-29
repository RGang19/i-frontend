import { useState, useEffect } from 'react';
import './VideoModal.css';

export default function VideoModal({ video, onClose, onEarnCoins }) {
    const [showCoinPopup, setShowCoinPopup] = useState(false);
    const [hasEarned, setHasEarned] = useState(false);

    useEffect(() => {
        // Simulate earning coins after watching for 2 seconds
        const timer = setTimeout(() => {
            if (!hasEarned) {
                onEarnCoins(video.coins);
                setHasEarned(true);
                setShowCoinPopup(true);

                setTimeout(() => setShowCoinPopup(false), 3000);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [video, onEarnCoins, hasEarned]);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="video-modal">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>✕</button>

                <div className="video-player">
                    <img src={video.thumbnail} alt={video.title} className="video-poster" />
                    <div className="play-overlay">
                        <div className="play-btn">▶</div>
                    </div>
                </div>

                <div className="video-info">
                    <h2>{video.title}</h2>
                    <div className="video-stats">
                        <span>{video.views} views</span>
                        <span>{video.date}</span>
                    </div>
                    <div className="video-actions">
                        <button className="action-btn">
                            <span>👍</span> Like
                        </button>
                        <button className="action-btn">
                            <span>👎</span> Dislike
                        </button>
                        <button className="action-btn">
                            <span>↗️</span> Share
                        </button>
                        <button className="action-btn">
                            <span>💾</span> Save
                        </button>
                    </div>
                </div>

                {showCoinPopup && (
                    <div className="coin-earned-popup">
                        <span className="coin-icon">🪙</span>
                        <span>+{video.coins} Coins Earned!</span>
                    </div>
                )}
            </div>
        </div>
    );
}
