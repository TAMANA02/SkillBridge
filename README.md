# SkillBridge — React Frontend

Migrated from the original static HTML/CSS/JS SkillBridge site to a
React + Vite frontend, ready to talk to a Django REST Framework backend.

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and point `VITE_API_URL` at your Django
backend (defaults to `http://localhost:8000/api`).

## What's preserved from the original site

- All copy, stats, services, and content from the original pages
- Voice navigation (Web Speech API) — same commands, now routed through React Router
- Multi-step student registration (8 steps) and client registration (4 steps),
  with the same fields and required-field validation
- Project showcase with search/filter + detail panel
- Hall of Fame leaderboard tabs
- Smart developer search + invite-to-project modal
- Student and client dashboards, jobs/projects, post-project, manage-projects
- The public student profile page (Amaya Kapoor) with hire/chat/resume-download/share

## What's new

- Dark editorial + electric-lime visual identity (see `src/styles/theme.css`)
- Proper React component architecture (Navbar, Footer, cards, modals, wizards, etc.)
- React Router routes instead of hash-anchor sections
- `src/services/api.js` — centralized Axios layer shaped for Django REST endpoints
- `src/context/AuthContext.jsx` — ready for JWT auth; currently simulates a session
  locally so the UI works standalone. Swap the commented-out real calls in when the
  Django backend is live.
- Framer Motion micro-interactions throughout

## Structure

See `src/` — `components/`, `layouts/`, `pages/` (with `student/` and `client/`
subfolders), `context/`, `hooks/`, `services/`, `data/` (mock content, swap for
live API data).

## Notes

- This was built without network access to npm, so dependencies were never
  installed here. Every file was syntax-checked and the whole app was bundled
  successfully with esbuild against stub packages to confirm all imports
  resolve — but you should still run `npm install && npm run dev` and click
  through it once before treating it as final.
- Images on the student profile page use the same Unsplash placeholder URLs
  as the original site — swap for real uploads once the media pipeline exists.
