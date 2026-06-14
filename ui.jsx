// ui.jsx — shared presentational components. Exported to window.
const { useState } = React;

function Chip({ children, active, onClick, tone }) {
  return (
    <button className={'chip' + (active ? ' chip--on' : '') + (tone ? ' chip--' + tone : '')} onClick={onClick}>
      {children}
    </button>
  );
}

function StatTile({ label, value, unit, sub, spark, accent }) {
  return (
    <div className={'stat' + (accent ? ' stat--accent' : '')}>
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}<span className="stat__unit">{unit}</span></div>
      <div className="stat__foot">
        {sub && <span className="stat__sub">{sub}</span>}
        {spark && <Sparkline data={spark} />}
      </div>
    </div>
  );
}

// small avatar: muscle map thumbnail + equipment badge
function ExerciseAvatar({ ex, size = 56 }) {
  return (
    <div className="ex-avatar" style={{ width: size, height: size }}>
      <MuscleMap primary={ex.primary} secondary={ex.secondary} view={ex.view} height={size - 8} />
      <span className="ex-avatar__eq"><EquipmentIcon type={ex.equipment} size={13} color="#0a0a0a" /></span>
    </div>
  );
}

function NumberStepper({ value, onChange, step = 1, min = 0, suffix }) {
  return (
    <div className="stepper">
      <button className="stepper__btn" onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}>–</button>
      <div className="stepper__val">{value}{suffix && <span className="stepper__suf">{suffix}</span>}</div>
      <button className="stepper__btn" onClick={() => onChange(+(value + step).toFixed(2))}>+</button>
    </div>
  );
}

// One editable set row inside a workout
function SetRow({ idx, set, track, onChange, onRemove, prevText, isPR }) {
  const isBW = track === 'bodyweight';
  const isTime = track === 'time';
  const isCardio = track === 'cardio';
  return (
    <div className={'setrow' + (set.done ? ' setrow--done' : '')}>
      <button className="setrow__no" onClick={() => onChange({ ...set, done: !set.done })} title="Mark set done">
        {set.done ? <Check /> : idx + 1}
      </button>
      <div className="setrow__fields">
        {isCardio ? (
          <Field label="min" value={set.reps} onChange={(v) => onChange({ ...set, reps: v, kg: 0 })} step={5} />
        ) : isTime ? (
          <Field label="sec" value={set.reps} onChange={(v) => onChange({ ...set, reps: v, kg: 0 })} step={5} />
        ) : isBW ? (
          <Field label="reps" value={set.reps} onChange={(v) => onChange({ ...set, reps: v, kg: 0 })} step={1} />
        ) : (
          <>
            <Field label="reps" value={set.reps} onChange={(v) => onChange({ ...set, reps: v })} step={1} />
            <span className="setrow__x">×</span>
            <Field label="kg" value={set.kg} onChange={(v) => onChange({ ...set, kg: v })} step={2.5} placeholder="0" />
          </>
        )}
      </div>
      <div className="setrow__meta">
        {isPR && <span className="pr-dot" title="Personal record">PR</span>}
        {prevText && <span className="setrow__prev">{prevText}</span>}
      </div>
      <button className="setrow__rm" onClick={onRemove} title="Remove set">×</button>
    </div>
  );
}

function Field({ label, value, onChange, step, placeholder }) {
  return (
    <label className="field">
      <input
        type="number" inputMode="decimal" className="field__input"
        value={value === 0 ? '' : value}
        placeholder={placeholder || '0'}
        onChange={(e) => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
      />
      <span className="field__label">{label}</span>
    </label>
  );
}

function Check() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>;
}

function Sheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        {title && <div className="sheet__head"><h3>{title}</h3><button className="sheet__close" onClick={onClose}>×</button></div>}
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="sec-title">
      <span>{children}</span>
      {action}
    </div>
  );
}

function EmptyState({ icon, title, sub, cta }) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <div className="empty__title">{title}</div>
      {sub && <div className="empty__sub">{sub}</div>}
      {cta}
    </div>
  );
}

Object.assign(window, { Chip, StatTile, ExerciseAvatar, NumberStepper, SetRow, Field, Check, Sheet, SectionTitle, EmptyState });
