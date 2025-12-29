import { useState, useEffect } from 'react';
import './VideoModal.css';

// LocalStorage keys
const getInteractionKey = (videoId) => `video_interactions_${videoId}`;
const getSavedVideosKey = () => 'saved_videos';

export default function VideoModal({ video, onClose, onEarnCoins }) {
    const [showCoinPopup, setShowCoinPopup] = useState(false);
    const [hasEarned, setHasEarned] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [copied, setCopied] = useState(false);

    // Interaction states
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load interactions from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem(getInteractionKey(video.id));
        if (storedData) {
            const data = JSON.parse(storedData);
            setLikes(data.likes || 0);
            setDislikes(data.dislikes || 0);
            setUserLiked(data.userLiked || false);
            setUserDisliked(data.userDisliked || false);
        } else {
            // Initialize with random numbers for new videos
            const initialLikes = Math.floor(Math.random() * 500) + 10;
            const initialDislikes = Math.floor(Math.random() * 50);
            setLikes(initialLikes);
            setDislikes(initialDislikes);
        }

        // Check if video is saved
        const savedVideos = JSON.parse(localStorage.getItem(getSavedVideosKey()) || '[]');
        setSaved(savedVideos.includes(video.id));
    }, [video.id]);

    // Save interactions to localStorage
    const saveInteractions = (newLikes, newDislikes, liked, disliked) => {
        localStorage.setItem(getInteractionKey(video.id), JSON.stringify({
            likes: newLikes,
            dislikes: newDislikes,
            userLiked: liked,
            userDisliked: disliked,
        }));
    };

    const handleLike = () => {
        let newLikes = likes;
        let newDislikes = dislikes;
        let liked = userLiked;
        let disliked = userDisliked;

        if (userLiked) {
            // Remove like
            newLikes = likes - 1;
            liked = false;
        } else {
            // Add like
            newLikes = likes + 1;
            liked = true;
            // Remove dislike if exists
            if (userDisliked) {
                newDislikes = dislikes - 1;
                disliked = false;
            }
        }

        setLikes(newLikes);
        setDislikes(newDislikes);
        setUserLiked(liked);
        setUserDisliked(disliked);
        saveInteractions(newLikes, newDislikes, liked, disliked);
    };

    const handleDislike = () => {
        let newLikes = likes;
        let newDislikes = dislikes;
        let liked = userLiked;
        let disliked = userDisliked;

        if (userDisliked) {
            // Remove dislike
            newDislikes = dislikes - 1;
            disliked = false;
        } else {
            // Add dislike
            newDislikes = dislikes + 1;
            disliked = true;
            // Remove like if exists
            if (userLiked) {
                newLikes = likes - 1;
                liked = false;
            }
        }

        setLikes(newLikes);
        setDislikes(newDislikes);
        setUserLiked(liked);
        setUserDisliked(disliked);
        saveInteractions(newLikes, newDislikes, liked, disliked);
    };

    const handleShare = () => {
        setShowSharePopup(true);
    };

    const copyLink = async () => {
        const shareUrl = video.webViewLink || `https://i-tube.netlify.app/watch/${video.id}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSave = () => {
        const savedVideos = JSON.parse(localStorage.getItem(getSavedVideosKey()) || '[]');

        if (saved) {
            // Remove from saved
            const updated = savedVideos.filter(id => id !== video.id);
            localStorage.setItem(getSavedVideosKey(), JSON.stringify(updated));
            setSaved(false);
        } else {
            // Add to saved
            savedVideos.push(video.id);
            localStorage.setItem(getSavedVideosKey(), JSON.stringify(savedVideos));
            setSaved(true);
        }
    };

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

    const formatCount = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="video-modal">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>✕</button>

                <div className="video-player">
                    {video.mimeType?.startsWith('video/') ? (
                        <iframe
                            src={`https://drive.google.com/file/d/${video.id}/preview`}
                            className="video-element"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title={video.title}
                        />
                    ) : (
                        <>
                            <img src={video.thumbnail} alt={video.title} className="video-poster" />
                            <div className="play-overlay">
                                <a href={video.webViewLink} target="_blank" rel="noopener noreferrer" className="play-btn">▶</a>
                            </div>
                        </>
                    )}
                </div>

                <div className="video-info">
                    <h2>{video.title}</h2>
                    <div className="video-stats">
                        <span>{video.views} views</span>
                        <span>{video.date}</span>
                    </div>
                    <div className="video-actions">
                        <button
                            className={`action-btn ${userLiked ? 'active liked' : ''}`}
                            onClick={handleLike}
                        >
                            <span>👍</span> {formatCount(likes)}
                        </button>
                        <button
                            className={`action-btn ${userDisliked ? 'active disliked' : ''}`}
                            onClick={handleDislike}
                        >
                            <span>👎</span> {formatCount(dislikes)}
                        </button>
                        <button className="action-btn" onClick={handleShare}>
                            <span>↗️</span> Share
                        </button>
                        <button
                            className={`action-btn ${saved ? 'active saved' : ''}`}
                            onClick={handleSave}
                        >
                            <span>{saved ? '✅' : '💾'}</span> {saved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Share Popup */}
                {showSharePopup && (
                    <div className="share-popup">
                        <div className="share-popup-content">
                            <button className="close-share-btn" onClick={() => setShowSharePopup(false)}>✕</button>
                            <h3>Share this video</h3>
                            <div className="share-link">
                                <input
                                    type="text"
                                    value={video.webViewLink || `https://i-tube.netlify.app/watch/${video.id}`}
                                    readOnly
                                />
                                <button onClick={copyLink}>
                                    {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="share-icons">
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(video.webViewLink || '')}&text=${encodeURIComponent(video.title)}`} target="_blank" rel="noopener noreferrer" className="share-icon twitter">𝕏</a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(video.webViewLink || '')}`} target="_blank" rel="noopener noreferrer" className="share-icon facebook">f</a>
                                <a href={`https://wa.me/?text=${encodeURIComponent(video.title + ' ' + (video.webViewLink || ''))}`} target="_blank" rel="noopener noreferrer" className="share-icon whatsapp">W</a>
                            </div>
                        </div>
                    </div>
                )}

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
