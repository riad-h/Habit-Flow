import { calculateCurrentStreak } from '../utils/streakUtils';

const HABIT_COLORS = {
  default: '#737373',
  blue: '#3b82f6',
  green: '#16a34a',
  purple: '#8b5cf6',
  orange: '#ea580c',
  pink: '#db2777',
  teal: '#0d9488',
};

export default function HabitCard({ habit, completions, isCompleted, onToggle, onEdit, onDelete }) {
  const streak = calculateCurrentStreak(completions);
  const color = HABIT_COLORS[habit.color] || HABIT_COLORS.default;

  return (
    <div className={`habit-card ${isCompleted ? 'completed' : ''}`}>
      <button
        className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(habit.id)}
        aria-label={`${isCompleted ? 'Uncomplete' : 'Complete'} ${habit.name}`}
        style={isCompleted ? { background: color, borderColor: color } : {}}
      />
      <div className="habit-info">
        <div className="habit-name">{habit.name}</div>
        {habit.description && (
          <div className="habit-description">{habit.description}</div>
        )}
      </div>
      <div className="habit-meta">
        {streak > 0 && (
          <span className="habit-streak">🔥 {streak}d</span>
        )}
        <div className="habit-actions">
          <button
            className="habit-action-btn"
            onClick={() => onEdit(habit)}
            aria-label={`Edit ${habit.name}`}
            title="Edit"
          >
            ✎
          </button>
          <button
            className="habit-action-btn"
            onClick={() => onDelete(habit.id)}
            aria-label={`Delete ${habit.name}`}
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export { HABIT_COLORS };
