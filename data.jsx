// data.jsx — exercise library, seed data, progress math. Exported to window.

// Muscle group buckets for the library tabs
const GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

// Each exercise: id, name, group, equipment, view, primary[], secondary[],
// track ('weight'|'bodyweight'), tip
const EXERCISES = [
  // ---- Chest ----
  { id: 'bench', name: 'Barbell Bench Press', name_ku: 'بێنچ پرێسی هالتەر', group: 'Chest', equipment: 'barbell', view: 'front',
    primary: ['chest'], secondary: ['delts', 'triceps'], track: 'weight',
    tip: 'Lower the bar to mid-chest, drive through the floor, keep shoulder blades pinched.',
    tip_ku: 'هالتەرەکە بۆ ناوەڕاستی سنگ دابەزێنە، پاڵ بە زەوییەوە بنێ، شانەکانت بگرە بەیەکەوە.' },
  { id: 'incline_db', name: 'Incline Dumbbell Press', name_ku: 'پرێسی لار بە دەمبڵ', group: 'Chest', equipment: 'dumbbell', view: 'front',
    primary: ['chest'], secondary: ['delts', 'triceps'], track: 'weight',
    tip: 'Bench at 30°. Press up and slightly together for the upper chest.',
    tip_ku: 'کورسی لە ٣٠ پلە. بۆ سەرەوە و کەمێک بەرەو ناوەند پاڵ بدە بۆ سنگی سەرەوە.' },
  { id: 'pec_deck', name: 'Pec Deck Fly', name_ku: 'فلایی سنگ بە ئامێر', group: 'Chest', equipment: 'machine', view: 'front',
    primary: ['chest'], secondary: ['delts'], track: 'weight',
    tip: 'Squeeze chest, soft elbows, slow on the way back to feel the stretch.',
    tip_ku: 'سنگ بگوشە، ئانیشک نەرم، لە گەڕانەوەدا هێواش بۆ هەستکردن بە کشان.' },
  { id: 'pushup', name: 'Push-up', name_ku: 'شنۆ (پاش-ئەپ)', group: 'Chest', equipment: 'bodyweight', view: 'front',
    primary: ['chest'], secondary: ['delts', 'triceps', 'abs'], track: 'bodyweight',
    tip: 'Body in a straight line, lower until chest is an inch off the floor.',
    tip_ku: 'لەش ڕاست بێت، دابەزە تا سنگ نزیک زەوی دەبێتەوە.' },
  { id: 'db_bench', name: 'Dumbbell Bench Press', name_ku: 'بێنچ پرێس بە دەمبڵ', group: 'Chest', equipment: 'dumbbell', view: 'front',
    primary: ['chest'], secondary: ['delts', 'triceps'], track: 'weight',
    tip: 'Lower the dumbbells wide for a deep chest stretch, press them together at the top.',
    tip_ku: 'دەمبڵەکان بەفراوانی دابەزێنە بۆ کشانی قووڵی سنگ، لەسەرەوە بیانگەیەنە بەیەک.' },
  { id: 'cable_cross', name: 'Cable Crossover', name_ku: 'کرۆس ئۆڤەر بە کێبڵ', group: 'Chest', equipment: 'cable', view: 'front',
    primary: ['chest'], secondary: ['delts'], track: 'weight',
    tip: 'Slight forward lean, sweep hands together and squeeze the chest hard.',
    tip_ku: 'کەمێک بەرەو پێش خوار بەرەوە، دەستەکان بهێنە بەیەک و سنگ بەتوندی بگوشە.' },
  { id: 'chest_dip', name: 'Chest Dip', name_ku: 'دیپسی سنگ', group: 'Chest', equipment: 'bodyweight', view: 'front',
    primary: ['chest'], secondary: ['triceps', 'delts'], track: 'bodyweight',
    tip: 'Lean forward, flare elbows slightly, dip until you feel the chest stretch.',
    tip_ku: 'بەرەو پێش بەرەوە، ئانیشک کەمێک بکەرەوە، دابەزە تا کشانی سنگ هەست پێدەکەیت.' },

  // ---- Back ----
  { id: 'deadlift', name: 'Deadlift', name_ku: 'دێدلیفت', group: 'Back', equipment: 'barbell', view: 'back',
    primary: ['lowerback', 'glutes', 'hamstrings'], secondary: ['lats', 'traps', 'forearms'], track: 'weight',
    tip: 'Brace hard, bar over mid-foot, push the floor away. Keep the bar close.',
    tip_ku: 'سکت توند بگرە، هالتەر لەسەر ناوەڕاستی پێ، زەوی پاڵ بدە. هالتەر نزیک بهێڵەوە.' },
  { id: 'pullup', name: 'Pull-up', name_ku: 'بارفیکس', group: 'Back', equipment: 'bodyweight', view: 'back',
    primary: ['lats'], secondary: ['biceps', 'traps', 'forearms'], track: 'bodyweight',
    tip: 'Pull elbows down and back, drive chest to the bar. Add weight to progress.',
    tip_ku: 'ئانیشک بۆ خوارەوە و دواوە ڕابکێشە، سنگ بگەیەنە بە بار. کێش زیاد بکە بۆ پێشکەوتن.' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', name_ku: 'لات پووڵداون بە کێبڵ', group: 'Back', equipment: 'cable', view: 'back',
    primary: ['lats'], secondary: ['biceps', 'traps'], track: 'weight',
    tip: 'Lead with the elbows, bar to upper chest, control the stretch up top.',
    tip_ku: 'بە ئانیشک ڕابکێشە، بار بۆ سنگی سەرەوە، لەسەرەوە کشانەکە کۆنترۆڵ بکە.' },
  { id: 'seated_row', name: 'Seated Cable Row', name_ku: 'ڕۆی دانیشتوو بە کێبڵ', group: 'Back', equipment: 'cable', view: 'back',
    primary: ['lats', 'traps'], secondary: ['biceps', 'forearms'], track: 'weight',
    tip: 'Pull to the navel, squeeze shoulder blades, don\u2019t lean back excessively.',
    tip_ku: 'بۆ ناوک ڕابکێشە، شانەکان بگوشە، زۆر بەرەو دواوە مەلوێرەوە.' },
  { id: 'bent_row', name: 'Bent-over Barbell Row', name_ku: 'ڕۆی هالتەری چەماوە', group: 'Back', equipment: 'barbell', view: 'back',
    primary: ['lats', 'traps'], secondary: ['biceps', 'lowerback'], track: 'weight',
    tip: 'Hinge ~45°, flat back, pull the bar to your lower ribs.',
    tip_ku: 'نزیک ٤٥ پلە بچەمێرەوە، پشت ڕاست، هالتەر بۆ پەراسووی خوارەوە ڕابکێشە.' },
  { id: 'tbar_row', name: 'T-Bar Row', name_ku: 'ڕۆی تی-بار', group: 'Back', equipment: 'barbell', view: 'back',
    primary: ['lats', 'traps'], secondary: ['biceps', 'lowerback'], track: 'weight',
    tip: 'Chest up, drive elbows back, squeeze the mid-back at the top.',
    tip_ku: 'سنگ بەرز، ئانیشک بۆ دواوە، ناوەڕاستی پشت لەسەرەوە بگوشە.' },
  { id: 'face_pull', name: 'Face Pull', name_ku: 'فەیس پووڵ بە کێبڵ', group: 'Back', equipment: 'cable', view: 'back',
    primary: ['delts', 'traps'], secondary: [], track: 'weight',
    tip: 'Pull the rope to your forehead, elbows high, externally rotate at the end.',
    tip_ku: 'گوریسەکە بۆ ناوچەوان ڕابکێشە، ئانیشک بەرز، لەکۆتاییدا بەرەو دەرەوە بسووڕێنە.' },
  { id: 'shrug', name: 'Barbell Shrug', name_ku: 'شراگ بە هالتەر', group: 'Back', equipment: 'barbell', view: 'back',
    primary: ['traps'], secondary: [], track: 'weight',
    tip: 'Lift shoulders straight up to your ears, pause, lower slowly.',
    tip_ku: 'شانەکان ڕاست بۆ سەرەوە بەرەو گوێ بەرز بکە، بوەستە، هێواش دایبەزێنە.' },
  { id: 'chinup', name: 'Chin-up', name_ku: 'چن-ئەپ', group: 'Back', equipment: 'bodyweight', view: 'back',
    primary: ['lats'], secondary: ['biceps', 'forearms'], track: 'bodyweight',
    tip: 'Underhand grip, pull chin over the bar, control all the way down.',
    tip_ku: 'گرتنی ژێرەوە، چەناگە بەسەر بارەوە ڕابکێشە، بەتەواوی دابەزە.' },

  // ---- Legs ----
  { id: 'squat', name: 'Barbell Back Squat', name_ku: 'سکوات بە هالتەر', group: 'Legs', equipment: 'barbell', view: 'front',
    primary: ['quads', 'glutes'], secondary: ['hamstrings', 'lowerback', 'abs'], track: 'weight',
    tip: 'Brace, break at hips and knees together, hit at least parallel, drive up.',
    tip_ku: 'سک توند بگرە، کەمەر و ئەژنۆ پێکەوە بچەمێنەوە، تا لای کەم ئاست، پاشان بەرز ببەوە.' },
  { id: 'leg_press', name: 'Leg Press', name_ku: 'لێگ پرێس (ئامێر)', group: 'Legs', equipment: 'machine', view: 'front',
    primary: ['quads', 'glutes'], secondary: ['hamstrings'], track: 'weight',
    tip: 'Feet shoulder-width, lower until knees ~90°, don\u2019t lock out hard.',
    tip_ku: 'پێیەکان بەپانی شان، دابەزە تا ئەژنۆ نزیک ٩٠ پلە، بەتوندی قوفڵ مەکە.' },
  { id: 'leg_ext', name: 'Leg Extension', name_ku: 'درێژکردنی قاچ (ئامێر)', group: 'Legs', equipment: 'machine', view: 'front',
    primary: ['quads'], secondary: [], track: 'weight',
    tip: 'Pause and squeeze at the top, slow on the way down.',
    tip_ku: 'لەسەرەوە بوەستە و بگوشە، لە دابەزیندا هێواش.' },
  { id: 'leg_curl', name: 'Lying Leg Curl', name_ku: 'لیفی قاچ بە پاڵکەوتوو', group: 'Legs', equipment: 'machine', view: 'back',
    primary: ['hamstrings'], secondary: ['calves'], track: 'weight',
    tip: 'Curl heels to glutes, control the negative, keep hips down.',
    tip_ku: 'پاژنە بۆ کەپوول ڕابکێشە، گەڕانەوە کۆنترۆڵ بکە، کەمەر لە خوارەوە بهێڵە.' },
  { id: 'calf_raise', name: 'Standing Calf Raise', name_ku: 'بەرزکردنی ساق بە پێوە', group: 'Legs', equipment: 'machine', view: 'back',
    primary: ['calves'], secondary: [], track: 'weight',
    tip: 'Full stretch at the bottom, rise all the way onto the toes, pause.',
    tip_ku: 'لە خوارەوە بەتەواوی بکشێ، تا سەری پەنجە بەرز ببەوە، بوەستە.' },
  { id: 'rdl', name: 'Romanian Deadlift', name_ku: 'دێدلیفتی ڕۆمانی', group: 'Legs', equipment: 'barbell', view: 'back',
    primary: ['hamstrings', 'glutes'], secondary: ['lowerback'], track: 'weight',
    tip: 'Soft knees, push hips back, feel the hamstring stretch, bar stays close.',
    tip_ku: 'ئەژنۆ نەرم، کەمەر بۆ دواوە، کشانی پشتی ڕان هەست پێبکە، هالتەر نزیک.' },
  { id: 'walk_lunge', name: 'Walking Lunge', name_ku: 'لەنجی ڕۆیشتن', group: 'Legs', equipment: 'dumbbell', view: 'front',
    primary: ['quads', 'glutes'], secondary: ['hamstrings'], track: 'weight',
    tip: 'Long steps, back knee toward the floor, push through the front heel.',
    tip_ku: 'هەنگاوی درێژ، ئەژنۆی دواوە بۆ زەوی، پاڵ بە پاژنەی پێشەوە بنێ.' },
  { id: 'bulg_squat', name: 'Bulgarian Split Squat', name_ku: 'سکواتی بولگاری', group: 'Legs', equipment: 'dumbbell', view: 'front',
    primary: ['quads', 'glutes'], secondary: ['hamstrings'], track: 'weight',
    tip: 'Back foot elevated, drop straight down, weight on the front leg.',
    tip_ku: 'پێی دواوە بەرز، ڕاست دابەزە، کێش لەسەر قاچی پێشەوە.' },
  { id: 'hip_thrust', name: 'Hip Thrust', name_ku: 'هیپ ثراست', group: 'Legs', equipment: 'barbell', view: 'back',
    primary: ['glutes'], secondary: ['hamstrings'], track: 'weight',
    tip: 'Drive hips up, squeeze glutes hard at the top, chin tucked.',
    tip_ku: 'کەمەر بۆ سەرەوە بەرز بکە، لەسەرەوە کەپوول بەتوندی بگوشە، چەناگە بنووشتاوە.' },
  { id: 'hack_squat', name: 'Hack Squat', name_ku: 'هاک سکوات', group: 'Legs', equipment: 'machine', view: 'front',
    primary: ['quads', 'glutes'], secondary: [], track: 'weight',
    tip: 'Feet low for quads, descend deep, drive through mid-foot.',
    tip_ku: 'پێ نزم بۆ پێشی ڕان، قووڵ دابەزە، پاڵ بە ناوەڕاستی پێ.' },

  // ---- Shoulders ----
  { id: 'ohp', name: 'Overhead Press', name_ku: 'پرێسی سەروو', group: 'Shoulders', equipment: 'barbell', view: 'front',
    primary: ['delts'], secondary: ['triceps', 'traps'], track: 'weight',
    tip: 'Squeeze glutes, press the bar in a straight line, finish with head through.',
    tip_ku: 'کەپوول بگوشە، هالتەر بە هێڵی ڕاست پاڵ بدە، لەکۆتاییدا سەر بەناویدا تێپەڕێنە.' },
  { id: 'lateral_raise', name: 'Lateral Raise', name_ku: 'بەرزکردنەوەی لاتەنیشت', group: 'Shoulders', equipment: 'dumbbell', view: 'front',
    primary: ['delts'], secondary: [], track: 'weight',
    tip: 'Lead with the elbows, raise to shoulder height, no swinging.',
    tip_ku: 'بە ئانیشک، تا ئاستی شان بەرز بکە، بێ هەژاندن.' },
  { id: 'arnold', name: 'Arnold Press', name_ku: 'پرێسی ئارنۆڵد', group: 'Shoulders', equipment: 'dumbbell', view: 'front',
    primary: ['delts'], secondary: ['triceps'], track: 'weight',
    tip: 'Start palms facing you, rotate out as you press overhead.',
    tip_ku: 'سەرەتا لەپ بەرەو خۆت، لەکاتی پاڵدان بەرەو دەرەوە بیسووڕێنە.' },
  { id: 'front_raise', name: 'Front Raise', name_ku: 'بەرزکردنی پێشەوە', group: 'Shoulders', equipment: 'dumbbell', view: 'front',
    primary: ['delts'], secondary: [], track: 'weight',
    tip: 'Raise to shoulder height in front, controlled, no momentum.',
    tip_ku: 'لەپێشەوە تا ئاستی شان بەرز بکە، کۆنترۆڵکراو، بێ پاڵەپەستۆ.' },
  { id: 'rear_fly', name: 'Rear Delt Fly', name_ku: 'فلایی شانی دواوە', group: 'Shoulders', equipment: 'dumbbell', view: 'back',
    primary: ['delts'], secondary: ['traps'], track: 'weight',
    tip: 'Hinge forward, raise arms wide, squeeze the rear delts.',
    tip_ku: 'بەرەو پێش بچەمێرەوە، باسکەکان بەفراوانی بەرز بکە، شانی دواوە بگوشە.' },
  { id: 'upright_row', name: 'Upright Row', name_ku: 'ڕۆی ستوونی', group: 'Shoulders', equipment: 'barbell', view: 'front',
    primary: ['delts', 'traps'], secondary: ['biceps'], track: 'weight',
    tip: 'Pull the bar up the body, elbows lead and stay above the wrists.',
    tip_ku: 'هالتەر بەلاشەوە بۆ سەرەوە ڕابکێشە، ئانیشک پێش و لەسەرووی مەچەک.' },

  // ---- Arms ----
  { id: 'db_curl', name: 'Dumbbell Bicep Curl', name_ku: 'کێرڵی بایسێپس بە دەمبڵ', group: 'Arms', equipment: 'dumbbell', view: 'front',
    primary: ['biceps'], secondary: ['forearms'], track: 'weight',
    tip: 'Elbows pinned to your sides, curl up, squeeze, lower slowly.',
    tip_ku: 'ئانیشک بەلاتەوە بگرە، بۆ سەرەوە بیپێچە، بگوشە، هێواش دایبەزێنە.' },
  { id: 'hammer_curl', name: 'Hammer Curl', name_ku: 'کێرڵی چەکوش', group: 'Arms', equipment: 'dumbbell', view: 'front',
    primary: ['biceps'], secondary: ['forearms'], track: 'weight',
    tip: 'Neutral grip (thumbs up), curl without rotating, hits the forearm too.',
    tip_ku: 'گرتنی ناوەند (پەنجە بەرز)، بێ سووڕان بیپێچە، پێشقۆڵیش دەگرێت.' },
  { id: 'preacher_curl', name: 'Preacher Curl', name_ku: 'کێرڵی پریچەر', group: 'Arms', equipment: 'machine', view: 'front',
    primary: ['biceps'], secondary: [], track: 'weight',
    tip: 'Arms on the pad, full stretch at the bottom, no swinging.',
    tip_ku: 'باسک لەسەر بالشتەکە، لە خوارەوە بەتەواوی بکشێ، بێ هەژاندن.' },
  { id: 'tri_pushdown', name: 'Tricep Pushdown', name_ku: 'پووشداونی ترایسێپس بە کێبڵ', group: 'Arms', equipment: 'cable', view: 'back',
    primary: ['triceps'], secondary: [], track: 'weight',
    tip: 'Elbows locked at your sides, extend fully, control back up.',
    tip_ku: 'ئانیشک لەلاتدا قوفڵ، بەتەواوی درێژبکەرەوە، بەکۆنترۆڵ بگەڕێرەوە.' },
  { id: 'skull_crusher', name: 'Skull Crusher', name_ku: 'سکەڵ کراشەر', group: 'Arms', equipment: 'barbell', view: 'back',
    primary: ['triceps'], secondary: [], track: 'weight',
    tip: 'Lower the bar to your forehead, elbows still, extend to lock out.',
    tip_ku: 'هالتەر بۆ ناوچەوان دابەزێنە، ئانیشک نەجووڵێت، درێژبکەرەوە بۆ قوفڵ.' },
  { id: 'oh_tri_ext', name: 'Overhead Tricep Extension', name_ku: 'درێژکردنی ترایسێپس لەسەروو', group: 'Arms', equipment: 'dumbbell', view: 'back',
    primary: ['triceps'], secondary: [], track: 'weight',
    tip: 'Keep elbows close to the head, deep stretch, extend overhead.',
    tip_ku: 'ئانیشک نزیک بە سەر، کشانی قووڵ، لەسەروو درێژبکەرەوە.' },

  // ---- Core ----
  { id: 'plank', name: 'Plank', name_ku: 'پلانک', group: 'Core', equipment: 'bodyweight', view: 'front',
    primary: ['abs'], secondary: ['obliques'], track: 'time',
    tip: 'Squeeze abs and glutes, straight line head-to-heels. Track seconds held.',
    tip_ku: 'سک و کەپوول بگوشە، هێڵی ڕاست لە سەرەوە بۆ پاژنە. چرکەکان تۆمار بکە.' },
  { id: 'hanging_leg', name: 'Hanging Leg Raise', name_ku: 'بەرزکردنی قاچ بە هەڵواسراوی', group: 'Core', equipment: 'bodyweight', view: 'front',
    primary: ['abs'], secondary: ['obliques', 'forearms'], track: 'bodyweight',
    tip: 'Raise legs with control, no swinging, curl the pelvis up.',
    tip_ku: 'قاچ بەکۆنترۆڵ بەرز بکە، بێ هەژاندن، کەمەر بۆ سەرەوە بپێچە.' },
  { id: 'cable_crunch', name: 'Cable Crunch', name_ku: 'کرەنچ بە کێبڵ', group: 'Core', equipment: 'cable', view: 'front',
    primary: ['abs'], secondary: [], track: 'weight',
    tip: 'Crunch with the abs (not the hips), round the spine down.',
    tip_ku: 'بە سک بپێچەرەوە (نەک کەمەر)، بڕبڕەی پشت بەرەو خوار خڕ بکە.' },
  { id: 'russian_twist', name: 'Russian Twist', name_ku: 'ڕەشین تویست', group: 'Core', equipment: 'bodyweight', view: 'front',
    primary: ['obliques'], secondary: ['abs'], track: 'bodyweight',
    tip: 'Lean back, rotate side to side under control, feet off the floor to scale up.',
    tip_ku: 'بەرەو دواوە بەرەوە، بەکۆنترۆڵ بۆ لاکان بسووڕێ، پێ لە زەوی هەڵبڕە بۆ قورستر.' },
  { id: 'mtn_climber', name: 'Mountain Climber', name_ku: 'کۆڵکەی شاخ', group: 'Core', equipment: 'bodyweight', view: 'front',
    primary: ['abs'], secondary: ['obliques'], track: 'bodyweight',
    tip: 'Plank position, drive knees to chest fast, keep hips low.',
    tip_ku: 'لە دۆخی پلانک، ئەژنۆ بەخێرایی بۆ سنگ ڕابکێشە، کەمەر نزم بهێڵە.' },
];

