import { ALL_BADGES } from '../../data/flowTemplates';

export default function BadgeGrid({ earned = [] }) {
  const earnedLabels = new Set(earned.map((b) => b.label));
  return (
    <div className="badge-grid">
      {ALL_BADGES.map((badge) => {
        const isEarned = earnedLabels.has(badge.label);
        return (
          <div key={badge.label} className={`badge-chip ${isEarned ? 'earned' : 'locked'}`}>
            <span className="badge-chip-icon">{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}
