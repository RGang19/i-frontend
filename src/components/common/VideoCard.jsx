import './VideoCard.css';

export default function VideoCard({ video, onClick }) {
    return (
        <div className="video-card" onClick={onClick}>
            <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} loading="lazy" />
                <span className="video-duration">{video.duration}</span>
                <span className="coin-reward">🪙 +{video.coins}</span>
            </div>
            <div className="video-details">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                    <div className="channel-avatar">{video.channelInitial}</div>
                    <div className="channel-info">
                        <p className="channel-name">{video.channel}</p>
                        <p className="video-stats">{video.views} views • {video.date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