const byId = (id) => EXERCISES.find((e) => e.id === id);

// ---- default week plan (Mon=1 ... Sun=0) -----------------------------------
const DEFAULT_PLAN = {
  Mon: ['bench', 'incline_db', 'lateral_raise', 'tri_pushdown'],
  Tue: ['deadlift', 'pullup', 'lat_pulldown', 'db_curl'],
  Wed: ['squat', 'leg_press', 'leg_curl', 'calf_raise'],
  Thu: [],
  Fri: ['bench', 'pec_deck', 'ohp', 'tri_pushdown'],
  Sat: ['bent_row', 'seated_row', 'pullup', 'db_curl'],
  Sun: ['plank', 'hanging_leg'],
};
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };

// ---- progress math ---------------------------------------------------------
const epley = (kg, reps) => (reps <= 0 ? 0 : kg * (1 + reps / 30));
function bestSet(sets) {
  let best = null;
  for (const s of sets || []) {
    if (!s.reps) continue;
    const e = epley(s.kg || 0, s.reps);
    if (!best || e > best.e1rm) best = { ...s, e1rm: e };
  }
  return best;
}
const setsVolume = (sets) => (sets || []).reduce((t, s) => t + (s.reps || 0) * (s.kg || 0), 0);
function sessionVolume(session) {
  return (session.entries || []).reduce((t, e) => t + setsVolume(e.sets), 0);
}
// per-exercise series across history (chronological)
function exerciseSeries(history, exId) {
  const pts = [];
  history.slice().sort((a, b) => a.date - b.date).forEach((sess) => {
    const e = (sess.entries || []).find((x) => x.exerciseId === exId);
    if (!e) return;
    const bs = bestSet(e.sets);
    if (!bs) return;
    pts.push({ date: sess.date, topKg: bs.kg || 0, topReps: bs.reps || 0, e1rm: bs.e1rm, volume: setsVolume(e.sets) });
  });
  return pts;
}
function prFor(history, exId) {
  const s = exerciseSeries(history, exId);
  if (!s.length) return null;
  return {
    maxKg: Math.max(...s.map((p) => p.topKg)),
    maxE1rm: Math.max(...s.map((p) => p.e1rm)),
    maxVol: Math.max(...s.map((p) => p.volume)),
  };
}

