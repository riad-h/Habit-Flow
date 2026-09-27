const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function generateHabits(goal, authToken) {
  const response = await fetch(`${API_BASE}/ai/habits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify({ goal }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to generate habits. Please try again.');
  }

  return response.json();
}
