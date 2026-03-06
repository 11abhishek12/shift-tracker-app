import React, { useState } from 'react';
import { Settings as SettingsIcon, RotateCcw, Save, LogOut } from 'lucide-react';
import { SHIFT_SEQUENCE } from '../utils/shiftLogic';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

const Settings = ({ store }) => {
    const { logout, currentUser } = useAuth();
    const [refDate, setRefDate] = useState(store.refDate);
    const [refShift, setRefShift] = useState(store.refShift);
    const [saveMessage, setSaveMessage] = useState('');

    const handleSave = async () => {
        store.updateSettings(refDate, refShift);
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const handleResetHolidays = async () => {
        if (window.confirm('Are you sure you want to reset all holidays back to the 2026 defaults? Any custom holidays will be lost.')) {
            store.resetHolidays();
            setSaveMessage('Holidays reset to default.');
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="settings-container fade-in">

            <div className="settings-header">
                <SettingsIcon size={28} className="text-accent" />
                <h2>Configuration</h2>
            </div>

            <div className="glass-panel settings-form">
                <h3 className="section-title">Shift Reference Point</h3>
                <p className="section-desc">
                    Set a known date and the shift that occurred on that date.
                    The application will calculate all future and past shifts based on this 8-day cycle point.
                </p>

                <div className="input-group mt-4">
                    <label>Reference Date</label>
                    <input
                        type="date"
                        value={refDate}
                        onChange={(e) => setRefDate(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Shift on Reference Date</label>
                    <select
                        value={refShift}
                        onChange={(e) => setRefShift(e.target.value)}
                    >
                        {SHIFT_SEQUENCE.map(shift => (
                            <option key={shift} value={shift}>{shift} Shift</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions space-between mt-4">
                    <span className="success-msg">{saveMessage}</span>
                    <button className="btn-primary" onClick={handleSave} disabled={store.loading}>
                        <Save size={18} style={{ marginRight: '8px' }} /> Save Configuration
                    </button>
                </div>
            </div>

            <div className="glass-panel settings-form danger-zone">
                <h3 className="section-title text-error">Danger Zone</h3>
                <p className="section-desc">
                    Reset the holiday list back to the default 2026 Gazetted and Restricted holidays list.
                </p>

                <button className="btn-secondary danger-btn mt-4" onClick={handleResetHolidays} disabled={store.loading}>
                    <RotateCcw size={18} style={{ marginRight: '8px' }} /> Factory Reset Holidays
                </button>
            </div>

            <div className="glass-panel settings-form">
                <h3 className="section-title">Account</h3>
                <p className="section-desc">Logged in as: <strong>{currentUser?.email}</strong></p>
                <button className="btn-secondary mt-4" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <LogOut size={18} style={{ marginRight: '8px' }} /> Log Out
                </button>
            </div>

        </div>
    );
};

export default Settings;
