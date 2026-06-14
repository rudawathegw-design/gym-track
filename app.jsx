// app.jsx — main application
const { useState, useEffect, useMemo, useRef } = React;

// ---------- helpers ----------
const todayDate = () => new Date(); // real "today"
const dayKey = (d) => DAYS[d.getDay()];
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const fmtDateLong = (ts) => new Date(ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const round = (n) => Math.round(n);
const kgfmt = (n) => (Math.round(n * 10) / 10).toString();

function mondayOf(d) {
  const x = new Date(d); const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0); return x;
}

// starter sets for a brand-new exercise entry
function defaultSets(ex) {
  if (ex.track === 'cardio') return [{ reps: 20, kg: 0, done: false }];          // 1 × 20 min
  const reps = ex.track === 'time' ? 30 : 8;                                      // 30s holds, else 8 reps
  return Array.from({ length: 3 }, () => ({ reps, kg: 0, done: false }));
}

function useStore() {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem('gymtrack_v1'); if (raw) return JSON.parse(raw); } catch (e) {}
    return defaultState();
  });
  useEffect(() => {
    try { localStorage.setItem('gymtrack_v1', JSON.stringify(state)); } catch (e) {}
    // push to GitHub if the cloud sync is active (see auth-cloud.jsx)
    if (typeof window.__cloudSave === 'function') window.__cloudSave(state);
  }, [state]);
  return [state, setState];
}

function useDraft() {
  const [draft, setDraft] = useState(() => {
    try { const raw = localStorage.getItem('gymtrack_draft'); if (raw) return JSON.parse(raw); } catch (e) {}
    return null;
  });
  useEffect(() => {
    try {
      if (draft) localStorage.setItem('gymtrack_draft', JSON.stringify(draft));
      else localStorage.removeItem('gymtrack_draft');
    } catch (e) {}
  }, [draft]);
  return [draft, setDraft];
}

function lastEntryFor(history, exId) {
  const sorted = history.slice().sort((a, b) => b.date - a.date);
  for (const s of sorted) {
    const e = (s.entries || []).find((x) => x.exerciseId === exId);
    if (e) return e;
  }
  return null;
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '200,255,0';
}