// ---- seed history (a few weeks of progression so charts are alive) ---------
function seedHistory() {
  const out = [];
  const now = new Date();
  // exercises to seed w/ starting top set
  const plan = [
    { id: 'bench', kg: 60, reps: 8, step: 2.5 },
    { id: 'squat', kg: 80, reps: 8, step: 5 },
    { id: 'deadlift', kg: 100, reps: 5, step: 5 },
    { id: 'lat_pulldown', kg: 50, reps: 10, step: 2.5 },
    { id: 'ohp', kg: 35, reps: 8, step: 2.5 },
    { id: 'db_curl', kg: 12, reps: 12, step: 1 },
  ];
  const groups = [
    ['bench', 'incline_db', 'lateral_raise', 'tri_pushdown'],
    ['deadlift', 'pullup', 'lat_pulldown', 'db_curl'],
    ['squat', 'leg_press', 'leg_curl', 'calf_raise'],
  ];
  let sessionN = 0;
  // 5 prior weeks, 3 sessions/week
  for (let w = 5; w >= 1; w--) {
    groups.forEach((g, gi) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (w * 7 - gi * 2));
      d.setHours(18, 0, 0, 0);
      const entries = g.map((exId) => {
        const base = plan.find((p) => p.id === exId);
        const ex = byId(exId);
        let kg, reps;
        if (base) {
          kg = base.kg + base.step * (5 - w);
          reps = base.reps + ((sessionN % 3) - 1);
        } else {
          kg = ex.track === 'bodyweight' ? 0 : 20 + (5 - w) * 2.5;
          reps = 10;
        }
        const nSets = 3;
        const sets = Array.from({ length: nSets }, (_, i) => ({
          reps: Math.max(4, reps - (i === nSets - 1 ? 1 : 0)),
          kg: Math.round(kg * (ex.track === 'bodyweight' ? 0 : 1) * 2) / 2,
          done: true,
        }));
        return { exerciseId: exId, sets };
      });
      out.push({ id: 'seed_' + sessionN, date: d.getTime(), weekday: DAYS[d.getDay()], entries, note: '' });
      sessionN++;
    });
  }
  return out.sort((a, b) => a.date - b.date);
}

// New users start completely empty: no planned days, no history.
function emptyPlan() {
  const p = {};
  DAYS.forEach((d) => { p[d] = []; });
  return p;
}
function defaultState() {
  return {
    version: 1,
    plan: emptyPlan(),
    history: [],
    settings: { unit: 'kg', bodyweight: 75, sampleData: false, lang: 'en' },
  };
}

Object.assign(window, {
  GROUPS, EXERCISES, byId, DEFAULT_PLAN, DAYS, DAY_FULL,
  epley, bestSet, setsVolume, sessionVolume, exerciseSeries, prFor,
  defaultState,
});
