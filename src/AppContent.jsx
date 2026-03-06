import { useState } from 'react';
import { useAppStore } from './hooks/useAppStore';
import { useAuth } from './contexts/AuthContext';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Holidays from './components/Holidays';
import Settings from './components/Settings';
import Login from './components/Login';

function AppContent() {
    const [currentTab, setCurrentTab] = useState('home');
    const store = useAppStore();
    const { currentUser } = useAuth(); // Now correctly used inside AuthProvider

    if (!currentUser) {
        return <Login />;
    }

    const renderContent = () => {
        switch (currentTab) {
            case 'home':
                return <Home store={store} />;
            case 'holidays':
                return <Holidays store={store} />;
            case 'settings':
                return <Settings store={store} />;
            default:
                return <Home store={store} />;
        }
    };

    return (
        <>
            <header className="app-header">
                <h1>Shift Tracker</h1>
            </header>

            <main className="app-main">
                {renderContent()}
            </main>

            <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </>
    );
}

export default AppContent;
