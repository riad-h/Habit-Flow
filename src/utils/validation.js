/**
 * Validate habit form data
 */
export function validateHabit(data) {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Habit name is required';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be 500 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate AI goal input
 */
export function validateGoal(goal) {
  if (!goal || goal.trim().length === 0) {
    return { isValid: false, error: 'Please describe your goal' };
  }
  if (goal.trim().length > 500) {
    return { isValid: false, error: 'Goal must be 500 characters or less' };
  }
  return { isValid: true, error: null };
}

/**
 * Validate email
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email' };
  }
  return { isValid: true, error: null };
}

/**
 * Validate password
 */
export function validatePassword(password) {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true, error: null };
}
