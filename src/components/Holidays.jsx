import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Edit2, Trash2, X, Check, Search } from 'lucide-react';
import './Holidays.css';

const Holidays = ({ store }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ date: '', name: '', type: 'Restricted' });

    const filteredHolidays = store.holidays.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!formData.date || !formData.name) return;

        if (editingId) {
            store.editHoliday(editingId, formData);
        } else {
            store.addHoliday(formData);
        }

        setIsAdding(false);
        setEditingId(null);
        setFormData({ date: '', name: '', type: 'Restricted' });
    };

    const startEdit = (holiday) => {
        setFormData({ date: holiday.date, name: holiday.name, type: holiday.type });
        setEditingId(holiday.id);
        setIsAdding(false);
    };

    const cancelEdit = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ date: '', name: '', type: 'Restricted' });
    };

    return (
        <div className="holidays-container fade-in">

            <div className="holidays-header">
                <h2>Holidays List</h2>
                {!isAdding && !editingId && (
                    <button className="btn-icon add-btn" onClick={() => setIsAdding(true)}>
                        <Plus size={24} />
                    </button>
                )}
            </div>

            {/* Editor / Add Form */}
            {(isAdding || editingId) && (
                <div className="glass-panel edit-form">
                    <h3 className="form-title">{editingId ? 'Edit Holiday' : 'Add New Holiday'}</h3>

                    <div className="input-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Holiday Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Diwali"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Gazetted">Gazetted</option>
                            <option value="Restricted">Restricted</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button className="btn-secondary" onClick={cancelEdit}>
                            <X size={18} /> Cancel
                        </button>
                        <button className="btn-primary" onClick={handleSave}>
                            <Check size={18} /> Save
                        </button>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            {!isAdding && !editingId && (
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search holidays..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            )}

            {/* List */}
            <div className="holidays-list">
                {filteredHolidays.map((holiday) => (
                    <div key={holiday.id} className={`glass-panel list-item type-${holiday.type.toLowerCase()}`}>

                        <div className="item-date">
                            <span className="month">{format(parseISO(holiday.date), 'MMM')}</span>
                            <span className="day">{format(parseISO(holiday.date), 'dd')}</span>
                        </div>

                        <div className="item-details">
                            <span className="item-name">{holiday.name}</span>
                            <span className="item-type">{holiday.type} Holiday</span>
                        </div>

                        <div className="item-actions">
                            <button className="btn-icon" onClick={() => startEdit(holiday)}>
                                <Edit2 size={18} />
                            </button>
                            <button className="btn-icon text-error" onClick={() => store.deleteHoliday(holiday.id)}>
                                <Trash2 size={18} />
                            </button>
                        </div>

                    </div>
                ))}
                {filteredHolidays.length === 0 && (
                    <div className="empty-state">
                        <p className="text-secondary">No holidays found.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Holidays;
