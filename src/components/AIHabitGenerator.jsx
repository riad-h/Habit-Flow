import { useState } from 'react';
import { generateHabits } from '../lib/api';
import { validateGoal } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';

export default function AIHabitGenerator({ onAddHabits, onClose }) {
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    const validation = validateGoal(goal);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = user ? `auth-token-${user.id}` : null;
      const data = await generateHabits(goal, authToken);
      setSuggestions(data.habits || []);
      setSelected([]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSuggestion = (index) => {
    setSelected(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleAddSelected = () => {
    const habitsToAdd = selected.map(i => suggestions[i]);
    onAddHabits(habitsToAdd);
  };

  const handleRegenerate = () => {
    setSuggestions([]);
    setSelected([]);
    handleGenerate();
  };

  return (
    <div className="ai-generator">
      {suggestions.length === 0 ? (
        <>
          <p style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>
            Describe a goal and we'll suggest habits to help you get started.
          </p>
          <div className="ai-input-group">
            <input
              type="text"
              className="form-input"
              value={goal}
              onChange={(e) => { setGoal(e.target.value); setError(null); }}
              placeholder="e.g., I want to become healthier..."
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading || !goal.trim()}
            >
              {loading ? '...' : 'Generate'}
            </button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
        </>
      ) : (
        <>
          <p style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>
            Select the habits you'd like to add:
          </p>
          <div className="ai-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`ai-suggestion-card ${selected.includes(index) ? 'selected' : ''}`}
                onClick={() => toggleSuggestion(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleSuggestion(index)}
              >
                <div className={`ai-suggestion-checkbox ${selected.includes(index) ? 'checked' : ''}`} />
                <div className="ai-suggestion-info">
                  <h4>{suggestion.name}</h4>
                  <p>{suggestion.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={handleRegenerate} disabled={loading}>
              Regenerate
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddSelected}
              disabled={selected.length === 0}
            >
              Add {selected.length > 0 ? `(${selected.length})` : ''} habits
            </button>
          </div>
        </>
      )}
    </div>
  );
}
