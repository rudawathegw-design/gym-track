// anatomy.jsx — MuscleMap (front/back body with highlighted target muscles)
// and EquipmentIcon. Exported to window for other babel scripts.

const LIME = '#c8ff00';
const BASE_MUSCLE = '#323232';
const BASE_BODY = '#1f1f1f';
const OUTLINE = '#3a3a3a';

// ---- Muscle map -----------------------------------------------------------
function FrontFigure({ fill, strk }) {
  return (
    <g>
      {/* base silhouette */}
      <g fill={BASE_BODY} stroke="none">
        <circle cx="50" cy="16" r="11" />
        <rect x="44" y="25" width="12" height="8" rx="3" />
        <path d="M32 34 Q50 28 68 34 L66 86 Q50 92 34 86 Z" />
        <rect x="13" y="38" width="12" height="52" rx="6" />
        <rect x="75" y="38" width="12" height="52" rx="6" />
        <rect x="35" y="86" width="13" height="98" rx="6" />
        <rect x="52" y="86" width="13" height="98" rx="6" />
      </g>
      {/* traps (front) */}
      <path d="M40 31 L50 36 L60 31 L57 40 L43 40 Z" fill={fill('traps')} stroke={strk('traps')} strokeWidth="0.6" />
      {/* delts */}
      <ellipse cx="29" cy="42" rx="10" ry="9" fill={fill('delts')} stroke={strk('delts')} strokeWidth="0.6" />
      <ellipse cx="71" cy="42" rx="10" ry="9" fill={fill('delts')} stroke={strk('delts')} strokeWidth="0.6" />
      {/* chest */}
      <path d="M50 43 Q40 41 35 46 Q36 56 50 57 Z" fill={fill('chest')} stroke={strk('chest')} strokeWidth="0.6" />
      <path d="M50 43 Q60 41 65 46 Q64 56 50 57 Z" fill={fill('chest')} stroke={strk('chest')} strokeWidth="0.6" />
      {/* biceps */}
      <ellipse cx="22" cy="58" rx="6" ry="13" fill={fill('biceps')} stroke={strk('biceps')} strokeWidth="0.6" />
      <ellipse cx="78" cy="58" rx="6" ry="13" fill={fill('biceps')} stroke={strk('biceps')} strokeWidth="0.6" />
      {/* forearms */}
      <ellipse cx="18" cy="82" rx="5" ry="13" fill={fill('forearms')} stroke={strk('forearms')} strokeWidth="0.6" />
      <ellipse cx="82" cy="82" rx="5" ry="13" fill={fill('forearms')} stroke={strk('forearms')} strokeWidth="0.6" />
      {/* abs */}
      <rect x="43" y="58" width="14" height="26" rx="3" fill={fill('abs')} stroke={strk('abs')} strokeWidth="0.6" />
      <g stroke={BASE_BODY} strokeWidth="0.8" opacity="0.5">
        <line x1="50" y1="60" x2="50" y2="82" />
        <line x1="44" y1="66" x2="56" y2="66" />
        <line x1="44" y1="73" x2="56" y2="73" />
      </g>
      {/* obliques */}
      <path d="M42 60 L42 82 L38 78 L39 62 Z" fill={fill('obliques')} stroke={strk('obliques')} strokeWidth="0.6" />
      <path d="M58 60 L58 82 L62 78 L61 62 Z" fill={fill('obliques')} stroke={strk('obliques')} strokeWidth="0.6" />
      {/* quads */}
      <ellipse cx="41" cy="118" rx="9" ry="24" fill={fill('quads')} stroke={strk('quads')} strokeWidth="0.6" />
      <ellipse cx="59" cy="118" rx="9" ry="24" fill={fill('quads')} stroke={strk('quads')} strokeWidth="0.6" />
      {/* calves (front shin) */}
      <ellipse cx="41" cy="166" rx="6" ry="17" fill={fill('calves')} stroke={strk('calves')} strokeWidth="0.6" />
      <ellipse cx="59" cy="166" rx="6" ry="17" fill={fill('calves')} stroke={strk('calves')} strokeWidth="0.6" />
    </g>
  );
}

