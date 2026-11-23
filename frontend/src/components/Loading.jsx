export default function Loading({ rows = 3, height = 90 }) {
  return (
    <div style={{ display: 'grid', gap: '0.9rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}
