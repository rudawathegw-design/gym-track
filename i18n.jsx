// i18n.jsx — English + Kurdish Sorani. Exported to window.
// Current language read from window.__lang ('en' | 'ku'), set by App on render.

const UI = {
  en: {
    nav_today: 'Today', nav_week: 'Week', nav_progress: 'Progress', nav_library: 'Library',
    ready_to_train: 'Ready to train', rest_day_eyebrow: 'Rest day',
    todays_workout: "Today's Workout", rest_day_title: 'Rest Day',
    n_exercises: '{n} exercises',
    start_workout: 'Start Workout', add_an_exercise: '+ Add an exercise',
    start_a_workout: 'Start a Workout',
    rest_day_desc: 'Nothing planned for {day}. Recover — or train anyway.',
    last_day: 'Last {day} · {date}',
    kg_volume: 'kg volume', sets: 'sets', lifts: 'lifts',
    in_progress: 'In progress', kg_vol: 'kg vol',
    add_set: '+ Add set', add_exercise: '+ Add exercise',
    workout_notes: 'Workout notes (how did it feel?)', finish_save: 'Finish & Save',
    your_week: 'Your Week', training_days: '{n} training days · {r} rest',
    edit: 'Edit', today_tag: 'TODAY',
    this_week: 'This Week', workouts: 'Workouts', logged: 'logged',
    volume: 'Volume', vs_last: 'vs last wk', first_week: 'first week',
    completed: 'completed', prs: 'PRs', this_week_l: 'this week',
    weekly_volume: 'Weekly Volume', exercise_progress: 'Exercise Progress',
    m_e1rm: 'Est 1RM', m_top: 'Top set', m_vol: 'Volume',
    best_c: 'Best', e1rm: 'e1RM',
    sessions_tracked: '{n} sessions tracked · lime dot = peak',
    recent_prs: 'Recent PRs',
    no_data: 'No data yet', no_data_sub: 'Finish a workout to see your progress curves.',
    no_prs: 'No PRs yet', no_prs_sub: 'Beat a previous best to earn one.',
    exercise_library: 'Exercise Library', search_ex: 'Search exercises…', all: 'All',
    no_matches: 'No matches', no_matches_sub: 'Try a different search or group.',
    add_today_btn: '+ Add to today\u2019s workout', add_to_day: 'Add to a day',
    best_weight: 'Best weight', est_1rm: 'Est. 1RM',
    settings_title: 'Settings & Backup', body_weight: 'Body weight', body_weight_sub: 'Used for bodyweight lifts',
    language: 'Language',
    saving_sync: 'Saving & sync',
    saving_p1: 'Your data is saved <b>automatically on this device</b> — close the app and it\u2019s still here, fully private. There\u2019s no account to create.',
    saving_p2: 'True <b>Google login + cloud sync across phones</b> needs a hosted backend, so it isn\u2019t part of this app. Instead, use <b>Backup</b> below to export a file you can keep in a private GitHub repo (or Drive / iCloud) and restore on any device.',
    export_backup: 'Export backup', import_btn: 'Import',
    reset_sample: 'Reset to sample data', clear_history: 'Clear all history',
    confirm_reset: 'Reset to the sample data and default split? This clears your logged workouts.',
    confirm_clear: 'Erase ALL history and start with an empty log? Your weekly split is kept.',
    invalid_backup: 'Not a valid IronLog backup file.', read_fail: 'Could not read that file.',
    workout_saved: 'Workout saved', exercises_word: 'exercises',
    new_pr_one: '1 New PR!', new_pr_many: '{n} New PRs!',
    logged_history: 'Logged to your history. Progress charts updated.', done: 'Done',
    add_to_today_title: 'Add to today', edit_day_title: 'Edit {day}', search_add: 'Search to add…',
    col_set: 'SET', col_repskg: 'REPS × KG', col_time: 'TIME',
    reps: 'reps', kg: 'kg', sec: 'sec',
    last_prefix: 'Last:', bodyweight_word: 'bodyweight', hold_word: 'hold',
    hold_fmt: '{n}s hold', bw_fmt: '{a}×{b} bodyweight', wt_fmt: '{a}×{b} · {kg}kg',
    sample_footer: 'IRONLOG · on-device workout tracker',
  },
  ku: {
    nav_today: 'ئەمڕۆ', nav_week: 'هەفتە', nav_progress: 'پێشکەوتن', nav_library: 'کتێبخانە',
    ready_to_train: 'ئامادەی ڕاهێنان', rest_day_eyebrow: 'ڕۆژی پشوو',
    todays_workout: 'ڕاهێنانی ئەمڕۆ', rest_day_title: 'ڕۆژی پشوو',
    n_exercises: '{n} ڕاهێنان',
    start_workout: 'دەستپێکردنی ڕاهێنان', add_an_exercise: '+ زیادکردنی ڕاهێنان',
    start_a_workout: 'دەستپێکردنی ڕاهێنان',
    rest_day_desc: 'هیچ بۆ {day} دانەنراوە. پشوو بدە — یان هەر ڕاهێنان بکە.',
    last_day: 'دوایین {day} · {date}',
    kg_volume: 'قەبارە (kg)', sets: 'سێت', lifts: 'ڕاهێنان',
    in_progress: 'بەردەوامە', kg_vol: 'قەبارە kg',
    add_set: '+ زیادکردنی سێت', add_exercise: '+ زیادکردنی ڕاهێنان',
    workout_notes: 'تێبینی ڕاهێنان (چۆن بوو؟)', finish_save: 'تەواوکردن و پاشەکەوت',
    your_week: 'هەفتەکەت', training_days: '{n} ڕۆژی ڕاهێنان · {r} پشوو',
    edit: 'دەستکاری', today_tag: 'ئەمڕۆ',
    this_week: 'ئەم هەفتەیە', workouts: 'ڕاهێنانەکان', logged: 'تۆمارکراو',
    volume: 'قەبارە', vs_last: 'بەراورد بە هەفتەی ڕابردوو', first_week: 'یەکەم هەفتە',
    completed: 'تەواوکراو', prs: 'ڕیکۆردەکان', this_week_l: 'ئەم هەفتەیە',
    weekly_volume: 'قەبارەی هەفتانە', exercise_progress: 'پێشکەوتنی ڕاهێنان',
    m_e1rm: 'خەمڵاندنی 1RM', m_top: 'باشترین سێت', m_vol: 'قەبارە',
    best_c: 'باشترین', e1rm: 'خەمڵاو 1RM',
    sessions_tracked: '{n} خولی تۆمارکراو · خاڵە سەوزەکە = لووتکە',
    recent_prs: 'ڕیکۆردە نوێیەکان',
    no_data: 'هێشتا داتا نییە', no_data_sub: 'ڕاهێنانێک تەواو بکە بۆ بینینی هێڵی پێشکەوتن.',
    no_prs: 'هێشتا ڕیکۆرد نییە', no_prs_sub: 'باشترینی پێشووت بشکێنە بۆ بەدەستهێنانی یەکێک.',
    exercise_library: 'کتێبخانەی ڕاهێنان', search_ex: 'گەڕان بۆ ڕاهێنان…', all: 'هەموو',
    no_matches: 'هیچ نەدۆزرایەوە', no_matches_sub: 'گەڕانێکی تر یان گرووپێکی تر تاقیبکەرەوە.',
    add_today_btn: '+ زیادکردن بۆ ڕاهێنانی ئەمڕۆ', add_to_day: 'زیادکردن بۆ ڕۆژێک',
    best_weight: 'قورسترین کێش', est_1rm: 'خەمڵاوی 1RM',
    settings_title: 'ڕێکخستن و پاشەکەوت', body_weight: 'کێشی لەش', body_weight_sub: 'بۆ ڕاهێنانە لەشییەکان',
    language: 'زمان',
    saving_sync: 'پاشەکەوت و هاوکاتکردن',
    saving_p1: 'داتاکانت <b>بەشێوەی خۆکار لەسەر ئەم ئامێرە</b> پاشەکەوت دەکرێن — ئەپەکە دابخە و هێشتا لێرەیە، بەتەواوی تایبەتە. هیچ هەژمارێک پێویست نییە.',
    saving_p2: 'چوونەژوورەوەی <b>گووگڵ + هاوکاتکردنی هەوری لەنێوان مۆبایلەکان</b> پێویستی بە سێرڤەرە، بۆیە بەشێک نییە لەم ئەپە. لەجیاتی ئەوە، <b>پاشەکەوت</b>ی خوارەوە بەکاربهێنە بۆ هەناردەی فایلێک کە دەتوانیت لە ریپۆیەکی تایبەتی GitHub (یان Drive / iCloud) بیپارێزیت و لەسەر هەر ئامێرێک بیگەڕێنیتەوە.',
    export_backup: 'هەناردەی پاشەکەوت', import_btn: 'هاوردە',
    reset_sample: 'گەڕانەوە بۆ داتای نموونە', clear_history: 'سڕینەوەی هەموو مێژوو',
    confirm_reset: 'بگەڕێتەوە بۆ داتای نموونە و خشتەی بنەڕەتی؟ ئەمە ڕاهێنانە تۆمارکراوەکانت دەسڕێتەوە.',
    confirm_clear: 'هەموو مێژوو بسڕێتەوە و بە تۆمارێکی بەتاڵ دەستپێبکات؟ خشتەی هەفتانەکەت دەمێنێتەوە.',
    invalid_backup: 'فایلی پاشەکەوتی دروستی IronLog نییە.', read_fail: 'نەتوانرا ئەو فایلە بخوێنرێتەوە.',
    workout_saved: 'ڕاهێنان پاشەکەوت کرا', exercises_word: 'ڕاهێنان',
    new_pr_one: '١ ڕیکۆردی نوێ!', new_pr_many: '{n} ڕیکۆردی نوێ!',
    logged_history: 'تۆمارکرا لە مێژووەکەت. خشتەی پێشکەوتن نوێکرایەوە.', done: 'تەواو',
    add_to_today_title: 'زیادکردن بۆ ئەمڕۆ', edit_day_title: 'دەستکاری {day}', search_add: 'بگەڕێ بۆ زیادکردن…',
    col_set: 'سێت', col_repskg: 'ژمارە × KG', col_time: 'کات',
    reps: 'ژمارە', kg: 'kg', sec: 'چرکە',
    last_prefix: 'دوایین:', bodyweight_word: 'کێشی لەش', hold_word: 'ڕاگرتن',
    hold_fmt: '{n} چرکە ڕاگرتن', bw_fmt: '{a}×{b} کێشی لەش', wt_fmt: '{a}×{b} · {kg}kg',
    sample_footer: 'IRONLOG · تۆمارکەری ڕاهێنانی سەر ئامێر',
  },
};

