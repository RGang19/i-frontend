import { createContext, useContext, useState, useEffect } from 'react';

const CoinContext = createContext();

export function CoinProvider({ children }) {
    const [coins, setCoins] = useState(() => {
        const saved = localStorage.getItem('userCoins');
        return saved ? parseInt(saved) : 150;
    });

    const [adsWatchedToday, setAdsWatchedToday] = useState(() => {
        const saved = localStorage.getItem('adsWatchedToday');
        return saved ? parseInt(saved) : 0;
    });

    const [coinsEarnedToday, setCoinsEarnedToday] = useState(() => {
        const saved = localStorage.getItem('coinsEarnedToday');
        return saved ? parseInt(saved) : 0;
    });

    // Reset daily stats at midnight
    useEffect(() => {
        const lastVisit = localStorage.getItem('lastVisitDate');
        const today = new Date().toDateString();

        if (lastVisit !== today) {
            setAdsWatchedToday(0);
            setCoinsEarnedToday(0);
            localStorage.setItem('lastVisitDate', today);
            localStorage.setItem('adsWatchedToday', '0');
            localStorage.setItem('coinsEarnedToday', '0');
        }
    }, []);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('userCoins', coins.toString());
    }, [coins]);

    useEffect(() => {
        localStorage.setItem('adsWatchedToday', adsWatchedToday.toString());
    }, [adsWatchedToday]);

    useEffect(() => {
        localStorage.setItem('coinsEarnedToday', coinsEarnedToday.toString());
    }, [coinsEarnedToday]);

    const addCoins = (amount, type = 'video') => {
        setCoins(prev => prev + amount);
        setCoinsEarnedToday(prev => prev + amount);

        if (type === 'ad') {
            setAdsWatchedToday(prev => prev + 1);
        }
    };

    const spendCoins = (amount) => {
        if (coins >= amount) {
            setCoins(prev => prev - amount);
            return true;
        }
        return false;
    };

    const value = {
        coins,
        adsWatchedToday,
        coinsEarnedToday,
        addCoins,
        spendCoins,
    };

    return (
        <CoinContext.Provider value={value}>
            {children}
        </CoinContext.Provider>
    );
}

export function useCoins() {
    const context = useContext(CoinContext);
    if (!context) {
        throw new Error('useCoins must be used within a CoinProvider');
    }
    return context;
}
