import React, { useState, useEffect } from 'react';
import {
    format, parseISO, isSameDay, isSameMonth,
    startOfMonth, endOfMonth, startOfWeek, endOfWeek
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, LayoutGrid } from 'lucide-react';
import { calculateShift } from '../utils/shiftLogic';
import './Home.css';

const Home = ({ store }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('day'); // 'day' or 'month'
    const [currentShift, setCurrentShift] = useState('');
    const [holidayForDay, setHolidayForDay] = useState(null);

    useEffect(() => {
        const refDate = parseISO(store.refDate);
        const calculated = calculateShift(selectedDate, refDate, store.refShift);
        setCurrentShift(calculated);

        const foundHoliday = store.holidays.find(h =>
            isSameDay(parseISO(h.date), selectedDate)
        );
        setHolidayForDay(foundHoliday || null);
    }, [selectedDate, store.refDate, store.refShift, store.holidays]);

    const handlePrev = () => {
        const prev = new Date(selectedDate);
        if (viewMode === 'day') {
            prev.setDate(prev.getDate() - 1);
        } else {
            prev.setMonth(prev.getMonth() - 1);
        }
        setSelectedDate(prev);
    };

    const handleNext = () => {
        const next = new Date(selectedDate);
        if (viewMode === 'day') {
            next.setDate(next.getDate() + 1);
        } else {
            next.setMonth(next.getMonth() + 1);
        }
        setSelectedDate(next);
    };

    const setToday = () => {
        setSelectedDate(new Date());
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";
        const refDateObj = parseISO(store.refDate);

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = new Date(day);

                const shiftForDay = calculateShift(cloneDay, refDateObj, store.refShift);
                const holidayForDay = store.holidays.find(h => isSameDay(parseISO(h.date), cloneDay));

                let dayClass = 'month-day ';
                if (!isSameMonth(day, monthStart)) {
                    dayClass += 'disabled ';
                }
                if (isSameDay(day, new Date())) {
                    dayClass += 'today ';
                }
                if (isSameDay(day, selectedDate)) {
                    dayClass += 'selected ';
                }

                days.push(
                    <div
                        className={dayClass}
                        key={day}
                        onClick={() => { setSelectedDate(cloneDay); setViewMode('day'); }}
                    >
                        <span className="day-number">{formattedDate}</span>
                        <span className={`day-shift text-${shiftForDay === 'Off' || shiftForDay === 'Spare' ? 'special' : 'normal'}`}>
                            {shiftForDay}
                        </span>
                        {holidayForDay && (
                            <span className={`day-holiday dot-${holidayForDay.type.toLowerCase()}`} title={holidayForDay.name}></span>
                        )}
                    </div>
                );
                day = new Date(day.setDate(day.getDate() + 1));
            }
            rows.push(
                <div className="month-row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }

        return (
            <div className="month-calendar glass-panel fade-in">
                <div className="month-header-row">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div className="month-header-day" key={d}>{d}</div>
                    ))}
                </div>
                {rows}
            </div>
        );
    };

    return (
        <div className="home-container fade-in">

            {/* Date Navigator */}
            <div className="glass-panel date-navigator">
                <button className="btn-icon" onClick={handlePrev}>
                    <ChevronLeft size={24} />
                </button>

                <div className="date-display" onClick={() => document.getElementById('date-picker').showPicker()}>
                    <span className="date-month">{format(selectedDate, 'MMMM yyyy')}</span>
                    {viewMode === 'day' && <span className="date-day">{format(selectedDate, 'EEEE, do')}</span>}
                    <input
                        type="date"
                        id="date-picker"
                        className="hidden-date-input"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        onChange={(e) => {
                            if (e.target.value) {
                                setSelectedDate(parseISO(e.target.value));
                            }
                        }}
                    />
                </div>

                <button className="btn-icon" onClick={handleNext}>
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="action-row">
                <button className="btn-secondary small-btn" onClick={setToday}>
                    <CalendarIcon size={16} />
                    Today
                </button>
                <button className="btn-secondary small-btn" onClick={() => setViewMode(v => v === 'day' ? 'month' : 'day')}>
                    <LayoutGrid size={16} />
                    {viewMode === 'day' ? 'Month View' : 'Day View'}
                </button>
            </div>

            {/* Main Views */}
            {viewMode === 'day' ? (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Main Shift Display */}
                    <div className={`glass-panel shift-card ${currentShift === 'Off' || currentShift === 'Spare' ? 'shift-special' : ''}`}>
                        <h2 className="shift-label">Your Shift</h2>
                        <div className="shift-value-container">
                            <span className="shift-value">{currentShift}</span>
                        </div>
                    </div>

                    {/* Holiday Indicator */}
                    {holidayForDay && (
                        <div className={`glass-panel holiday-alert type-${holidayForDay.type.toLowerCase()}`}>
                            <div className="holiday-icon">
                                <Info size={24} />
                            </div>
                            <div className="holiday-details">
                                <span className="holiday-type">{holidayForDay.type} Holiday</span>
                                <span className="holiday-name">{holidayForDay.name}</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                renderMonthView()
            )}

            {/* Quick Legend Info */}
            <div className="info-text mt-4">
                Shift Cycle: A1 → A2 → B1 → B2 → C1 → C2 → Off → Spare
            </div>
        </div>
    );
};

export default Home;
