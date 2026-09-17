export default function MiniBarChart({ values, labels }) {
  const max = Math.max(100, ...values);
  const width = 320;
  const height = 120;
  const barGap = 10;
  const barWidth = values.length ? Math.min(36, (width - barGap * (values.length - 1)) / values.length) : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="mini-bar-chart">
      {values.map((v, i) => {
        const h = (v / max) * (height - 24);
        const x = i * (barWidth + barGap);
        const y = height - 24 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} rx={4} fill="var(--lime)" />
            <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize="9" fill="var(--text-faint)">
              {labels?.[i] ?? i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
