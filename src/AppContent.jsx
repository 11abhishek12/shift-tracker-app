import { useState } from 'react';
import { useAppStore } from './hooks/useAppStore';
import { useAuth } from './contexts/AuthContext';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Holidays from './components/Holidays';
import Settings from './components/Settings';
import Login from './components/Login';
import { auth } from './firebase';

function AppContent() {
    const [currentTab, setCurrentTab] = useState('home');
    const store = useAppStore();
    const { currentUser } = useAuth(); // Now correctly used inside AuthProvider

    if (!currentUser) {
        return <Login />;
    }

    if (store.loading) {
        return (
            <div className="login-container fade-in">
                <div className="glass-panel login-card" style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
                    <h2 style={{ margin: 0 }}>Loading Profile...</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.9rem' }}>
                        Fetching your setup from the cloud. If this takes longer than 15 seconds, Firebase may not be fully initialized.
                    </p>
                </div>
            </div>
        );
    }

    if (store.error) {
        return (
            <div className="login-container fade-in">
                <div className="glass-panel login-card" style={{ textAlign: 'center', borderTopColor: 'var(--holiday-gazetted-text)' }}>
                    <h2 style={{ color: 'var(--holiday-gazetted-text)', margin: 0 }}>Database Error</h2>
                    <p style={{ margin: '2rem 0', color: 'var(--text-primary)' }}>{store.error}</p>
                    <button className="btn-primary" onClick={() => window.location.reload()} style={{ width: '100%', justifyContent: 'center' }}>Retry Connection</button>
                    <div style={{ marginTop: '1.5rem' }}>
                        <button className="btn-link" onClick={() => auth.signOut()}>Log Out and Return</button>
                    </div>
                </div>
            </div>
        );
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