// ============================================================ ROOT
function App() {
  const [store, setStore] = useStore();
  const [draft, setDraft] = useDraft();
  const [tab, setTab] = useState('today');
  const [detailEx, setDetailEx] = useState(null);   // exercise object for detail sheet
  const [pickerDay, setPickerDay] = useState(null);  // weekday key to edit plan, or 'today'
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [finishConfirm, setFinishConfirm] = useState(false);
  const [tw, setTweak] = useTweaks({ accent: '#c8ff00' });
  const accent = tw.accent || '#c8ff00';
  window.__accent = accent;

  const today = todayDate();
  const tKey = dayKey(today);
  const lang = (store.settings && store.settings.lang) || 'en';
  window.__lang = lang;
  const rtl = lang === 'ku';
  const toggleLang = () => setStore({ ...store, settings: { ...store.settings, lang: lang === 'ku' ? 'en' : 'ku' } });

  // ensure draft matches today
  useEffect(() => {
    if (draft && draft.date !== ymd(today)) setDraft(null);
  }, []); // eslint-disable-line

  const startDraft = (exIds) => {
    const entries = {};
    exIds.forEach((id) => {
      const last = lastEntryFor(store.history, id);
      const ex = byId(id);
      if (last) entries[id] = last.sets.map((s) => ({ reps: s.reps, kg: s.kg, done: false }));
      else entries[id] = defaultSets(ex);
    });
    setDraft({ date: ymd(today), weekday: tKey, entries, order: exIds.slice(), note: '' });
  };

  const ensureDraft = () => {
    if (draft) return draft;
    const ids = store.plan[tKey] || [];
    startDraft(ids);
    return null;
  };

  const finishWorkout = () => {
    if (!draft) return;
    const pr0 = {};
    draft.order.forEach((id) => { pr0[id] = prFor(store.history, id); });
    const entries = draft.order
      .map((id) => ({ exerciseId: id, sets: (draft.entries[id] || []).filter((s) => s.reps > 0).map((s) => ({ reps: s.reps, kg: s.kg, done: true })) }))
      .filter((e) => e.sets.length > 0);
    if (!entries.length) { setDraft(null); return; }
    const session = { id: 's_' + Date.now(), date: Date.now(), weekday: tKey, entries, note: draft.note || '' };
    // detect PRs
    const prs = [];
    entries.forEach((e) => {
      const bs = bestSet(e.sets); if (!bs) return;
      const prev = pr0[e.exerciseId];
      const ex = byId(e.exerciseId);
      if (!prev || bs.e1rm > prev.maxE1rm + 0.01) {
        prs.push({ ex, kg: bs.kg, reps: bs.reps, e1rm: bs.e1rm, first: !prev });
      }
    });
    const vol = sessionVolume(session);
    const totalSets = entries.reduce((t, e) => t + e.sets.length, 0);
    // One session per calendar day: if today already has a session, merge into
    // it (replace matching exercises, append new ones) so saving again doesn't
    // create a duplicate that doubles reports/progress.
    const todayYmd = ymd(today);
    const existingIdx = store.history.findIndex((s) => ymd(new Date(s.date)) === todayYmd);
    let history;
    if (existingIdx >= 0) {
      const prevSession = store.history[existingIdx];
      const mergedEntries = prevSession.entries.slice();
      entries.forEach((ne) => {
        const i = mergedEntries.findIndex((e) => e.exerciseId === ne.exerciseId);
        if (i >= 0) mergedEntries[i] = ne; else mergedEntries.push(ne);
      });
      history = store.history.slice();
      history[existingIdx] = { ...prevSession, weekday: tKey, entries: mergedEntries, note: draft.note || prevSession.note || '' };
    } else {
      history = [...store.history, session];
    }
    setStore({ ...store, history });
    setDraft(null);
    setSummary({ vol, prs, totalSets, exCount: entries.length });
  };

  const updateSet = (exId, idx, set) => {
    const d = draft || { date: ymd(today), weekday: tKey, entries: {}, order: store.plan[tKey] || [], note: '' };
    const entries = { ...d.entries };
    const arr = (entries[exId] || []).slice(); arr[idx] = set; entries[exId] = arr;
    setDraft({ ...d, entries });
  };
  const addSet = (exId) => {
    const d = draft; if (!d) return;
    const arr = (d.entries[exId] || []).slice();
    const last = arr[arr.length - 1] || { reps: 8, kg: 0 };
    arr.push({ reps: last.reps, kg: last.kg, done: false });
    setDraft({ ...d, entries: { ...d.entries, [exId]: arr } });
  };
  const removeSet = (exId, idx) => {
    const d = draft; if (!d) return;
    const arr = (d.entries[exId] || []).slice(); arr.splice(idx, 1);
    setDraft({ ...d, entries: { ...d.entries, [exId]: arr } });
  };
  // toggle ALL sets of an exercise done/undone (the per-exercise check)
  const toggleExDone = (exId) => {
    const d = draft; if (!d) return;
    const arr = d.entries[exId] || [];
    const makeDone = !(arr.length > 0 && arr.every((s) => s.done));
    setDraft({ ...d, entries: { ...d.entries, [exId]: arr.map((s) => ({ ...s, done: makeDone })) } });
  };
  const addExerciseToDraft = (exId) => {
    const d = draft || { date: ymd(today), weekday: tKey, entries: {}, order: [], note: '' };
    if (d.order.includes(exId)) return;
    const ex = byId(exId);
    const last = lastEntryFor(store.history, exId);
    const sets = last ? last.sets.map((s) => ({ reps: s.reps, kg: s.kg, done: false })) : defaultSets(ex);
    setDraft({ ...d, entries: { ...d.entries, [exId]: sets }, order: [...d.order, exId] });
  };
  const removeExerciseFromDraft = (exId) => {
    const d = draft; if (!d) return;
    const entries = { ...d.entries }; delete entries[exId];
    setDraft({ ...d, entries, order: d.order.filter((x) => x !== exId) });
  };

  // plan editing
  const togglePlan = (weekday, exId) => {
    const arr = store.plan[weekday] || [];
    const next = arr.includes(exId) ? arr.filter((x) => x !== exId) : [...arr, exId];
    setStore({ ...store, plan: { ...store.plan, [weekday]: next } });
  };

  return (
    <div className="app" dir={rtl ? 'rtl' : 'ltr'} data-lang={lang} style={{ '--lime': accent, '--lime-d': accent, '--lime-rgb': hexToRgb(accent) }}>
      <Header today={today} lang={lang} onToggleLang={toggleLang} onSettings={() => setSettingsOpen(true)} tab={tab} />
      <main className="screen">
        {tab === 'today' && (
          <TodayView
            store={store} draft={draft} tKey={tKey} today={today}
            onStart={() => startDraft(store.plan[tKey] || [])}
            updateSet={updateSet} addSet={addSet} removeSet={removeSet}
            onFinish={() => setFinishConfirm(true)} onAddExercise={() => setPickerDay('today')}
            onRemoveExercise={removeExerciseFromDraft} onToggleExDone={toggleExDone} openDetail={setDetailEx}
            setNote={(n) => setDraft({ ...draft, note: n })}
          />
        )}
        {tab === 'week' && (
          <WeekView store={store} tKey={tKey} onEditDay={setPickerDay} openDetail={setDetailEx} />
        )}
        {tab === 'progress' && <ProgressView store={store} />}
        {tab === 'library' && <LibraryView openDetail={setDetailEx} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} hasDraft={!!draft && Object.keys(draft.entries).length > 0} />

      {/* exercise detail */}
      <Sheet open={!!detailEx} onClose={() => setDetailEx(null)}>
        {detailEx && (
          <ExerciseDetail
            ex={detailEx} store={store}
            onAddToday={() => { addExerciseToDraft(detailEx.id); setDetailEx(null); setTab('today'); }}
            onAddToDay={(wd) => { togglePlan(wd, detailEx.id); }}
          />
        )}
      </Sheet>

      {/* day plan picker */}
      <Sheet open={!!pickerDay} onClose={() => setPickerDay(null)} title={pickerDay === 'today' ? t('add_to_today_title') : pickerDay ? t('edit_day_title', { day: tdayFull(pickerDay) }) : ''}>
        {pickerDay && (
          <PlanPicker
            store={store} day={pickerDay}
            inDraft={draft ? draft.order : []}
            onToggle={(exId) => {
              if (pickerDay === 'today') addExerciseToDraft(exId);
              else togglePlan(pickerDay, exId);
            }}
          />
        )}
      </Sheet>

      {/* settings */}
      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title={t('settings_title')}>
        <SettingsPanel store={store} setStore={setStore} setDraft={setDraft} onClose={() => setSettingsOpen(false)} />
      </Sheet>

      {/* finish confirmation: complete or add more */}
      <Sheet open={finishConfirm} onClose={() => setFinishConfirm(false)} title={lang === 'ku' ? 'مەشقەکەت تەواوە؟' : 'Finish workout?'}>
        <div style={{ padding: '4px 2px 8px' }}>
          <p style={{ fontSize: 13.5, color: 'var(--dim)', lineHeight: 1.55, marginBottom: 16 }}>
            {lang === 'ku'
              ? 'هەموو مەشقەکانت کرا. تەواوی بکە و پاشەکەوتی بکە، یان مەشقی زیاتر زیاد بکە.'
              : 'All exercises are checked off. Save your workout, or add more exercises first.'}
          </p>
          <button className="btn btn--primary btn--xl" onClick={() => { setFinishConfirm(false); finishWorkout(); }}>
            <IconCheck /> {lang === 'ku' ? 'تەواو و پاشەکەوت' : 'Finish & Save'}
          </button>
          <button className="btn btn--ghost" style={{ marginTop: 10 }} onClick={() => { setFinishConfirm(false); setPickerDay('today'); }}>
            {lang === 'ku' ? 'مەشقی زیاتر زیاد بکە' : 'Add more exercises'}
          </button>
        </div>
      </Sheet>

      {/* finish summary */}
      <Sheet open={!!summary} onClose={() => setSummary(null)}>
        {summary && <FinishSummary summary={summary} onClose={() => setSummary(null)} />}
      </Sheet>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor label="Accent color" value={tw.accent}
          options={['#c8ff00', '#2ee6ff', '#ff7a1a', '#ff4d8d', '#28e08a']}
          onChange={(v) => setTweak('accent', v)} />
      </TweaksPanel>
    </div>
  );
}

