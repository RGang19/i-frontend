import { useState, useEffect } from 'react';
import { useCoins } from '../../context/CoinContext';
import VideoCard from '../../components/common/VideoCard';
import VideoModal from '../../components/common/VideoModal';
import './Videos.css';

const API_URL = 'https://i-backend-nve4.onrender.com/api';

const CATEGORIES = ['All', 'Gaming', 'Music', 'Movies', 'Live', 'Tech', 'Sports', 'News'];

export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { addCoins, coinsEarnedToday } = useCoins();

    // Fetch videos from API
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/files?limit=50`);
                const data = await response.json();

                if (data.success) {
                    // Filter only video/image files and format for display
                    const mediaFiles = data.data
                        .filter(file =>
                            file.mimeType?.startsWith('video/') ||
                            file.mimeType?.startsWith('image/')
                        )
                        .map(file => ({
                            id: file.id,
                            title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                            channel: 'I_tube Creator',
                            channelInitial: 'I',
                            views: Math.floor(Math.random() * 1000) + 'K',
                            date: formatDate(file.createdTime),
                            duration: file.mimeType?.startsWith('video/') ? '00:00' : 'Image',
                            coins: 5,
                            thumbnail: file.mimeType?.startsWith('image/')
                                ? `https://drive.google.com/thumbnail?id=${file.id}&sz=w640`
                                : `https://picsum.photos/seed/${file.id}/640/360`,
                            webViewLink: file.webViewLink,
                            mimeType: file.mimeType,
                        }));

                    setVideos(mediaFiles);
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleCloseModal = () => {
        setSelectedVideo(null);
    };

    const handleEarnCoins = (amount) => {
        addCoins(amount, 'video');
    };

    return (
        <div className="videos-page">
            <div className="videos-content">
                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="search-btn">🔍</button>
                    </div>
                </div>

                {/* Categories */}
                <div className="categories">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Earning Banner */}
                <div className="earning-banner">
                    <div className="banner-content">
                        <h3>🎉 Earn coins while watching!</h3>
                        <p>Watch any video to earn <span className="highlight">+5 coins</span></p>
                    </div>
                    <div className="banner-progress">
                        <span>Today's earnings: <strong>{coinsEarnedToday} coins</strong></span>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading videos...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredVideos.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📹</div>
                        <h3>No videos yet</h3>
                        <p>Upload your first video to get started!</p>
                    </div>
                )}

                {/* Video Grid */}
                {!loading && filteredVideos.length > 0 && (
                    <div className="video-grid animate-grid">
                        {filteredVideos.map(video => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onClick={() => handleVideoClick(video)}
                            />
                        ))}
                    </div>
                )}
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
