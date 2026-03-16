import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { initialHolidays } from '../data/holidays';

const defaultState = {
    refDate: '2026-03-05',
    refShift: 'B2',
    holidays: initialHolidays,
};

export const useAppStore = () => {
    const { currentUser } = useAuth();
    const [state, setState] = useState(defaultState);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Load User Data from Firestore on mount/login
    useEffect(() => {
        async function loadUserData() {
            if (!currentUser) {
                setState(defaultState);
                return;
            }

            setLoading(true);
            try {
                const userRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    setState(docSnap.data());
                } else {
                    // Initialize new user with default data
                    await setDoc(userRef, defaultState);
                    setState(defaultState);
                }
            } catch (e) {
                console.error('Failed to load user data from Firestore', e);
                setError('Database connection failed. Please ensure Firebase Firestore is created.');
            }
            setLoading(false);
        }

        loadUserData();
    }, [currentUser]);

    // Helper to save to Firestore
    const saveToCloud = async (newState) => {
        if (!currentUser) return;
        setIsSaving(true);
        setError(null);
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, newState);
        } catch (e) {
            console.error('Failed to save user data to Firestore', e);
            setError('Failed to save configuration. Please try again.');
        }
        setIsSaving(false);
    };

    const updateSettings = async (refDate, refShift) => {
        const newState = { ...state, refDate, refShift };
        setState(newState);
        await saveToCloud(newState);
    };

    const addHoliday = async (holiday) => {
        const newState = {
            ...state,
            holidays: [...state.holidays, { ...holiday, id: Date.now().toString() }].sort((a, b) => new Date(a.date) - new Date(b.date))
        };
        setState(newState);
        await saveToCloud(newState);
    };

    const editHoliday = async (id, updatedHoliday) => {
        const newState = {
            ...state,
            holidays: state.holidays.map(h => h.id === id ? { ...h, ...updatedHoliday } : h).sort((a, b) => new Date(a.date) - new Date(b.date))
        };
        setState(newState);
        await saveToCloud(newState);
    };

    const deleteHoliday = async (id) => {
        const newState = {
            ...state,
            holidays: state.holidays.filter(h => h.id !== id)
        };
        setState(newState);
        await saveToCloud(newState);
    };

    const resetHolidays = async () => {
        const newState = { ...state, holidays: initialHolidays };
        setState(newState);
        await saveToCloud(newState);
    };

    return {
        ...state,
        loading,
        isSaving,
        error,
        updateSettings,
        addHoliday,
        editHoliday,
        deleteHoliday,
        resetHolidays
    };
};
