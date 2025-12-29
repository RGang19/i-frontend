import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const MENU_ITEMS = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/' },
    { id: 'videos', icon: '▶️', label: 'Videos', path: '/videos' },
    { id: 'trending', icon: '🔥', label: 'Trending', path: '/videos?filter=trending' },
    { id: 'subscriptions', icon: '📺', label: 'Subscriptions', path: '/videos?filter=subscribed' },
    { id: 'library', icon: '📚', label: 'Library', path: '/videos?filter=library' },
];

const EXPLORE_ITEMS = [
    { id: 'earn', icon: '💰', label: 'Earn Coins', path: '/ads' },
    { id: 'gaming', icon: '🎮', label: 'Gaming', path: '/videos?category=gaming' },
    { id: 'music', icon: '🎵', label: 'Music', path: '/videos?category=music' },
    { id: 'movies', icon: '🎬', label: 'Movies', path: '/videos?category=movies' },
    { id: 'live', icon: '📡', label: 'Live', path: '/videos?category=live' },
    { id: 'news', icon: '📰', label: 'News', path: '/videos?category=news' },
];

const BOTTOM_ITEMS = [
    { id: 'upload', icon: '⬆️', label: 'Upload', path: '/upload' },
    { id: 'premium', icon: '⭐', label: 'Premium', path: '/premium' },
    { id: 'settings', icon: '⚙️', label: 'Settings', path: '/profile' },
];

export default function Sidebar({ isExpanded, onToggle }) {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path.split('?')[0]);
    };

    const renderMenuItem = (item, index) => (
        <Link
            key={item.id}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <span className="item-icon">{item.icon}</span>
            <span className="item-label">{item.label}</span>
            {!isExpanded && hoveredItem === item.id && (
                <div className="tooltip">{item.label}</div>
            )}
        </Link>
    );

    return (
        <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button className="toggle-btn" onClick={onToggle}>
                {isExpanded ? '◀' : '▶'}
            </button>

            <div className="sidebar-content">
                <div className="menu-section">
                    {MENU_ITEMS.map((item, index) => renderMenuItem(item, index))}
                </div>

                <div className="section-divider">
                    <span className="divider-label">{isExpanded ? 'Explore' : '•••'}</span>
                </div>

                <div className="menu-section">
                    {EXPLORE_ITEMS.map((item, index) => renderMenuItem(item, index + MENU_ITEMS.length))}
                </div>

                <div className="section-divider">
                    <span className="divider-label">{isExpanded ? 'More' : '•••'}</span>
                </div>

                <div className="menu-section bottom-section">
                    {BOTTOM_ITEMS.map((item, index) => renderMenuItem(item, index + MENU_ITEMS.length + EXPLORE_ITEMS.length))}
                </div>
            </div>

            {isExpanded && (
                <div className="sidebar-footer">
                    <p>I_tube © 2024</p>
                </div>
            )}
        </aside>
    );
}
