# Habit-Flow — Minimalist Habit Tracker

A calm, minimal, distraction-free habit tracking application. Built with React, Supabase, and a lightweight Express server for AI-powered habit suggestions.

![Habit-Flow](https://img.shields.io/badge/status-active-brightgreen) ![React](https://img.shields.io/badge/react-18-blue) ![Supabase](https://img.shields.io/badge/supabase-postgres-green)

---

## What is Habit-Flow?

Habit-Flow is a web application that helps you build and maintain daily habits. It answers one simple question:

> **"Did I do the habits I care about today?"**

### Features

- ✅ Create and manage daily habits
- ✅ Track completions with one click
- ✅ View current and longest streaks
- ✅ Calendar history view
- ✅ AI-powered habit suggestions (via Grok API)
- ✅ Secure authentication (email/password)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Minimal, calm interface

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, JavaScript, Pure CSS |
| Build Tool | Vite |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| AI Service | Grok API (via Express server) |
| Server | Node.js, Express |

---

## Project Structure

```
habit-flow/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── HabitCard.jsx         # Individual habit display
│   │   ├── HabitForm.jsx         # Create/edit habit form
│   │   ├── HabitCalendar.jsx     # Calendar history view
│   │   ├── AIHabitGenerator.jsx  # AI suggestion interface
│   │   ├── Modal.jsx             # Reusable modal dialog
│   │   └── LoadingSpinner.jsx    # Loading indicator
│   │
│   ├── pages/                    # Page components
│   │   ├── Login.jsx             # Sign in page
│   │   ├── Signup.jsx            # Create account page
│   │   ├── Dashboard.jsx         # Main habit tracking page
│   │   ├── History.jsx           # Calendar & statistics
│   │   ├── Profile.jsx           # User profile & logout
│   │   └── NotFound.jsx          # 404 page
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.js            # Authentication state & methods
│   │   └── useHabits.js          # Habit CRUD operations
│   │
│   ├── lib/                      # External service clients
│   │   ├── supabase.js           # Supabase client configuration
│   │   └── api.js                # Backend API client
│   │
│   ├── utils/                    # Utility functions
│   │   ├── dateUtils.js          # Date formatting & calendar helpers
│   │   ├── streakUtils.js        # Streak calculations
│   │   └── validation.js         # Input validation
│   │
│   ├── styles/                   # (Using index.css for all styles)
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # All CSS styles
│
├── server/                       # Express backend (AI features only)
│   ├── routes/
│   │   └── ai.js                 # POST /api/ai/habits endpoint
│   ├── services/
│   │   └── grokService.js        # Grok API integration
│   ├── middleware/
│   │   └── auth.js               # Auth verification & rate limiting
│   ├── server.js                 # Express server entry
│   └── package.json              # Server dependencies
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema & RLS policies
│
├── .env.example                  # Environment variable template
├── .gitignore
├── README.md
└── package.json                  # Frontend dependencies
```

---

## Setup Guide (Step by Step)

### Prerequisites

You need:
- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- A free **Supabase** account ([Sign up here](https://supabase.com/))
- A **Grok API** key (optional, for AI features) from [console.x.ai](https://console.x.ai)

---

### Step 1: Clone / Download the Project

```bash
git clone <repository-url>
cd habit-flow
```

---

### Step 2: Set Up Supabase

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com) and sign in
   - Click "New Project"
   - Give it a name (e.g., "habit-flow")
   - Set a secure database password (save it somewhere!)
   - Choose a region close to you
   - Click "Create new project" (wait ~2 minutes for it to be ready)

2. **Get your API keys:**
   - Go to **Settings** → **API** in the left sidebar
   - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy the **anon public** key (a long string starting with `eyJ...`)

3. **Run the database migration:**
   - Go to **SQL Editor** in the left sidebar
   - Click "New query"
   - Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
   - Paste it into the SQL editor
   - Click "Run" (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

4. **Enable email authentication:**
   - Go to **Authentication** → **Providers** in the left sidebar
   - Make sure **Email** is enabled
   - Optionally disable "Confirm email" for easier testing (Settings → Auth → Email Auth)

---

### Step 3: Configure Environment Variables

1. **Create a `.env` file** in the project root:

```bash
cp .env.example .env
```

2. **Edit the `.env` file** with your values:

```env
# From Supabase Settings > API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: For AI features
VITE_API_URL=http://localhost:5000/api

# Grok API key (get from console.x.ai)
GROK_API_KEY=xai-xxxxxxxxxxxxx

# Server settings
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Important:** 
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required for the app to work
- `GROK_API_KEY` is optional — without it, the AI feature returns demo suggestions

---

### Step 4: Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend (for AI features):**
```bash
cd server
npm install
cd ..
```

---

### Step 5: Run the Application

**Option A: Frontend only (no AI features)**
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

**Option B: Frontend + Backend (with AI features)**

In one terminal:
```bash
npm run dev
```

In another terminal:
```bash
cd server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## How to Use the Application

### 1. Create an Account
- Open the app in your browser
- Click "Create one" on the login page
- Enter your email and a password (minimum 6 characters)
- Click "Create account"

### 2. Create Your First Habit
- You'll see the dashboard with an empty state
- Click **"Create habit"** to add a habit manually
- Or click **"Create with AI"** to get AI suggestions

### 3. Track Habits Daily
- On the dashboard, you'll see today's habits
- Click the circle next to a habit to mark it complete
- Click again to uncomplete it
- Your streak updates automatically

### 4. View History
- Click "History" in the navigation
- Select a habit from the dropdown
- View your calendar with completion indicators
- See your current streak, longest streak, and completion rate

### 5. Manage Habits
- Click the ✎ (edit) icon to modify a habit
- Click the ✕ (delete) icon to archive a habit
- Habits are archived (not permanently deleted)

---

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized static files. Deploy these to any static hosting service (Netlify, Vercel, Cloudflare Pages, etc.).

For the server:
```bash
cd server
npm install
# Set environment variables on your hosting platform
npm start
```

---

## Deployment

### Frontend
Deploy the `dist/` folder to:
- **Vercel** — `vercel deploy`
- **Netlify** — Drag and drop `dist/` folder
- **Cloudflare Pages** — Connect your Git repo

### Backend
Deploy the `server/` folder to:
- **Railway** — Connect Git repo
- **Render** — Connect Git repo, set as Node service
- **Fly.io** — `fly launch` in server directory

### Environment Variables on Production
Set these on your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GROK_API_KEY`
- `PORT`
- `CLIENT_URL` (set to your frontend URL)

---

## Security Notes

- The Grok API key is **never exposed** to the browser — it lives only on the server
- Supabase Row Level Security (RLS) ensures users can only access their own data
- Passwords are handled entirely by Supabase Auth — never stored by us
- The server validates all AI responses before returning them to the client
- Rate limiting prevents abuse of the AI endpoint (10 requests/user/day)

---

## Troubleshooting

### "Supabase is not configured"
- Make sure your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after changing `.env`

### "Unable to load habits"
- Check that the SQL migration was run successfully
- Verify your Supabase project is active

### AI features not working
- Make sure the Express server is running (`cd server && npm run dev`)
- Check that `VITE_API_URL` points to the correct server URL
- If no `GROK_API_KEY` is set, demo suggestions will be returned instead

### Build errors
- Make sure you're using Node.js 18+
- Delete `node_modules/` and run `npm install` again
- Check that all files are saved

---

## Date Handling Approach

- All dates are stored as `YYYY-MM-DD` strings in the database
- Completions use the user's local date (not UTC)
- Streak calculations work backwards from today
- If today is not completed, the streak starts from yesterday
- The calendar shows the current month with navigation

---

## Limitations (MVP)

- No offline support (requires internet connection)
- No push notifications
- No data export/import
- AI suggestions are limited to 10 per user per day
- No habit categories or tags
- No shared habits or accountability partners
- No dark mode (planned for future)

---

## License

MIT — Use freely for personal or commercial projects.
