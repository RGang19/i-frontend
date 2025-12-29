import { useState } from 'react';
import { useCoins } from '../../context/CoinContext';
import './Premium.css';

const PLANS = [
    {
        id: 'monthly',
        name: 'Monthly',
        price: '129',
        period: '/month',
        features: ['Ad-free experience', 'Background play', 'HD streaming', 'Cancel anytime'],
    },
    {
        id: 'yearly',
        name: 'Yearly',
        price: '999',
        period: '/year',
        savings: 'Save ₹549 (35% off)',
        popular: true,
        features: ['All Monthly features', 'Offline downloads', '4K Ultra HD', 'Exclusive content', 'Priority support'],
    },
    {
        id: 'lifetime',
        name: 'Lifetime',
        price: '2999',
        period: 'one-time',
        features: ['All Yearly features', 'Forever access', 'No renewals', 'VIP support', 'Future updates included'],
    },
];

const FEATURES = [
    { icon: '🚫', title: 'No Ads Ever', desc: 'Watch videos without any ad interruptions' },
    { icon: '⚡', title: 'Priority Streaming', desc: 'Faster video loading and higher quality' },
    { icon: '📥', title: 'Offline Downloads', desc: 'Download videos to watch offline' },
    { icon: '🎵', title: 'Background Play', desc: 'Listen while using other apps' },
    { icon: '🎨', title: 'Exclusive Themes', desc: 'Access premium themes and customization' },
    { icon: '🌟', title: 'Early Access', desc: 'Be first to try new features' },
];

export default function Premium() {
    const { coins, spendCoins } = useCoins();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [notification, setNotification] = useState(null);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handleRedeemCoins = () => {
        if (coins >= 5000) {
            if (spendCoins(5000)) {
                showNotification('🎉 Premium activated for 1 month!', 'success');
            }
        } else {
            showNotification(`Need ${5000 - coins} more coins!`, 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="premium-page">
            {/* Animated Background */}
            <div className="premium-bg">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="premium-container">
                {/* Hero Section */}
                <section className="hero">
                    <div className="crown-icon">👑</div>
                    <h1>Go Premium</h1>
                    <p className="subtitle">Seamless watching experience without interruptions</p>
                </section>

                {/* Features */}
                <section className="features">
                    {FEATURES.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Pricing Plans */}
                <section className="pricing">
                    <h2>Choose Your Plan</h2>
                    <div className="plans-grid">
                        {PLANS.map(plan => (
                            <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && <div className="popular-badge">BEST VALUE</div>}
                                <div className="plan-header">
                                    <h3>{plan.name}</h3>
                                    <div className="plan-price">
                                        <span className="currency">₹</span>
                                        <span className="amount">{plan.price}</span>
                                        <span className="period">{plan.period}</span>
                                    </div>
                                    {plan.savings && <p className="savings">{plan.savings}</p>}
                                </div>
                                <ul className="plan-features">
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>✓ {feature}</li>
                                    ))}
                                </ul>
                                <button
                                    className={`plan-btn ${plan.popular ? 'primary' : ''}`}
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    Get {plan.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coins Option */}
                <section className="coins-option">
                    <div className="coins-card">
                        <div className="coins-icon">🪙</div>
                        <div className="coins-info">
                            <h3>Use Your Coins!</h3>
                            <p>You have <span className="coin-balance">{coins}</span> coins</p>
                        </div>
                        <div className="coins-redeem">
                            <p>Redeem <strong>5000 coins</strong> for 1 month Premium</p>
                            <button
                                className="redeem-btn"
                                onClick={handleRedeemCoins}
                                disabled={coins < 5000}
                            >
                                {coins >= 5000 ? 'Redeem Coins' : `Need ${5000 - coins} more`}
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="faq">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        <FaqItem
                            question="Can I cancel anytime?"
                            answer="Yes! You can cancel your subscription at any time. For monthly plans, you'll have access until the end of your billing period."
                        />
                        <FaqItem
                            question="Will I lose my earned coins?"
                            answer="No! Your coins are always safe. Premium members can still earn coins and redeem them for exclusive rewards."
                        />
                        <FaqItem
                            question="How many devices can I use?"
                            answer="Premium membership works on up to 5 devices. You can stream on 2 devices simultaneously."
                        />
                    </div>
                </section>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="payment-modal">
                    <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}></div>
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowPaymentModal(false)}>✕</button>
                        <div className="modal-header">
                            <h2>Complete Your Purchase</h2>
                            <p>{selectedPlan?.name} Plan - ₹{selectedPlan?.price}{selectedPlan?.period}</p>
                        </div>
                        <div className="payment-options">
                            <button className="payment-option" onClick={() => {
                                setShowPaymentModal(false);
                                showNotification('🎉 Premium activated!', 'success');
                            }}>
                                <span className="payment-icon">💳</span>
                                <span>Credit/Debit Card</span>
                            </button>
                            <button className="payment-option" onClick={() => {
                                setShowPaymentModal(false);
                                showNotification('🎉 Premium activated!', 'success');
                            }}>
                                <span className="payment-icon">📱</span>
                                <span>UPI</span>
                            </button>
                            <button className="payment-option" onClick={() => {
                                setShowPaymentModal(false);
                                showNotification('🎉 Premium activated!', 'success');
                            }}>
                                <span className="payment-icon">🏦</span>
                                <span>Net Banking</span>
                            </button>
                        </div>
                        <p className="secure-note">🔒 Secure payment. 100% money-back guarantee.</p>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}

function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="faq-answer">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}
