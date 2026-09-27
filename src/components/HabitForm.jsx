import { useState, useEffect } from 'react';
import { validateHabit } from '../utils/validation';
import { HABIT_COLORS } from './HabitCard';

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'custom', label: 'Custom days' },
];

const DAYS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

export default function HabitForm({ habit, onSubmit, onCancel, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('default');
  const [frequency, setFrequency] = useState('daily');
  const [targetDays, setTargetDays] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setColor(habit.color || 'default');
      setFrequency(habit.frequency || 'daily');
      setTargetDays(habit.target_days || [1, 2, 3, 4, 5, 6, 7]);
    }
  }, [habit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { name, description, color, frequency, target_days: targetDays };
    const validation = validateHabit(data);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(data);
  };

  const toggleDay = (day) => {
    setTargetDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="habit-name">Habit name</label>
        <input
          id="habit-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
          placeholder="e.g., Read for 20 minutes"
          maxLength={100}
          autoFocus
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="habit-description">Description</label>
        <textarea
          id="habit-description"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional — what does this habit involve?"
          maxLength={500}
          rows={2}
        />
        {errors.description && <div className="form-error">{errors.description}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="habit-frequency">Frequency</label>
        <select
          id="habit-frequency"
          className="form-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          {FREQUENCIES.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {frequency === 'custom' && (
        <div className="form-group">
          <label className="form-label">Target days</label>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {DAYS.map(day => (
              <button
                key={day.value}
                type="button"
                className={`btn btn-sm ${targetDays.includes(day.value) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Color</label>
        <div className="color-options">
          {Object.entries(HABIT_COLORS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              className={`color-option ${color === key ? 'selected' : ''}`}
              style={{ background: value }}
              onClick={() => setColor(key)}
              aria-label={`Color: ${key}`}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (habit ? 'Update habit' : 'Create habit')}
        </button>
      </div>
    </form>
  );
}