const MUS = {
  en: { traps: 'Traps', delts: 'Shoulders', chest: 'Chest', biceps: 'Biceps', forearms: 'Forearms', triceps: 'Triceps', lats: 'Lats', lowerback: 'Lower back', glutes: 'Glutes', hamstrings: 'Hamstrings', calves: 'Calves', abs: 'Abs', obliques: 'Obliques', quads: 'Quads' },
  ku: { traps: 'تراپیز', delts: 'شان', chest: 'سنگ', biceps: 'بایسێپس', forearms: 'پێشقۆڵ', triceps: 'ترایسێپس', lats: 'لاتس', lowerback: 'پشتی خوارەوە', glutes: 'کەپوول', hamstrings: 'پشتی ڕان', calves: 'ساق', abs: 'سک', obliques: 'لای سک', quads: 'پێشی ڕان' },
};

const GRP = {
  en: { Chest: 'Chest', Back: 'Back', Legs: 'Legs', Shoulders: 'Shoulders', Arms: 'Arms', Core: 'Core' },
  ku: { Chest: 'سنگ', Back: 'پشت', Legs: 'قاچ', Shoulders: 'شان', Arms: 'قۆڵ', Core: 'سک' },
};

const EQ = {
  en: { barbell: 'barbell', dumbbell: 'dumbbell', cable: 'cable', machine: 'machine', bodyweight: 'bodyweight' },
  ku: { barbell: 'هالتەر', dumbbell: 'دەمبڵ', cable: 'کێبڵ', machine: 'ئامێر', bodyweight: 'کێشی لەش' },
};