function BackFigure({ fill, strk }) {
  return (
    <g>
      <g fill={BASE_BODY} stroke="none">
        <circle cx="50" cy="16" r="11" />
        <rect x="44" y="25" width="12" height="8" rx="3" />
        <path d="M32 34 Q50 28 68 34 L66 86 Q50 92 34 86 Z" />
        <rect x="13" y="38" width="12" height="52" rx="6" />
        <rect x="75" y="38" width="12" height="52" rx="6" />
        <rect x="35" y="86" width="13" height="98" rx="6" />
        <rect x="52" y="86" width="13" height="98" rx="6" />
      </g>
      {/* traps */}
      <path d="M39 30 L50 34 L61 30 L58 48 L50 52 L42 48 Z" fill={fill('traps')} stroke={strk('traps')} strokeWidth="0.6" />
      {/* rear delts */}
      <ellipse cx="29" cy="42" rx="10" ry="9" fill={fill('delts')} stroke={strk('delts')} strokeWidth="0.6" />
      <ellipse cx="71" cy="42" rx="10" ry="9" fill={fill('delts')} stroke={strk('delts')} strokeWidth="0.6" />
      {/* triceps */}
      <ellipse cx="22" cy="58" rx="6" ry="13" fill={fill('triceps')} stroke={strk('triceps')} strokeWidth="0.6" />
      <ellipse cx="78" cy="58" rx="6" ry="13" fill={fill('triceps')} stroke={strk('triceps')} strokeWidth="0.6" />
      {/* forearms */}
      <ellipse cx="18" cy="82" rx="5" ry="13" fill={fill('forearms')} stroke={strk('forearms')} strokeWidth="0.6" />
      <ellipse cx="82" cy="82" rx="5" ry="13" fill={fill('forearms')} stroke={strk('forearms')} strokeWidth="0.6" />
      {/* lats */}
      <path d="M42 50 Q35 52 36 64 L50 80 L50 52 Z" fill={fill('lats')} stroke={strk('lats')} strokeWidth="0.6" />
      <path d="M58 50 Q65 52 64 64 L50 80 L50 52 Z" fill={fill('lats')} stroke={strk('lats')} strokeWidth="0.6" />
      {/* lower back */}
      <path d="M44 80 L56 80 L54 90 L46 90 Z" fill={fill('lowerback')} stroke={strk('lowerback')} strokeWidth="0.6" />
      {/* glutes */}
      <ellipse cx="42" cy="100" rx="9" ry="9" fill={fill('glutes')} stroke={strk('glutes')} strokeWidth="0.6" />
      <ellipse cx="58" cy="100" rx="9" ry="9" fill={fill('glutes')} stroke={strk('glutes')} strokeWidth="0.6" />
      {/* hamstrings */}
      <ellipse cx="41" cy="130" rx="9" ry="22" fill={fill('hamstrings')} stroke={strk('hamstrings')} strokeWidth="0.6" />
      <ellipse cx="59" cy="130" rx="9" ry="22" fill={fill('hamstrings')} stroke={strk('hamstrings')} strokeWidth="0.6" />
      {/* calves */}
      <ellipse cx="41" cy="166" rx="6" ry="18" fill={fill('calves')} stroke={strk('calves')} strokeWidth="0.6" />
      <ellipse cx="59" cy="166" rx="6" ry="18" fill={fill('calves')} stroke={strk('calves')} strokeWidth="0.6" />
    </g>
  );
}

function MuscleMap({ primary = [], secondary = [], view = 'both', height = 150 }) {
  const P = new Set(primary), S = new Set(secondary);
  const ACC = window.__accent || LIME;
  const accA = (a) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ACC);
    return m ? `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})` : ACC;
  };
  const fill = (k) => (P.has(k) ? ACC : S.has(k) ? accA(0.28) : BASE_MUSCLE);
  const strk = (k) => (P.has(k) ? ACC : S.has(k) ? accA(0.5) : OUTLINE);
  const showFront = view === 'both' || view === 'front';
  const showBack = view === 'both' || view === 'back';
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, height }}>
      {showFront && (
        <svg viewBox="0 0 100 190" height="100%" style={{ overflow: 'visible' }}>
          <FrontFigure fill={fill} strk={strk} />
        </svg>
      )}
      {showBack && (
        <svg viewBox="0 0 100 190" height="100%" style={{ overflow: 'visible' }}>
          <BackFigure fill={fill} strk={strk} />
        </svg>
      )}
    </div>
  );
}

// ---- Equipment icons ------------------------------------------------------
function EquipmentIcon({ type, size = 20, color = 'currentColor' }) {
  const s = { width: size, height: size, display: 'block' };
  const sw = 1.8;
  switch (type) {
    case 'barbell':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <rect x="4" y="8" width="2.4" height="8" rx="1" fill={color} stroke="none" />
          <rect x="7" y="6" width="2.4" height="12" rx="1" fill={color} stroke="none" />
          <rect x="14.6" y="6" width="2.4" height="12" rx="1" fill={color} stroke="none" />
          <rect x="17.6" y="8" width="2.4" height="8" rx="1" fill={color} stroke="none" />
        </svg>
      );
    case 'dumbbell':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
          <line x1="8" y1="12" x2="16" y2="12" />
          <rect x="3" y="7.5" width="3" height="9" rx="1.2" fill={color} stroke="none" />
          <rect x="18" y="7.5" width="3" height="9" rx="1.2" fill={color} stroke="none" />
        </svg>
      );
    case 'cable':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.4" />
          <path d="M12 7.4 L12 12" />
          <path d="M9 12 L15 12 L13.5 16 L10.5 16 Z" fill={color} stroke="none" />
          <path d="M10.5 16 L10.5 19 M13.5 16 L13.5 19" />
        </svg>
      );
    case 'machine':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="5" height="16" rx="1" />
          <line x1="9" y1="8" x2="18" y2="8" />
          <circle cx="18" cy="8" r="2.6" />
          <line x1="6.5" y1="20" x2="20" y2="20" />
        </svg>
      );
    case 'bodyweight':
    default:
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.4" />
          <path d="M12 8 L12 14 M12 14 L8 20 M12 14 L16 20 M6 10 L18 10" />
        </svg>
      );
  }
}

Object.assign(window, { MuscleMap, EquipmentIcon });
