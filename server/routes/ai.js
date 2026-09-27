import { Router } from 'express';
import { generateHabitSuggestions } from '../services/grokService.js';

const router = Router();

// POST /api/ai/habits
router.post('/habits', async (req, res) => {
  try {
    const { goal } = req.body;

    // Validate request
    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ error: 'Goal is required and must be a string.' });
    }

    if (goal.trim().length === 0) {
      return res.status(400).json({ error: 'Goal cannot be empty.' });
    }

    if (goal.trim().length > 500) {
      return res.status(400).json({ error: 'Goal must be 500 characters or less.' });
    }

    // Generate habits using Grok
    const habits = await generateHabitSuggestions(goal.trim());

    // Validate response
    if (!Array.isArray(habits) || habits.length === 0) {
      return res.status(500).json({ error: 'Failed to generate habits. Please try again.' });
    }

    // Validate each habit has required fields
    const validatedHabits = habits
      .filter(h => h && typeof h.name === 'string' && h.name.trim().length > 0)
      .map(h => ({
        name: h.name.trim().substring(0, 100),
        description: typeof h.description === 'string' ? h.description.trim().substring(0, 500) : '',
        frequency: ['daily', 'weekly', 'weekdays'].includes(h.frequency) ? h.frequency : 'daily',
      }));

    if (validatedHabits.length === 0) {
      return res.status(500).json({ error: 'Failed to generate valid habits. Please try again.' });
    }

    res.json({ habits: validatedHabits });
  } catch (error) {
    console.error('AI habit generation error:', error.message);
    res.status(500).json({ error: 'Unable to generate habits. Please try again later.' });
  }
});

export default router;
