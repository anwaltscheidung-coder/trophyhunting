import type { Grade } from '../types';

type P = { size?: number; className?: string };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const GRADE_LABEL: Record<Grade, string> = {
  platinum: 'Platin',
  gold: 'Gold',
  silver: 'Silber',
  bronze: 'Bronze',
};

/** Pokal in der Farbe der Trophäenstufe. */
export function Cup({ grade, size = 22, dim = false }: { grade: Grade; size?: number; dim?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`cup cup-${grade}${dim ? ' cup-dim' : ''}`}
      role="img"
      aria-label={GRADE_LABEL[grade]}
    >
      <path
        d="M7 3h10v5a5 5 0 0 1-10 0V3Z"
        fill="currentColor"
      />
      <path d="M7 5H4.5a2.5 2.5 0 0 0 2.6 3.6M17 5h2.5a2.5 2.5 0 0 1-2.6 3.6" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M10.5 13h3v3.5h-3z" fill="currentColor" />
      <path d="M8 21v-2.2c0-.9.7-1.6 1.6-1.6h4.8c.9 0 1.6.7 1.6 1.6V21H8Z" fill="currentColor" />
      <path d="M9.5 5.5v2.2a2.5 2.5 0 0 0 1.6 2.3" stroke="var(--cup-shine)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const Back = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M15 18l-6-6 6-6" /></svg>
);
export const ChevronRight = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M9 6l6 6-6 6" /></svg>
);
export const ChevronLeft = Back;
export const Gear = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);
export const Check = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M20 6L9 17l-5-5" /></svg>
);
export const Alert = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);
export const Flag = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 22V4M4 4h12l-2 4 2 4H4" /></svg>
);
export const Eye = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const Lock = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
export const Compass = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
  </svg>
);
export const Route = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="6" cy="19" r="2.5" />
    <circle cx="18" cy="5" r="2.5" />
    <path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5" />
  </svg>
);
export const List = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
);
export const Gem = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
    <path d="M2 9h20M12 21L8 9l4-6 4 6-4 12" />
  </svg>
);
export const Plus = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12h14" /></svg>
);
export const Coffee = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8ZM6 1v3M10 1v3M14 1v3" />
  </svg>
);
export const Link = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </svg>
);
export const Play = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" />
  </svg>
);
export const Book = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </svg>
);
export const External = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);