// ============================================================ HEADER
function Header({ today, lang, onToggleLang, onSettings }) {
  return (
    <header className="appbar">
      <div className="appbar__brand">
        <span className="logo"><LogoMark /></span>
        <div>
          <div className="appbar__title">IRONLOG</div>
          <div className="appbar__date">{fmtDateLong(today.getTime())}</div>
        </div>
      </div>
      <div className="appbar__actions">
      <button className="langbtn" onClick={onToggleLang} aria-label="Language">{lang === 'ku' ? 'EN' : 'کوردی'}</button>
      <button className="iconbtn" onClick={onSettings} aria-label="Settings">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
      </button>
      </div>
    </header>
  );
}
function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round">
      <path d="M3 12h2M19 12h2M7 9v6M17 9v6M9 12h6" /><rect x="7" y="9" width="2" height="6" rx="1" fill="#0a0a0a" stroke="none" /><rect x="15" y="9" width="2" height="6" rx="1" fill="#0a0a0a" stroke="none" />
    </svg>
  );
}

// ============================================================ BOTTOM NAV
function BottomNav({ tab, setTab, hasDraft }) {
  const items = [
    { id: 'today', label: t('nav_today'), icon: IconDumbbell },
    { id: 'week', label: t('nav_week'), icon: IconCalendar },
    { id: 'progress', label: t('nav_progress'), icon: IconChart },
    { id: 'library', label: t('nav_library'), icon: IconGrid },
  ];
  return (
    <nav className="botnav">
      {items.map((it) => {
        const I = it.icon;
        return (
          <button key={it.id} className={'botnav__item' + (tab === it.id ? ' is-active' : '')} onClick={() => setTab(it.id)}>
            <span className="botnav__ic"><I />{it.id === 'today' && hasDraft && <span className="botnav__dot" />}</span>
            <span className="botnav__lbl">{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
const IconDumbbell = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.5 6.5l11 11M4 9l2-2M9 4l-2 2M20 15l-2 2M15 20l2-2M2.5 11.5l1-1M11.5 2.5l1 1M21.5 12.5l-1 1M12.5 21.5l-1-1" /></svg>;
const IconCalendar = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>;
const IconChart = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M7 14l3-3 3 3 5-6" /></svg>;
const IconGrid = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;

window.App = App;
window._appHelpers = { lastEntryFor, mondayOf, fmtDate, fmtDateLong, ymd, dayKey, todayDate, kgfmt, round };