const DAYS_FULL_I = {
  en: { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' },
  ku: { Sun: 'یەکشەممە', Mon: 'دووشەممە', Tue: 'سێشەممە', Wed: 'چوارشەممە', Thu: 'پێنجشەممە', Fri: 'هەینی', Sat: 'شەممە' },
};
const DAYS_SHORT_I = {
  en: { Sun: 'Sun', Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat' },
  ku: { Sun: 'یەک', Mon: 'دوو', Tue: 'سێ', Wed: 'چوار', Thu: 'پێنج', Fri: 'هەی', Sat: 'شە' },
};

const lang = () => (window.__lang === 'ku' ? 'ku' : 'en');
const interp = (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : '{' + k + '}')) : s);

function t(key, vars) { const L = lang(); const s = (UI[L] && UI[L][key]) || UI.en[key] || key; return interp(s, vars); }
function tm(key) { const L = lang(); return (MUS[L] && MUS[L][key]) || MUS.en[key] || key; }
function tg(g) { const L = lang(); return (GRP[L] && GRP[L][g]) || g; }
function teq(e) { const L = lang(); return (EQ[L] && EQ[L][e]) || e; }
function tdayFull(wd) { const L = lang(); return (DAYS_FULL_I[L] && DAYS_FULL_I[L][wd]) || wd; }
function tdayShort(wd) { const L = lang(); return (DAYS_SHORT_I[L] && DAYS_SHORT_I[L][wd]) || wd; }

// exercise name / tip resolvers
function exName(ex) { return lang() === 'ku' && ex.name_ku ? ex.name_ku : ex.name; }
function exTip(ex) { return lang() === 'ku' && ex.tip_ku ? ex.tip_ku : ex.tip; }
function muscleText(ex) { const sep = lang() === 'ku' ? '، ' : ', '; return ex.primary.map(tm).join(sep); }

Object.assign(window, { t, tm, tg, teq, tdayFull, tdayShort, exName, exTip, muscleText, _UI: UI });
