/**
 * Grok API Service
 * Generates habit suggestions based on user goals.
 */

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a helpful habit coach. Your job is to suggest small, realistic, actionable habits based on a user's goal.

Rules:
- Generate 3-5 habit suggestions
- Keep habits small and specific (not vague goals)
- Make habits achievable for beginners
- Do NOT suggest anything dangerous, medically risky, or unrealistic
- Do NOT invent facts about the user
- Keep descriptions concise (1-2 sentences)
- Return ONLY valid JSON in this exact format, no other text:

[
  {
    "name": "Habit Name",
    "description": "Brief description of what to do.",
    "frequency": "daily"
  }
]

Frequency should be one of: "daily", "weekly", "weekdays"
`;

export async function generateHabitSuggestions(goal) {
  if (!GROK_API_KEY) {
    // Return demo suggestions if no API key is configured
    return getDemoSuggestions(goal);
  }

  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-2-latest',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `My goal: ${goal}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Grok API error:', errorText);
    throw new Error('AI service is temporarily unavailable.');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from AI service.');
  }

  // Parse JSON from response
  let habits;
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      habits = JSON.parse(jsonMatch[0]);
    } else {
      habits = JSON.parse(content);
    }
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    throw new Error('Invalid response from AI service.');
  }

  return habits;
}

/**
 * Demo suggestions when no API key is configured
 */
function getDemoSuggestions(goal) {
  const goalLower = goal.toLowerCase();

  if (goalLower.includes('health') || goalLower.includes('fit') || goalLower.includes('exercise')) {
    return [
      { name: 'Morning Walk', description: 'Take a 15-minute walk after waking up.', frequency: 'daily' },
      { name: 'Drink Water', description: 'Drink a full glass of water first thing in the morning.', frequency: 'daily' },
      { name: 'Stretch', description: 'Do 5 minutes of gentle stretching before bed.', frequency: 'daily' },
      { name: 'Cook a Meal', description: 'Prepare one healthy meal at home today.', frequency: 'daily' },
    ];
  }

  if (goalLower.includes('read') || goalLower.includes('learn') || goalLower.includes('study')) {
    return [
      { name: 'Read 10 Pages', description: 'Read at least 10 pages of a book.', frequency: 'daily' },
      { name: 'Learn Something New', description: 'Spend 15 minutes learning a new concept.', frequency: 'daily' },
      { name: 'Take Notes', description: 'Write down 3 things you learned today.', frequency: 'daily' },
    ];
  }

  if (goalLower.includes('mind') || goalLower.includes('stress') || goalLower.includes('calm') || goalLower.includes('meditat')) {
    return [
      { name: 'Morning Meditation', description: 'Meditate for 5 minutes after waking up.', frequency: 'daily' },
      { name: 'Gratitude Journal', description: 'Write down 3 things you are grateful for.', frequency: 'daily' },
      { name: 'Deep Breathing', description: 'Take 5 deep breaths when feeling stressed.', frequency: 'daily' },
      { name: 'Digital Sunset', description: 'Put away screens 30 minutes before bed.', frequency: 'daily' },
    ];
  }

  if (goalLower.includes('productiv') || goalLower.includes('focus') || goalLower.includes('work')) {
    return [
      { name: 'Plan Tomorrow', description: 'Spend 5 minutes planning tomorrow\'s priorities tonight.', frequency: 'daily' },
      { name: 'Deep Work Block', description: 'Work on your most important task for 45 minutes without distractions.', frequency: 'daily' },
      { name: 'Review Goals', description: 'Review your weekly goals every Sunday evening.', frequency: 'weekly' },
    ];
  }

  // Generic suggestions
  return [
    { name: 'Morning Routine', description: 'Wake up at the same time every day.', frequency: 'daily' },
    { name: 'Move Your Body', description: 'Do at least 20 minutes of physical activity.', frequency: 'daily' },
    { name: 'Reflect', description: 'Spend 5 minutes reflecting on your day before bed.', frequency: 'daily' },
    { name: 'Learn', description: 'Spend 15 minutes learning something new.', frequency: 'daily' },
  ];
}
