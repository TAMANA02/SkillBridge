// Milestone and badge templates for the client project workspace.
// In production these would come from the backend once a project agreement
// is generated; kept local for now so the workflow is fully demoable.

export const MILESTONE_TEMPLATE = [
  { id: 'requirement-analysis', title: 'Requirement Analysis', badge: null },
  { id: 'ui-ux-design', title: 'UI/UX Design', badge: { icon: '🏅', label: 'UI Specialist' } },
  { id: 'frontend-development', title: 'Frontend Development', badge: { icon: '🏅', label: 'Frontend Expert' } },
  { id: 'backend-development', title: 'Backend Development', badge: { icon: '🏅', label: 'Reliable Developer' } },
  { id: 'integration', title: 'Integration', badge: { icon: '🏅', label: 'Milestone Master' } },
  { id: 'testing', title: 'Testing', badge: { icon: '🏅', label: 'On-Time Performer' } },
  { id: 'deployment', title: 'Deployment', badge: { icon: '🏅', label: 'Project Finisher' } },
];

export const ALL_BADGES = [
  { icon: '🏅', label: 'UI Specialist' },
  { icon: '🏅', label: 'Frontend Expert' },
  { icon: '🏅', label: 'On-Time Performer' },
  { icon: '🏅', label: 'Milestone Master' },
  { icon: '🏅', label: 'Reliable Developer' },
  { icon: '🏅', label: 'Project Finisher' },
];

export const BUDGET_TIERS = [
  { id: 'tier-1', label: '\u20b910,000 \u2013 \u20b920,000' },
  { id: 'tier-2', label: '\u20b920,000 \u2013 \u20b950,000' },
  { id: 'tier-3', label: '\u20b950,000+' },
  { id: 'custom', label: 'Custom amount' },
];

export const TIMELINE_OPTIONS = [
  { id: '7', label: '7 days' },
  { id: '15', label: '15 days' },
  { id: '30', label: '30 days' },
  { id: 'custom', label: 'Custom date' },
];

export const UI_STYLE_OPTIONS = ['Minimal', 'Modern', 'Playful', 'Corporate', 'Editorial', 'Bold & colorful'];
export const LAYOUT_OPTIONS = ['Single page', 'Multi-page', 'Dashboard-style', 'E-commerce grid'];

export const FRONTEND_OPTIONS = ['React', 'Next.js', 'Vue', 'Angular', 'HTML/CSS/JS', 'Figma'];
export const BACKEND_OPTIONS = ['Node.js', 'Django', 'FastAPI', 'Python', 'Laravel', 'Spring Boot', 'Firebase'];
export const DATABASE_OPTIONS = ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Firebase'];
