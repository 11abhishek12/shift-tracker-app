import React from 'react';
import { CalendarDays, CalendarCheck2, Settings as SettingsIcon } from 'lucide-react';
import './BottomNav.css';

const BottomNav = ({ currentTab, setCurrentTab }) => {
    return (
        <nav className="bottom-nav">
            <button
                className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentTab('home')}
            >
                <CalendarDays size={24} />
                <span>Today</span>
            </button>

            <button
                className={`nav-item ${currentTab === 'holidays' ? 'active' : ''}`}
                onClick={() => setCurrentTab('holidays')}
            >
                <CalendarCheck2 size={24} />
                <span>Holidays</span>
            </button>

            <button
                className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
                onClick={() => setCurrentTab('settings')}
            >
                <SettingsIcon size={24} />
                <span>Settings</span>
            </button>
        </nav>
    );
};

export default BottomNav;
