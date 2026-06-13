// views.jsx — Today / Week / Progress / Library + detail, picker, settings, summary
const H = window._appHelpers;
const ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function topSetText(entry) {
  if (!entry) return null;
  const bs = bestSet(entry.sets);
  if (!bs) return null;
  const ex = byId(entry.exerciseId);
  if (ex && ex.track === 'time') return t('hold_fmt', { n: bs.reps });
  if (!bs.kg) return t('bw_fmt', { a: entry.sets.length, b: bs.reps });
  return t('wt_fmt', { a: entry.sets.length, b: bs.reps, kg: H.kgfmt(bs.kg) });
}

// ===================================================== TODAY
function TodayView({ store, draft, tKey, today, onStart, updateSet, addSet, removeSet, onFinish, onAddExercise, onRemoveExercise, openDetail, setNote }) {
  const planned = store.plan[tKey] || [];
  const active = draft && draft.order && draft.order.length > 0;

  if (!active) {
    const lastSession = store.history.slice().sort((a, b) => b.date - a.date).find((s) => s.weekday === tKey);
    return (
      <div className="pad">
        <div className="hero">
          <div className="hero__eyebrow">{tdayFull(tKey)} · {planned.length ? t('ready_to_train') : t('rest_day_eyebrow')}</div>
          {planned.length ? (
            <>
              <h1 className="hero__title">{t('todays_workout')}</h1>
              <div className="hero__meta">{t('n_exercises', { n: planned.length })} · {[...new Set(planned.map((id) => tg(byId(id).group)))].join(' · ')}</div>
              <div className="planlist">
                {planned.map((id) => {
                  const ex = byId(id);
                  return (
                    <button key={id} className="planlist__row" onClick={() => openDetail(ex)}>
                      <ExerciseAvatar ex={ex} size={48} />
                      <div className="planlist__info">
                        <div className="planlist__name">{exName(ex)}</div>
                        <div className="planlist__sub">{muscleText(ex)}</div>
                      </div>
                      <span className="planlist__eq"><EquipmentIcon type={ex.equipment} size={18} color="#7a7a7a" /></span>
                    </button>
                  );
                })}
              </div>
              <button className="btn btn--primary btn--xl" onClick={onStart}><IconBolt /> {t('start_workout')}</button>
              <button className="btn btn--ghost" onClick={onAddExercise} style={{ marginTop: 10 }}>{t('add_an_exercise')}</button>
            </>
          ) : (
            <>
              <h1 className="hero__title">{t('start_workout')}</h1>
              <div className="hero__meta">{((store.settings && store.settings.lang) === 'ku') ? 'هیچ مەشقێک نییە. مەشقێک زیاد بکە بۆ دەستپێکردن.' : 'Nothing here yet. Add an exercise to begin.'}</div>
              <button className="btn btn--primary btn--xl" onClick={onAddExercise}><IconBolt /> {t('add_an_exercise')}</button>
            </>
          )}
        </div>
        {lastSession && (
          <div className="lastcard">
            <div className="lastcard__head">{t('last_day', { day: tdayFull(tKey), date: H.fmtDate(lastSession.date) })}</div>
            <div className="lastcard__stats">
              <span><b>{H.round(sessionVolume(lastSession))}</b> {t('kg_volume')}</span>
              <span><b>{lastSession.entries.reduce((u, e) => u + e.sets.length, 0)}</b> {t('sets')}</span>
              <span><b>{lastSession.entries.length}</b> {t('lifts')}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  let doneSets = 0, totalSets = 0, vol = 0;
  draft.order.forEach((id) => (draft.entries[id] || []).forEach((s) => { totalSets++; if (s.done) { doneSets++; vol += (s.reps || 0) * (s.kg || 0); } }));

  return (
    <div className="pad pad--workout">
      <div className="wk-head">
        <div>
          <div className="wk-head__title">{t('in_progress')}</div>
          <div className="wk-head__sub">{tdayFull(tKey)}</div>
        </div>
        <div className="wk-head__stats">
          <div><b>{doneSets}/{totalSets}</b><span>{t('sets')}</span></div>
          <div><b>{H.round(vol)}</b><span>{t('kg_vol')}</span></div>
        </div>
      </div>
      <div className="wk-progress"><div className="wk-progress__bar" style={{ width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%` }} /></div>

      {draft.order.map((id) => {
        const ex = byId(id);
        const prev = H.lastEntryFor(store.history, id);
        const pr = prFor(store.history, id);
        return (
          <ExerciseLogCard key={id} ex={ex} sets={draft.entries[id] || []} prevEntry={prev} pr={pr}
            onSet={(i, s) => updateSet(id, i, s)} onAdd={() => addSet(id)}
            onRemoveSet={(i) => removeSet(id, i)} onRemoveEx={() => onRemoveExercise(id)}
            openDetail={() => openDetail(ex)} />
        );
      })}

      <button className="btn btn--ghost btn--dashed" onClick={onAddExercise}>{t('add_exercise')}</button>

      <label className="notefield">
        <textarea placeholder={t('workout_notes')} value={draft.note || ''} onChange={(e) => setNote(e.target.value)} rows={2} />
      </label>

      <div className="finishbar">
        <div className="finishbar__info"><b>{H.round(vol)}kg</b> · {doneSets}/{totalSets} {t('sets')}</div>
        <button className="btn btn--primary" onClick={onFinish}><IconCheck /> {t('finish_save')}</button>
      </div>
    </div>
  );
}

function ExerciseLogCard({ ex, sets, prevEntry, pr, onSet, onAdd, onRemoveSet, onRemoveEx, openDetail }) {
  const isTime = ex.track === 'time';
  return (
    <div className="logcard">
      <div className="logcard__head">
        <button className="logcard__id" onClick={openDetail}>
          <ExerciseAvatar ex={ex} size={46} />
          <div>
            <div className="logcard__name">{exName(ex)}</div>
            <div className="logcard__sub">{topSetText(prevEntry) ? `${t('last_prefix')} ${topSetText(prevEntry)}` : muscleText(ex)}</div>
          </div>
        </button>
        <button className="logcard__del" onClick={onRemoveEx} aria-label="Remove">×</button>
      </div>
      <div className="logcard__cols">
        <span>{t('col_set')}</span><span>{isTime ? t('col_time') : t('col_repskg')}</span><span></span>
      </div>
      {sets.map((s, i) => {
        const e1 = epley(s.kg || 0, s.reps || 0);
        const isPR = !isTime && s.reps > 0 && s.kg > 0 && e1 > ((pr && pr.maxE1rm) || 0) + 0.01;
        return (
          <SetRow key={i} idx={i} set={s} track={ex.track} isPR={isPR}
            onChange={(ns) => onSet(i, ns)} onRemove={() => onRemoveSet(i)}
            prevText={prevEntry && prevEntry.sets[i] ? (isTime ? `${prevEntry.sets[i].reps}s` : `${prevEntry.sets[i].reps}×${H.kgfmt(prevEntry.sets[i].kg)}`) : ''} />
        );
      })}
      <button className="addset" onClick={onAdd}>{t('add_set')}</button>
    </div>
  );
}

// ===================================================== WEEK
function WeekView({ store, tKey, onEditDay, openDetail }) {
  const wkStart = H.mondayOf(new Date());
  const doneThisWeek = (wd) => store.history.some((s) => s.weekday === wd && s.date >= wkStart.getTime());
  const trainingDays = ORDER.filter((d) => (store.plan[d] || []).length).length;
  return (
    <div className="pad">
      <SectionTitle>{t('your_week')}</SectionTitle>
      <div className="weekmeta">{t('training_days', { n: trainingDays, r: 7 - trainingDays })}</div>
      <div className="weekgrid">
        {ORDER.map((wd) => {
          const ids = store.plan[wd] || [];
          const groups = [...new Set(ids.map((id) => tg(byId(id).group)))];
          const isToday = wd === tKey;
          const done = doneThisWeek(wd);
          return (
            <div key={wd} className={'daycard' + (isToday ? ' daycard--today' : '') + (ids.length ? '' : ' daycard--rest')}>
              <div className="daycard__l">
                <div className="daycard__day">{tdayShort(wd)}{isToday && <span className="daycard__todaytag">{t('today_tag')}</span>}</div>
                <div className="daycard__groups">{ids.length ? groups.join(' · ') : t('rest_day_eyebrow')}</div>
              </div>
              <div className="daycard__mid">
                {ids.slice(0, 5).map((id) => (
                  <button key={id} className="daychip" onClick={() => openDetail(byId(id))} title={exName(byId(id))}>
                    <EquipmentIcon type={byId(id).equipment} size={13} color="#0a0a0a" />
                  </button>
                ))}
                {ids.length > 5 && <span className="daychip daychip--more">+{ids.length - 5}</span>}
              </div>
              <div className="daycard__r">
                {done && <span className="donecheck" title="Done"><IconCheck small /></span>}
                <button className="editbtn" onClick={() => onEditDay(wd)}>{t('edit')}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================== PROGRESS
function ProgressView({ store }) {
  const trained = useMemo(() => {
    const ids = new Set();
    store.history.forEach((s) => s.entries.forEach((e) => ids.add(e.exerciseId)));
    return EXERCISES.filter((e) => ids.has(e.id));
  }, [store.history]);
  const [sel, setSel] = useState(trained[0] ? trained[0].id : null);
  const [metric, setMetric] = useState('e1rm');

  const wkStart = H.mondayOf(new Date()).getTime();
  const lastWkStart = wkStart - 7 * 864e5;
  const thisWeek = store.history.filter((s) => s.date >= wkStart);
  const lastWeek = store.history.filter((s) => s.date >= lastWkStart && s.date < wkStart);
  const volThis = thisWeek.reduce((tt, s) => tt + sessionVolume(s), 0);
  const volLast = lastWeek.reduce((tt, s) => tt + sessionVolume(s), 0);
  const delta = volLast ? Math.round(((volThis - volLast) / volLast) * 100) : 0;

  const weekly = [];
  for (let i = 5; i >= 0; i--) {
    const start = wkStart - i * 7 * 864e5; const end = start + 7 * 864e5;
    const v = store.history.filter((s) => s.date >= start && s.date < end).reduce((tt, s) => tt + sessionVolume(s), 0);
    weekly.push({ label: H.fmtDate(start), value: Math.round(v) });
  }

  const prs = useMemo(() => {
    const out = [];
    trained.forEach((ex) => {
      let run = 0;
      exerciseSeries(store.history, ex.id).forEach((p) => {
        if (p.e1rm > run + 0.01) { out.push({ ex, date: p.date, kg: p.topKg, reps: p.topReps, e1rm: p.e1rm }); run = p.e1rm; }
      });
    });
    return out.sort((a, b) => b.date - a.date).slice(0, 6);
  }, [store.history, trained]);

  const series = sel ? exerciseSeries(store.history, sel) : [];
  const selEx = sel ? byId(sel) : null;
  const selPR = sel ? prFor(store.history, sel) : null;
  const chartData = series.map((p) => ({ value: Math.round(metric === 'volume' ? p.volume : metric === 'topKg' ? p.topKg : p.e1rm) }));

  return (
    <div className="pad">
      <SectionTitle>{t('this_week')}</SectionTitle>
      <div className="statgrid">
        <StatTile label={t('workouts')} value={thisWeek.length} sub={t('logged')} accent />
        <StatTile label={t('volume')} value={H.round(volThis).toLocaleString()} unit="kg" sub={volLast ? `${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)}% ${t('vs_last')}` : t('first_week')} />
        <StatTile label={t('sets')} value={thisWeek.reduce((tt, s) => tt + s.entries.reduce((u, e) => u + e.sets.length, 0), 0)} sub={t('completed')} />
        <StatTile label={t('prs')} value={prs.filter((p) => p.date >= wkStart).length} sub={t('this_week_l')} accent />
      </div>

      <SectionTitle>{t('weekly_volume')}</SectionTitle>
      <div className="panel"><BarChart data={weekly} format={(v) => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v} /></div>

      <SectionTitle>{t('exercise_progress')}</SectionTitle>
      {selEx ? (
        <div className="panel">
          <div className="exsel">
            {trained.map((ex) => (
              <Chip key={ex.id} active={sel === ex.id} onClick={() => setSel(ex.id)}>{exName(ex)}</Chip>
            ))}
          </div>
          <div className="exsel__head">
            <div>
              <div className="exsel__name">{exName(selEx)}</div>
              <div className="exsel__pr">{t('best_c')}: {H.kgfmt(selPR.maxKg)}kg · {t('e1rm')} {H.round(selPR.maxE1rm)}kg</div>
            </div>
            <div className="metricsel">
              {[['e1rm', t('m_e1rm')], ['topKg', t('m_top')], ['volume', t('m_vol')]].map(([k, l]) => (
                <button key={k} className={'metricsel__b' + (metric === k ? ' on' : '')} onClick={() => setMetric(k)}>{l}</button>
              ))}
            </div>
          </div>
          <LineChart data={chartData} label={sel + metric} format={(v) => v} />
          <div className="exsel__foot">{t('sessions_tracked', { n: series.length })}</div>
        </div>
      ) : (
        <EmptyState icon={<IconChart />} title={t('no_data')} sub={t('no_data_sub')} />
      )}

      <SectionTitle>{t('recent_prs')}</SectionTitle>
      <div className="prlist">
        {prs.length ? prs.map((p, i) => (
          <div key={i} className="prrow">
            <span className="prrow__badge"><IconTrophy /></span>
            <div className="prrow__info">
              <div className="prrow__name">{exName(p.ex)}</div>
              <div className="prrow__sub">{p.kg ? `${H.kgfmt(p.kg)}kg × ${p.reps}` : `${p.reps} ${t('reps')}`} · {t('e1rm')} {H.round(p.e1rm)}kg</div>
            </div>
            <span className="prrow__date">{H.fmtDate(p.date)}</span>
          </div>
        )) : <EmptyState icon={<IconTrophy />} title={t('no_prs')} sub={t('no_prs_sub')} />}
      </div>
    </div>
  );
}

// ===================================================== LIBRARY
function LibraryView({ openDetail }) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('All');
  const list = EXERCISES.filter((e) => (group === 'All' || e.group === group) && (e.name.toLowerCase().includes(q.toLowerCase()) || (e.name_ku || '').includes(q)));
  return (
    <div className="pad">
      <SectionTitle>{t('exercise_library')}</SectionTitle>
      <div className="search">
        <IconSearch />
        <input placeholder={t('search_ex')} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="grouptabs">
        <Chip active={group === 'All'} onClick={() => setGroup('All')}>{t('all')}</Chip>
        {GROUPS.map((g) => <Chip key={g} active={group === g} onClick={() => setGroup(g)}>{tg(g)}</Chip>)}
      </div>
      <div className="exlist">
        {list.map((ex) => (
          <button key={ex.id} className="exrow" onClick={() => openDetail(ex)}>
            <ExerciseAvatar ex={ex} size={52} />
            <div className="exrow__info">
              <div className="exrow__name">{exName(ex)}</div>
              <div className="exrow__sub">{muscleText(ex)}</div>
            </div>
            <span className="exrow__eq"><EquipmentIcon type={ex.equipment} size={18} color="#7a7a7a" /></span>
            <IconChevron />
          </button>
        ))}
        {!list.length && <EmptyState icon={<IconSearch />} title={t('no_matches')} sub={t('no_matches_sub')} />}
      </div>
    </div>
  );
}

// ===================================================== EXERCISE DETAIL
function ExerciseDetail({ ex, store, onAddToday, onAddToDay }) {
  const pr = prFor(store.history, ex.id);
  const series = exerciseSeries(store.history, ex.id).map((p) => p.e1rm);
  return (
    <div className="detail">
      <div className="detail__map">
        <MuscleMap primary={ex.primary} secondary={ex.secondary} view="both" height={180} />
        <div className="detail__eqbadge"><EquipmentIcon type={ex.equipment} size={16} color="#0a0a0a" /> {teq(ex.equipment)}</div>
      </div>
      <h2 className="detail__name">{exName(ex)}</h2>
      <div className="detail__muscles">
        {ex.primary.map((m) => <span key={m} className="mtag mtag--p">{tm(m)}</span>)}
        {ex.secondary.map((m) => <span key={m} className="mtag">{tm(m)}</span>)}
      </div>
      <p className="detail__tip"><IconBulb /> {exTip(ex)}</p>

      {pr && (
        <div className="detail__prrow">
          <div><span className="detail__prlbl">{t('best_weight')}</span><span className="detail__prval">{H.kgfmt(pr.maxKg)}<i>kg</i></span></div>
          <div><span className="detail__prlbl">{t('est_1rm')}</span><span className="detail__prval">{H.round(pr.maxE1rm)}<i>kg</i></span></div>
          <div className="detail__prspark"><Sparkline data={series} width={80} height={34} /></div>
        </div>
      )}

      <button className="btn btn--primary btn--xl" onClick={onAddToday}><IconBolt /> {t('add_today_btn')}</button>
      <div className="detail__dayadd">
        <div className="detail__dayadd-lbl">{t('add_to_day')}</div>
        <div className="detail__days">
          {ORDER.map((wd) => {
            const inDay = (store.plan[wd] || []).includes(ex.id);
            return <button key={wd} className={'daytoggle' + (inDay ? ' on' : '')} onClick={() => onAddToDay(wd)}>{tdayShort(wd)}</button>;
          })}
        </div>
      </div>
    </div>
  );
}

// ===================================================== PLAN PICKER
function PlanPicker({ store, day, inDraft, onToggle }) {
  const [q, setQ] = useState('');
  const current = day === 'today' ? inDraft : (store.plan[day] || []);
  const groups = GROUPS.map((g) => ({ g, items: EXERCISES.filter((e) => e.group === g && (e.name.toLowerCase().includes(q.toLowerCase()) || (e.name_ku || '').includes(q))) })).filter((x) => x.items.length);
  return (
    <div className="picker">
      <div className="search">
        <IconSearch />
        <input placeholder={t('search_add')} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {groups.map(({ g, items }) => (
        <div key={g} className="picker__group">
          <div className="picker__glabel">{tg(g)}</div>
          {items.map((ex) => {
            const on = current.includes(ex.id);
            return (
              <button key={ex.id} className={'pickrow' + (on ? ' pickrow--on' : '')} onClick={() => onToggle(ex.id)}>
                <ExerciseAvatar ex={ex} size={42} />
                <div className="pickrow__info">
                  <div className="pickrow__name">{exName(ex)}</div>
                  <div className="pickrow__sub">{muscleText(ex)}</div>
                </div>
                <span className={'pickrow__check' + (on ? ' on' : '')}>{on ? <IconCheck small /> : '+'}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ===================================================== SETTINGS
function SettingsPanel({ store, setStore, setDraft, onClose }) {
  const fileRef = useRef(null);
  const lang = store.settings.lang || 'en';
  const exportData = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ironlog-backup-${H.ymd(new Date())}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const importData = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { const data = JSON.parse(r.result); if (data && data.plan && data.history) { setStore(data); onClose(); } else alert(t('invalid_backup')); } catch (err) { alert(t('read_fail')); } };
    r.readAsText(f);
  };
  return (
    <div className="settings">
      <div className="setrow2">
        <div><div className="setrow2__t">{t('language')}</div></div>
        <div className="langtoggle">
          <button className={'langtoggle__b' + (lang === 'en' ? ' on' : '')} onClick={() => setStore({ ...store, settings: { ...store.settings, lang: 'en' } })}>English</button>
          <button className={'langtoggle__b' + (lang === 'ku' ? ' on' : '')} onClick={() => setStore({ ...store, settings: { ...store.settings, lang: 'ku' } })}>کوردی</button>
        </div>
      </div>

      <div className="setrow2">
        <div><div className="setrow2__t">{t('body_weight')}</div><div className="setrow2__s">{t('body_weight_sub')}</div></div>
        <NumberStepper value={store.settings.bodyweight} step={1} suffix="kg" onChange={(v) => setStore({ ...store, settings: { ...store.settings, bodyweight: v } })} />
      </div>

      <div className="card-note">
        <div className="card-note__t"><IconCloud /> {t('saving_sync')}</div>
        <p dangerouslySetInnerHTML={{ __html: t('saving_p1') }} />
        <p dangerouslySetInnerHTML={{ __html: t('saving_p2') }} />
      </div>

      <div className="btnrow">
        <button className="btn btn--primary" onClick={exportData}><IconDownload /> {t('export_backup')}</button>
        <button className="btn btn--outline" onClick={() => fileRef.current.click()}><IconUpload /> {t('import_btn')}</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={importData} />
      </div>

      <div className="dangerzone">
        {window.GT_CONFIG && window.__userEmail && window.__userEmail === window.GT_CONFIG.adminEmail && (
          <a className="btn btn--ghost" href="admin.html" style={{ textDecoration: 'none' }}>{lang === 'ku' ? 'داشبۆردی بەڕێوەبەر' : 'Admin dashboard'}</a>
        )}
        {typeof window.__signOut === 'function' && (
          <button className="btn btn--outline" onClick={() => { if (confirm(lang === 'ku' ? 'دەرچوون؟ داتاکانت لەسەر GitHub دەمێننەوە.' : 'Sign out? Your data stays saved on GitHub.')) window.__signOut(); }}>{lang === 'ku' ? 'دەرچوون' : 'Sign out'}</button>
        )}
      </div>
      <div className="settings__foot">{t('sample_footer')}</div>
    </div>
  );
}

// ===================================================== FINISH SUMMARY
function FinishSummary({ summary, onClose }) {
  return (
    <div className="summary">
      <div className="summary__burst"><IconCheckBig /></div>
      <h2 className="summary__title">{t('workout_saved')}</h2>
      <div className="summary__stats">
        <div><b>{H.round(summary.vol).toLocaleString()}</b><span>{t('kg_volume')}</span></div>
        <div><b>{summary.totalSets}</b><span>{t('sets')}</span></div>
        <div><b>{summary.exCount}</b><span>{t('exercises_word')}</span></div>
      </div>
      {summary.prs.length > 0 && (
        <div className="summary__prs">
          <div className="summary__prtitle"><IconTrophy /> {summary.prs.length === 1 ? t('new_pr_one') : t('new_pr_many', { n: summary.prs.length })}</div>
          {summary.prs.map((p, i) => (
            <div key={i} className="summary__prrow">
              <span>{exName(p.ex)}</span>
              <b>{p.kg ? `${H.kgfmt(p.kg)}kg × ${p.reps}` : `${p.reps} ${t('reps')}`}</b>
            </div>
          ))}
        </div>
      )}
      <p className="summary__msg">{t('logged_history')}</p>
      <button className="btn btn--primary btn--xl" onClick={onClose}>{t('done')}</button>
    </div>
  );
}

// ===================================================== small icons
const IconBolt = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></svg>;
const IconCheck = ({ small }) => <svg width={small ? 13 : 18} height={small ? 13 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>;
const IconCheckBig = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>;
const IconTrophy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12v3a6 6 0 01-12 0zM6 5H3v2a3 3 0 003 3M18 5h3v2a3 3 0 01-3 3M9 18h6M10 14v4M14 14v4M8 21h8" /></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>;
const IconChevron = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron"><path d="M9 6l6 6-6 6" /></svg>;
const IconBulb = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0012 2z" /></svg>;
const IconCloud = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 000-9 6 6 0 00-11.6 1.5A4 4 0 006 19z" /></svg>;
const IconDownload = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 11l5 5 5-5M5 21h14" /></svg>;
const IconUpload = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V9M7 13l5-5 5 5M5 3h14" /></svg>;

Object.assign(window, { TodayView, WeekView, ProgressView, LibraryView, ExerciseDetail, PlanPicker, SettingsPanel, FinishSummary });
