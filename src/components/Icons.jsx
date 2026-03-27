// ========================================
// まなびクエスト - SVGアイコン
// ========================================

// --- 科目アイコン ---

export function KokugoIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="10" y="6" width="28" height="36" rx="3" fill="#f9a8d4" />
      <rect x="14" y="10" width="20" height="28" rx="2" fill="#fff" />
      <path d="M18 18h12M18 23h12M18 28h8" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 6h4v6h-4z" fill="#ec4899" rx="1" />
    </svg>
  );
}

export function SansuIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#fbcfe8" />
      <text x="12" y="22" fontSize="14" fontWeight="700" fill="#db2777">1+2</text>
      <line x1="10" y1="26" x2="38" y2="26" stroke="#ec4899" strokeWidth="2" />
      <text x="19" y="38" fontSize="14" fontWeight="700" fill="#db2777">3</text>
    </svg>
  );
}

export function RikaIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M19 8h10v16l8 14a3 3 0 01-2.6 4.5H13.6A3 3 0 0111 38l8-14V8z" fill="#fbcfe8" />
      <path d="M19 8h10" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="34" r="2.5" fill="#f472b6" />
      <circle cx="28" cy="31" r="1.8" fill="#c084fc" />
      <circle cx="24" cy="38" r="1.5" fill="#f9a8d4" />
      <rect x="17" y="5" width="14" height="3" rx="1.5" fill="#ec4899" />
    </svg>
  );
}

export function ShakaiIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#fbcfe8" />
      <ellipse cx="24" cy="24" rx="20" ry="20" fill="none" stroke="#f9a8d4" strokeWidth="1" />
      <ellipse cx="24" cy="24" rx="9" ry="20" fill="none" stroke="#f9a8d4" strokeWidth="1.5" />
      <line x1="4" y1="24" x2="44" y2="24" stroke="#f9a8d4" strokeWidth="1.5" />
      <line x1="24" y1="4" x2="24" y2="44" stroke="#f9a8d4" strokeWidth="1.5" />
      <path d="M6 16h36M6 32h36" stroke="#f9a8d4" strokeWidth="1" />
      <circle cx="24" cy="24" r="20" fill="none" stroke="#ec4899" strokeWidth="2" />
    </svg>
  );
}

export function EigoIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="10" width="40" height="28" rx="4" fill="#fbcfe8" />
      <text x="10" y="30" fontSize="18" fontWeight="800" fontFamily="sans-serif" fill="#db2777">ABC</text>
      <circle cx="39" cy="15" r="4" fill="#f472b6" />
      <text x="37" y="18" fontSize="7" fontWeight="700" fill="#fff">EN</text>
    </svg>
  );
}

// --- ナビアイコン ---

export function HomeIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l9-8 9 8" />
      <path d="M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
    </svg>
  );
}

export function HistoryIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <path d="M3 12h2M19 12h2" />
    </svg>
  );
}

export function DashboardIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="5" height="8" rx="1" fill={color} opacity="0.3" />
      <rect x="10" y="9" width="5" height="12" rx="1" fill={color} opacity="0.3" />
      <rect x="17" y="5" width="5" height="16" rx="1" fill={color} opacity="0.3" />
      <rect x="3" y="13" width="5" height="8" rx="1" />
      <rect x="10" y="9" width="5" height="12" rx="1" />
      <rect x="17" y="5" width="5" height="16" rx="1" />
    </svg>
  );
}

// --- その他アイコン ---

export function BackIcon({ size = 20, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function CorrectIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#dcfce7" stroke="#4ade80" strokeWidth="2" />
      <path d="M7 12.5l3 3 7-7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WrongIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#fee2e2" stroke="#f87171" strokeWidth="2" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// --- 科目マップ ---

export const subjectIcons = {
  kokugo: KokugoIcon,
  sansu: SansuIcon,
  rika: RikaIcon,
  shakai: ShakaiIcon,
  eigo: EigoIcon,
};
