import { useState } from 'react';
import { useCoins } from '../../context/CoinContext';
import VideoCard from '../../components/common/VideoCard';
import VideoModal from '../../components/common/VideoModal';
import './Videos.css';

const VIDEOS = [
    { id: 1, title: "Amazing Nature Documentary - 4K Ultra HD", channel: "Nature World", channelInitial: "N", views: "2.5M", date: "2 days ago", duration: "12:45", coins: 5, thumbnail: "https://picsum.photos/seed/nature1/640/360" },
    { id: 2, title: "Learn JavaScript in 30 Minutes - Beginner Tutorial", channel: "Code Academy", channelInitial: "C", views: "1.2M", date: "1 week ago", duration: "30:12", coins: 5, thumbnail: "https://picsum.photos/seed/code1/640/360" },
    { id: 3, title: "Best Gaming Moments 2024 Compilation", channel: "GameZone", channelInitial: "G", views: "5.8M", date: "3 days ago", duration: "18:30", coins: 5, thumbnail: "https://picsum.photos/seed/gaming1/640/360" },
    { id: 4, title: "Relaxing Music for Study and Focus", channel: "Chill Vibes", channelInitial: "C", views: "10M", date: "1 month ago", duration: "3:00:00", coins: 5, thumbnail: "https://picsum.photos/seed/music1/640/360" },
    { id: 5, title: "Top 10 Travel Destinations 2024", channel: "Travel Guide", channelInitial: "T", views: "890K", date: "5 days ago", duration: "15:22", coins: 5, thumbnail: "https://picsum.photos/seed/travel1/640/360" },
    { id: 6, title: "Cooking Masterclass: Italian Pasta", channel: "Chef's Kitchen", channelInitial: "C", views: "3.2M", date: "2 weeks ago", duration: "22:15", coins: 5, thumbnail: "https://picsum.photos/seed/food1/640/360" },
    { id: 7, title: "SpaceX Starship Launch Highlights", channel: "Space News", channelInitial: "S", views: "8.1M", date: "4 days ago", duration: "8:45", coins: 5, thumbnail: "https://picsum.photos/seed/space1/640/360" },
    { id: 8, title: "Workout Routine for Beginners - Full Body", channel: "FitLife", channelInitial: "F", views: "4.5M", date: "1 week ago", duration: "25:00", coins: 5, thumbnail: "https://picsum.photos/seed/fitness1/640/360" },
    { id: 9, title: "AI Revolution: What's Coming in 2025", channel: "Tech Insider", channelInitial: "T", views: "2.1M", date: "6 days ago", duration: "19:30", coins: 5, thumbnail: "https://picsum.photos/seed/tech1/640/360" },
    { id: 10, title: "Cute Cat Compilation - Try Not to Smile", channel: "Pet Paradise", channelInitial: "P", views: "15M", date: "3 weeks ago", duration: "10:00", coins: 5, thumbnail: "https://picsum.photos/seed/cats1/640/360" },
    { id: 11, title: "Guitar Tutorial for Absolute Beginners", channel: "Music Lessons", channelInitial: "M", views: "950K", date: "2 weeks ago", duration: "45:00", coins: 5, thumbnail: "https://picsum.photos/seed/guitar1/640/360" },
    { id: 12, title: "Movie Trailer Breakdown: Upcoming Releases", channel: "Cinema Hub", channelInitial: "C", views: "1.8M", date: "1 day ago", duration: "16:20", coins: 5, thumbnail: "https://picsum.photos/seed/movie1/640/360" },
];

const CATEGORIES = ['All', 'Gaming', 'Music', 'Movies', 'Live', 'Tech', 'Sports', 'News'];

export default function Videos() {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { addCoins, coinsEarnedToday } = useCoins();

    const filteredVideos = VIDEOS.filter(video =>
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

                {/* Video Grid */}
                <div className="video-grid">
                    {filteredVideos.map(video => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onClick={() => handleVideoClick(video)}
                        />
                    ))}
                </div>
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
