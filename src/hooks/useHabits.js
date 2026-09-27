import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getTodayDate } from '../utils/dateUtils';
import { calculateCurrentStreak, calculateLongestStreak, isCompletedToday } from '../utils/streakUtils';

export function useHabits(userId) {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    if (!userId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('archived', false)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      // Fetch completions for the last 365 days
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oneYearAgoStr = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}-${String(oneYearAgo.getDate()).padStart(2, '0')}`;

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_date', oneYearAgoStr)
        .order('completed_date', { ascending: false });

      if (completionsError) throw completionsError;

      setHabits(habitsData || []);
      setCompletions(completionsData || []);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError('Unable to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const createHabit = async (habitData) => {
    if (!userId || !isSupabaseConfigured()) {
      throw new Error('Not authenticated');
    }

    const { data, error: createError } = await supabase
      .from('habits')
      .insert([{
        user_id: userId,
        name: habitData.name.trim(),
        description: habitData.description?.trim() || '',
        color: habitData.color || 'default',
        frequency: habitData.frequency || 'daily',
        target_days: habitData.target_days || [1, 2, 3, 4, 5, 6, 7],
        archived: false,
      }])
      .select()
      .single();

    if (createError) throw createError;
    setHabits(prev => [...prev, data]);
    return data;
  };

  const updateHabit = async (habitId, habitData) => {
    if (!userId || !isSupabaseConfigured()) {
      throw new Error('Not authenticated');
    }

    const { data, error: updateError } = await supabase
      .from('habits')
      .update({
        name: habitData.name.trim(),
        description: habitData.description?.trim() || '',
        color: habitData.color || 'default',
        frequency: habitData.frequency || 'daily',
        target_days: habitData.target_days || [1, 2, 3, 4, 5, 6, 7],
        updated_at: new Date().toISOString(),
      })
      .eq('id', habitId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;
    setHabits(prev => prev.map(h => h.id === habitId ? data : h));
    return data;
  };

  const deleteHabit = async (habitId) => {
    if (!userId || !isSupabaseConfigured()) {
      throw new Error('Not authenticated');
    }

    const { error: deleteError } = await supabase
      .from('habits')
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', habitId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const toggleCompletion = async (habitId) => {
    if (!userId || !isSupabaseConfigured()) {
      throw new Error('Not authenticated');
    }

    const today = getTodayDate();
    const existing = completions.find(
      c => c.habit_id === habitId && c.completed_date === today
    );

    if (existing) {
      // Remove completion
      const { error: removeError } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existing.id)
        .eq('user_id', userId);

      if (removeError) throw removeError;
      setCompletions(prev => prev.filter(c => c.id !== existing.id));
    } else {
      // Add completion
      const { data, error: addError } = await supabase
        .from('habit_completions')
        .insert([{
          habit_id: habitId,
          user_id: userId,
          completed_date: today,
        }])
        .select()
        .single();

      if (addError) throw addError;
      setCompletions(prev => [...prev, data]);
    }
  };

  const getHabitCompletions = (habitId) => {
    return completions.filter(c => c.habit_id === habitId);
  };

  const getHabitStreak = (habitId) => {
    const habitCompletions = getHabitCompletions(habitId);
    return calculateCurrentStreak(habitCompletions);
  };

  const getHabitLongestStreak = (habitId) => {
    const habitCompletions = getHabitCompletions(habitId);
    return calculateLongestStreak(habitCompletions);
  };

  const isHabitCompletedToday = (habitId) => {
    const habitCompletions = getHabitCompletions(habitId);
    return isCompletedToday(habitCompletions);
  };

  const getTodayHabits = () => {
    const today = new Date();
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // 1=Mon, 7=Sun

    return habits.filter(habit => {
      if (habit.frequency === 'daily') return true;
      if (habit.target_days && habit.target_days.includes(dayOfWeek)) return true;
      return false;
    });
  };

  return {
    habits,
    completions,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    getHabitCompletions,
    getHabitStreak,
    getHabitLongestStreak,
    isHabitCompletedToday,
    getTodayHabits,
    refetch: fetchHabits,
  };
}
