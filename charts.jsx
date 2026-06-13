// charts.jsx — lightweight SVG charts. Exported to window.
const C_GRID = '#262626';
const C_AXIS = '#525252';
const ACCENT = () => window.__accent || '#c8ff00';

function niceExtent(vals, pad = 0.08) {
  let min = Math.min(...vals), max = Math.max(...vals);
  if (min === max) { min -= 1; max += 1; }
  const r = max - min;
  return [min - r * pad, max + r * pad];
}

// Line chart with optional PR dot (last/max point) highlighting.
function LineChart({ data, yKey = 'value', height = 170, color, format = (v) => v, label }) {
  color = color || ACCENT();
  const W = 320, H = height, padL = 38, padR = 14, padT = 16, padB = 26;
  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C_AXIS, fontSize: 13 }}>No data yet</div>;
  }
  const xs = data.map((_, i) => i);
  const ys = data.map((d) => d[yKey]);
  const [yMin, yMax] = niceExtent(ys);
  const X = (i) => padL + (xs.length === 1 ? (W - padL - padR) / 2 : (i / (xs.length - 1)) * (W - padL - padR));
  const Y = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${X(i).toFixed(1)} ${Y(d[yKey]).toFixed(1)}`).join(' ');
  const area = `${path} L ${X(data.length - 1).toFixed(1)} ${H - padB} L ${X(0).toFixed(1)} ${H - padB} Z`;
  const maxVal = Math.max(...ys);
  const ticks = 3;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => yMin + (i / ticks) * (yMax - yMin));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id={'g' + (label || 'x')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridVals.map((v, i) => (
        <g key={i}>
          <line x1={padL} y1={Y(v)} x2={W - padR} y2={Y(v)} stroke={C_GRID} strokeWidth="1" />
          <text x={padL - 6} y={Y(v) + 3} textAnchor="end" fontSize="9" fill={C_AXIS}>{format(Math.round(v))}</text>
        </g>
      ))}
      <path d={area} fill={`url(#g${label || 'x'})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const isPR = d[yKey] === maxVal;
        return (
          <g key={i}>
            <circle cx={X(i)} cy={Y(d[yKey])} r={isPR ? 4 : 2.6} fill={isPR ? color : '#0a0a0a'} stroke={color} strokeWidth="2" />
            {isPR && <circle cx={X(i)} cy={Y(d[yKey])} r="7" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />}
          </g>
        );
      })}
    </svg>
  );
}

function BarChart({ data, yKey = 'value', labelKey = 'label', height = 150, color, format = (v) => v }) {
  color = color || ACCENT();
  const W = 320, H = height, padL = 34, padR = 10, padT = 14, padB = 22;
  if (!data || !data.length) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C_AXIS, fontSize: 13 }}>No data yet</div>;
  }
  const ys = data.map((d) => d[yKey]);
  const yMax = Math.max(...ys, 1) * 1.12;
  const n = data.length;
  const gap = 8;
  const bw = (W - padL - padR - gap * (n - 1)) / n;
  const Y = (v) => padT + (1 - v / yMax) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={padT + t * (H - padT - padB)} x2={W - padR} y2={padT + t * (H - padT - padB)} stroke={C_GRID} strokeWidth="1" />
          <text x={padL - 5} y={padT + t * (H - padT - padB) + 3} textAnchor="end" fontSize="9" fill={C_AXIS}>{format(Math.round((1 - t) * yMax))}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = padL + i * (bw + gap);
        const y = Y(d[yKey]);
        const h = H - padB - y;
        const last = i === n - 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={Math.max(0, h)} rx="3" fill={color} opacity={last ? 1 : 0.34} />
            <text x={x + bw / 2} y={H - padB + 12} textAnchor="middle" fontSize="9" fill={C_AXIS}>{d[labelKey]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Sparkline({ data, color, width = 64, height = 22 }) {
  color = color || ACCENT();
  if (!data || data.length < 2) {
    return <svg width={width} height={height}><line x1="0" y1={height - 2} x2={width} y2={height - 2} stroke={C_GRID} strokeWidth="2" /></svg>;
  }
  const [mn, mx] = niceExtent(data, 0.12);
  const X = (i) => (i / (data.length - 1)) * width;
  const Y = (v) => height - 2 - ((v - mn) / (mx - mn)) * (height - 4);
  const path = data.map((v, i) => `${i ? 'L' : 'M'} ${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  const up = data[data.length - 1] >= data[0];
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={up ? color : '#ff5a5a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(data.length - 1)} cy={Y(data[data.length - 1])} r="2.2" fill={up ? color : '#ff5a5a'} />
    </svg>
  );
}

Object.assign(window, { LineChart, BarChart, Sparkline });
