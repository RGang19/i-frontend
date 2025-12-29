import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './VideoModal.css';

const API_URL = 'https://i-backend-nve4.onrender.com/api';

// LocalStorage keys for saved videos only
const getSavedVideosKey = () => 'saved_videos';

export default function VideoModal({ video, onClose, onEarnCoins }) {
    const { user, isAuthenticated } = useAuth();
    const [showCoinPopup, setShowCoinPopup] = useState(false);
    const [hasEarned, setHasEarned] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    // Stats from API
    const [views, setViews] = useState(0);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [saved, setSaved] = useState(false);

    // Comments
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    // Get user ID (use email or generate anonymous ID)
    const getUserId = () => {
        if (isAuthenticated && user?.email) {
            return user.email;
        }
        let anonId = localStorage.getItem('anon_user_id');
        if (!anonId) {
            anonId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('anon_user_id', anonId);
        }
        return anonId;
    };

    // Load stats from API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/stats/${video.id}`);
                const data = await response.json();

                if (data.success) {
                    const stats = data.data;
                    setViews(stats.views || 0);
                    setLikes(stats.likes || 0);
                    setDislikes(stats.dislikes || 0);
                    setComments(stats.comments || []);

                    // Check if user liked/disliked
                    const userId = getUserId();
                    setUserLiked(stats.likedBy?.includes(userId) || false);
                    setUserDisliked(stats.dislikedBy?.includes(userId) || false);
                }

                // Increment view count
                await fetch(`${API_URL}/stats/${video.id}/view`, { method: 'POST' });
                setViews(prev => prev + 1);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Check if video is saved (local)
        const savedVideos = JSON.parse(localStorage.getItem(getSavedVideosKey()) || '[]');
        setSaved(savedVideos.includes(video.id));
    }, [video.id]);

    // Handle like
    const handleLike = async () => {
        const userId = getUserId();
        const action = userLiked ? 'remove' : 'add';

        try {
            const response = await fetch(`${API_URL}/stats/${video.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action }),
            });
            const data = await response.json();

            if (data.success) {
                setLikes(data.data.likes);
                setDislikes(data.data.dislikes);
                setUserLiked(!userLiked);
                if (!userLiked) setUserDisliked(false);
            }
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    // Handle dislike
    const handleDislike = async () => {
        const userId = getUserId();
        const action = userDisliked ? 'remove' : 'add';

        try {
            const response = await fetch(`${API_URL}/stats/${video.id}/dislike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action }),
            });
            const data = await response.json();

            if (data.success) {
                setLikes(data.data.likes);
                setDislikes(data.data.dislikes);
                setUserDisliked(!userDisliked);
                if (!userDisliked) setUserLiked(false);
            }
        } catch (error) {
            console.error('Error updating dislike:', error);
        }
    };

    // Handle add comment
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const userId = getUserId();
        const userName = isAuthenticated ? user?.name : 'Guest';

        try {
            const response = await fetch(`${API_URL}/stats/${video.id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userName,
                    text: newComment.trim(),
                    avatar: isAuthenticated ? (user?.name?.charAt(0) || '👤') : '👤',
                }),
            });
            const data = await response.json();

            if (data.success) {
                setComments(prev => [data.data, ...prev]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Handle delete comment
    const handleDeleteComment = async (commentId) => {
        try {
            await fetch(`${API_URL}/stats/${video.id}/comment/${commentId}`, {
                method: 'DELETE',
            });
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const handleShare = () => {
        setShowSharePopup(true);
    };

    const copyLink = () => {
        const link = video.webViewLink || `https://i-tube.netlify.app/watch/${video.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = () => {
        const savedVideos = JSON.parse(localStorage.getItem(getSavedVideosKey()) || '[]');

        if (saved) {
            const updated = savedVideos.filter(id => id !== video.id);
            localStorage.setItem(getSavedVideosKey(), JSON.stringify(updated));
            setSaved(false);
        } else {
            savedVideos.push(video.id);
            localStorage.setItem(getSavedVideosKey(), JSON.stringify(savedVideos));
            setSaved(true);
        }
    };

    // Earn coins after watching
    useEffect(() => {
        if (hasEarned) return;

        const timer = setTimeout(() => {
            if (onEarnCoins && video.coins) {
                onEarnCoins(video.coins);
                setHasEarned(true);
                setShowCoinPopup(true);
                setTimeout(() => setShowCoinPopup(false), 3000);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [hasEarned, onEarnCoins, video.coins]);

    const formatCount = (count) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count.toString();
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

                {/* Fallback link for videos still processing */}
                {video.mimeType?.startsWith('video/') && video.webViewLink && (
                    <div className="video-fallback">
                        <span>Video not loading?</span>
                        <a href={video.webViewLink} target="_blank" rel="noopener noreferrer">
                            Watch on Google Drive →
                        </a>
                    </div>
                )}

                <div className="video-info">
                    <h2>{video.title}</h2>
                    <div className="video-stats">
                        <span>{formatCount(views)} views</span>
                        <span>{video.date}</span>
                    </div>
                    <div className="video-actions">
                        <button
                            className={`action-btn ${userLiked ? 'active liked' : ''}`}
                            onClick={handleLike}
                            disabled={loading}
                        >
                            <span>👍</span> {formatCount(likes)}
                        </button>
                        <button
                            className={`action-btn ${userDisliked ? 'active disliked' : ''}`}
                            onClick={handleDislike}
                            disabled={loading}
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

                {/* Comments Section */}
                <div className="comments-section">
                    <button
                        className="comments-toggle"
                        onClick={() => setShowComments(!showComments)}
                    >
                        💬 Comments ({comments.length})
                        <span className={`toggle-arrow ${showComments ? 'open' : ''}`}>▼</span>
                    </button>

                    {showComments && (
                        <div className="comments-content">
                            <div className="add-comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button onClick={handleAddComment} disabled={!newComment.trim()}>
                                    Post
                                </button>
                            </div>

                            <div className="comments-list">
                                {comments.length === 0 ? (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-avatar">{comment.avatar || '👤'}</div>
                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <span className="comment-author">{comment.userName || 'Guest'}</span>
                                                    <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                                                </div>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                            {comment.userId === getUserId() && (
                                                <button
                                                    className="delete-comment"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
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
