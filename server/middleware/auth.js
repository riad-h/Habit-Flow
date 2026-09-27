/**
 * Simple auth middleware for the AI endpoint.
 * In production, this would verify a Supabase JWT.
 * For MVP, we do a basic check that an auth token is present.
 */

// Simple rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map();
const RATE_LIMIT = 10; // requests per day per user
const RATE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  // Extract user identifier from token
  const token = authHeader.replace('Bearer ', '');
  const userId = extractUserId(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid authentication.' });
  }

  // Rate limiting
  const now = Date.now();
  const userLimits = rateLimitStore.get(userId) || { count: 0, resetAt: now + RATE_WINDOW };

  if (now > userLimits.resetAt) {
    userLimits.count = 0;
    userLimits.resetAt = now + RATE_WINDOW;
  }

  if (userLimits.count >= RATE_LIMIT) {
    return res.status(429).json({
      error: 'Daily AI generation limit reached. Please try again tomorrow.',
    });
  }

  userLimits.count++;
  rateLimitStore.set(userId, userLimits);

  req.userId = userId;
  next();
}

function extractUserId(token) {
  // In a real implementation, this would verify a Supabase JWT
  // For MVP, we accept any non-empty token
  if (!token || token.length < 10) return null;

  // Try to extract user ID from token format "auth-token-{userId}"
  const match = token.match(/^auth-token-(.+)$/);
  if (match) return match[1];

  // Accept any token as valid for demo purposes
  return token.substring(0, 36);
}
