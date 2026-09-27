import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { calculateCurrentStreak, calculateLongestStreak, calculateCompletionPercentage } from '../utils/streakUtils';
import HabitCalendar from '../components/HabitCalendar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function History() {
  const { user } = useAuth();
  const { habits, loading, getHabitCompletions } = useHabits(user?.id);
  const [selectedHabit, setSelectedHabit] = useState(null);

  if (loading) {
    return <LoadingSpinner text="Loading history..." />;
  }

  // Default to first habit or show all
  const activeHabit = selectedHabit
    ? habits.find(h => h.id === selectedHabit)
    : habits[0];

  const completions = activeHabit ? getHabitCompletions(activeHabit.id) : [];
  const currentStreak = calculateCurrentStreak(completions);
  const longestStreak = calculateLongestStreak(completions);

  // Calculate completion percentage for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCompletions = completions.filter(c => {
    const date = new Date(c.completed_date + 'T00:00:00');
    return date >= thirtyDaysAgo;
  });
  const completionRate = calculateCompletionPercentage(recentCompletions, 30);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>History</h1>
        <p>Track your consistency over time.</p>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No habits to track</h3>
          <p>Create your first habit to start viewing your history.</p>
        </div>
      ) : (
        <>
          {/* Habit Selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-select">Select habit</label>
            <select
              id="habit-select"
              className="form-select"
              value={activeHabit?.id || ''}
              onChange={(e) => setSelectedHabit(e.target.value)}
            >
              {habits.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{currentStreak}d</div>
              <div className="stat-label">Current streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{longestStreak}d</div>
              <div className="stat-label">Longest streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completionRate}%</div>
              <div className="stat-label">Last 30 days</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completions.length}</div>
              <div className="stat-label">Total completions</div>
            </div>
          </div>

          {/* Calendar */}
          <HabitCalendar
            completions={completions}
            habitName={activeHabit?.name || ''}
          />
        </>
      )}
    </div>
  );
}
