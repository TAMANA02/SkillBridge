import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value, onChange, size = 22 }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="star-rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="star-rating-btn"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star size={size} fill={n <= active ? 'var(--orange)' : 'none'} color={n <= active ? 'var(--orange)' : 'var(--text-faint)'} />
        </button>
      ))}
    </div>
  );
}
