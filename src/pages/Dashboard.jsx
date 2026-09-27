import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { getGreeting, formatDate, getTodayDate } from '../utils/dateUtils';

import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import AIHabitGenerator from '../components/AIHabitGenerator';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    getHabitCompletions,
    getTodayHabits,
  } = useHabits(user?.id);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const todayHabits = getTodayHabits();
  const today = getTodayDate();
  const greeting = getGreeting();
  const dateDisplay = formatDate(today);

  // Calculate overall stats
  const totalHabits = habits.length;
  const completedToday = todayHabits.filter(h => {
    const completions = getHabitCompletions(h.id);
    return completions.some(c => c.completed_date === today);
  }).length;

  const handleCreateHabit = async (data) => {
    setActionLoading(true);
    try {
      await createHabit(data);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Create habit error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateHabit = async (data) => {
    if (!editingHabit) return;
    setActionLoading(true);
    try {
      await updateHabit(editingHabit.id, data);
      setEditingHabit(null);
    } catch (err) {
      console.error('Update habit error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    setActionLoading(true);
    try {
      await deleteHabit(habitId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete habit error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (habitId) => {
    try {
      await toggleCompletion(habitId);
    } catch (err) {
      console.error('Toggle completion error:', err);
    }
  };

  const handleAddAIHabits = async (aiHabits) => {
    setActionLoading(true);
    try {
      for (const habit of aiHabits) {
        await createHabit({
          name: habit.name,
          description: habit.description || '',
          frequency: habit.frequency || 'daily',
          color: 'default',
        });
      }
      setShowAIModal(false);
    } catch (err) {
      console.error('Add AI habits error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your habits..." />;
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header">
        <h1>{greeting}{user?.email ? `, ${user.email.split('@')[0]}` : ''}</h1>
        <p>Today — {dateDisplay}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats */}
      {habits.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{completedToday}/{todayHabits.length}</div>
            <div className="stat-label">Completed today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalHabits}</div>
            <div className="stat-label">Active habits</div>
          </div>
        </div>
      )}

      {/* Today's Habits */}
      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">◐</div>
          <h3>No habits yet</h3>
          <p>Start with one small habit. Consistency beats intensity.</p>
          <div className="empty-state-actions">
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              Create habit
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAIModal(true)}>
              Create with AI
            </button>
          </div>
        </div>
      ) : (
        <div className="habits-section">
          <div className="habits-section-header">
            <h2>Today's habits</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowAIModal(true)}>
                + AI
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => setShowCreateModal(true)}>
                + New
              </button>
            </div>
          </div>
          <div className="habit-list">
            {todayHabits.map(habit => {
              const completions = getHabitCompletions(habit.id);
              const isCompleted = completions.some(c => c.completed_date === today);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completions={completions}
                  isCompleted={isCompleted}
                  onToggle={handleToggle}
                  onEdit={(h) => setEditingHabit(h)}
                  onDelete={(id) => setDeleteConfirm(id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Create Habit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New habit"
      >
        <HabitForm
          onSubmit={handleCreateHabit}
          onCancel={() => setShowCreateModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Edit Habit Modal */}
      <Modal
        isOpen={Boolean(editingHabit)}
        onClose={() => setEditingHabit(null)}
        title="Edit habit"
      >
        <HabitForm
          habit={editingHabit}
          onSubmit={handleUpdateHabit}
          onCancel={() => setEditingHabit(null)}
          loading={actionLoading}
        />
      </Modal>

      {/* AI Generator Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="Create with AI"
      >
        <AIHabitGenerator
          onAddHabits={handleAddAIHabits}
          onClose={() => setShowAIModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title="Delete habit"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={() => handleDeleteHabit(deleteConfirm)} disabled={actionLoading}>
              {actionLoading ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this habit? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
