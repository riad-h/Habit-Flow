import { getTodayDate } from './dateUtils';

/**
 * Calculate the current streak for a habit.
 * A streak counts consecutive days going backwards from today.
 * If today is not completed, the streak starts from yesterday.
 */
export function calculateCurrentStreak(completions) {
  if (!completions || completions.length === 0) return 0;

  const today = getTodayDate();
  const completedDates = new Set(completions.map(c => c.completed_date));

  let streak = 0;
  let checkDate = new Date(today + 'T00:00:00');

  // If today is not completed, start checking from yesterday
  if (!completedDates.has(today)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDateForComparison(checkDate);
    if (completedDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate the longest streak from completions
 */
export function calculateLongestStreak(completions) {
  if (!completions || completions.length === 0) return 0;

  const sortedDates = completions
    .map(c => c.completed_date)
    .sort();

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1] + 'T00:00:00');
    const curr = new Date(sortedDates[i] + 'T00:00:00');
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }

  return longest;
}

/**
 * Check if a habit is completed today
 */
export function isCompletedToday(completions) {
  if (!completions || completions.length === 0) return false;
  const today = getTodayDate();
  return completions.some(c => c.completed_date === today);
}

/**
 * Calculate completion percentage over a period
 */
export function calculateCompletionPercentage(completions, days) {
  if (!completions || completions.length === 0 || days === 0) return 0;
  const percentage = (completions.length / days) * 100;
  return Math.round(Math.min(percentage, 100));
}

/**
 * Helper to format a Date object to YYYY-MM-DD
 */
function formatDateForComparison(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
