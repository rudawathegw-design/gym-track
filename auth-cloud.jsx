// auth-cloud.jsx — Google login (Firebase) + per-user data saved on the OWNER's
// GitHub repo via a backend Worker. Users only sign in with Google; the GitHub
// token lives server-side in the Worker and is never exposed to the browser.
// Wraps <App/> and syncs localStorage['gymtrack_v1'] to GET/PUT <api>/api/data.

const { useState: aUseState, useEffect: aUseEffect, useRef: aUseRef } = React;

const STORE_KEY = "gymtrack_v1";

// ---------- Firebase ----------
let _auth = null;
function initFirebase() {
  if (_auth) return _auth;
  if (!window.firebase || !window.GT_CONFIG) return null;
  if (!firebase.apps.length) firebase.initializeApp(GT_CONFIG.firebase);
  _auth = firebase.auth();
  return _auth;
}

// ---------- backend (Cloudflare Worker) ----------
function apiBase() { return (window.GT_CONFIG && window.GT_CONFIG.api) || ""; }

async function authedFetch(method, body) {
  const user = _auth && _auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const idToken = await user.getIdToken();         // auto-refreshes
  const res = await fetch(`${apiBase()}/api/data`, {
    method,
    headers: {
      Authorization: `Bearer ${idToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { msg = (await res.json()).error || msg; } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

const cloudLoad = () => authedFetch("GET").then((r) => r.data); // null if first time
const cloudSave = (state) => authedFetch("PUT", state);

// ---------- styles for the gate ----------
const GATE_CSS = `
.gate{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(120% 80% at 50% -10%, rgba(200,255,0,.10), transparent 60%), #050505;z-index:100;padding:24px;overflow:hidden}
.gate::before{content:"";position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle, rgba(200,255,0,.12), transparent 70%);top:-180px;filter:blur(30px);pointer-events:none}
.gate__card{position:relative;width:100%;max-width:380px;background:linear-gradient(180deg,#141414,#0e0e0e);border:1px solid #242424;border-radius:26px;padding:36px 26px 30px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.gate__logo{width:60px;height:60px;border-radius:18px;background:#c8ff00;display:grid;place-items:center;margin:0 auto 16px}
/* hero dumbbell mark for login */
.gate__hero{width:96px;height:96px;border-radius:28px;background:linear-gradient(145deg,#d4ff33,#a9d400);display:grid;place-items:center;margin:0 auto 22px;box-shadow:0 12px 40px rgba(200,255,0,.32), inset 0 2px 6px rgba(255,255,255,.35)}
.gate__title{font-family:'Archivo',sans-serif;font-weight:900;letter-spacing:.18em;font-size:30px;color:#f6f6f4;margin-left:.18em}
.gate__tag{font-family:'Archivo',sans-serif;font-weight:700;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#c8ff00;margin-top:8px}
.gate__sub{font-size:13.5px;color:#9b9b97;margin:14px 0 24px;line-height:1.55}
.gate__btn{display:flex;align-items:center;justify-content:center;gap:11px;width:100%;background:#fff;color:#1f1f1f;font-family:'Archivo',sans-serif;font-weight:700;font-size:15.5px;border-radius:14px;padding:15px;border:none;cursor:pointer;transition:transform .08s,box-shadow .15s;box-shadow:0 6px 22px rgba(0,0,0,.4)}
.gate__btn:hover{box-shadow:0 8px 26px rgba(255,255,255,.12)}
.gate__btn:active{transform:scale(.98);filter:brightness(.96)}
.gate__foot{font-size:11px;color:#5e5e5a;margin-top:18px;line-height:1.5}
.gate__err{color:#ff5b5b;font-size:12.5px;margin-top:14px}
/* sync badge over the app */
.synbadge{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:90;background:rgba(17,17,17,.95);border:1px solid #323232;color:#9b9b97;font-size:11px;font-weight:600;padding:6px 12px;border-radius:20px;display:flex;align-items:center;gap:7px;pointer-events:none;transition:opacity .3s}
.synbadge__dot{width:7px;height:7px;border-radius:50%;background:#c8ff00}
.synbadge--err{color:#ff5b5b}.synbadge--err .synbadge__dot{background:#ff5b5b}
`;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 43.5c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.5 26.7 35.5 24 35.5c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.6 39.1 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.7 36.4 43.5 30.7 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

function DumbbellMark() {
  // chunky gym dumbbell
  return (
    <svg width="54" height="54" viewBox="0 0 64 64" fill="none">
      <g stroke="#0a0a0a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="22" width="9" height="20" rx="3" fill="#0a0a0a" stroke="none"/>
        <rect x="12" y="17" width="9" height="30" rx="3.5" fill="#0a0a0a" stroke="none"/>
        <rect x="43" y="17" width="9" height="30" rx="3.5" fill="#0a0a0a" stroke="none"/>
        <rect x="52" y="22" width="9" height="20" rx="3" fill="#0a0a0a" stroke="none"/>
        <line x1="21" y1="32" x2="43" y2="32"/>
      </g>
    </svg>
  );
}

function LoginScreen({ onGoogle, error }) {
  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__hero"><DumbbellMark /></div>
        <div className="gate__title">IRONLOG</div>
        <div className="gate__tag">Train · Track · Progress</div>
        <div className="gate__sub">Log every set, beat your PRs, and sync your workouts automatically — just sign in to begin.</div>
        <button className="gate__btn" onClick={onGoogle}><GoogleIcon /> Continue with Google</button>
        {error && <div className="gate__err">{error}</div>}
        <div className="gate__foot">Your workouts are saved securely. We only use your Google name & email to identify your account.</div>
      </div>
    </div>
  );
}

function Loading({ msg }) {
  return (
    <div className="gate"><div className="gate__card">
      <div className="gate__logo"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round"><path d="M7 9v6M17 9v6M9 12h6"/></svg></div>
      <div className="gate__sub" style={{ marginBottom: 0 }}>{msg || "Loading…"}</div>
    </div></div>
  );
}

function SyncBadge({ status }) {
  if (!status) return null;
  const err = status === "error";
  const label = err ? "Sync failed — retrying" : status === "saving" ? "Saving…" : "Synced";
  return (
    <div className={"synbadge" + (err ? " synbadge--err" : "")} style={{ opacity: status === "saved" ? 0 : 1 }}>
      <span className="synbadge__dot" />{label}
    </div>
  );
}

// ============================================================ ROOT GATE
function RootGate() {
  const [phase, setPhase] = aUseState("init"); // init | login | loading | ready
  const [error, setError] = aUseState("");
  const [syncStatus, setSyncStatus] = aUseState(null);
  const saveTimer = aUseRef(null);

  aUseEffect(() => {
    if (document.getElementById("gate-css")) return;
    const s = document.createElement("style"); s.id = "gate-css"; s.textContent = GATE_CSS;
    document.head.appendChild(s);
  }, []);

  aUseEffect(() => {
    const auth = initFirebase();
    if (!auth) { setError("Firebase not configured — edit config.jsx"); setPhase("login"); return; }
    return auth.onAuthStateChanged((u) => {
      if (!u) { setPhase("login"); return; }
      bootstrap();
    });
  }, []);

  // load this user's data from the backend, seed localStorage, mount the app
  const bootstrap = async () => {
    setPhase("loading"); setError("");
    window.__userEmail = (_auth && _auth.currentUser && _auth.currentUser.email) || null;
    try {
      const data = await cloudLoad();
      if (data) {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
      } else {
        const local = localStorage.getItem(STORE_KEY);
        if (local) await cloudSave(JSON.parse(local)); // first login: push local up
      }
      installCloudSave();
      setPhase("ready");
    } catch (e) {
      setError(e.message);
      setPhase("login");
    }
  };

  // debounced saver that useStore() calls on every change
  const installCloudSave = () => {
    window.__cloudSave = (state) => {
      clearTimeout(saveTimer.current);
      setSyncStatus("saving");
      saveTimer.current = setTimeout(async () => {
        try { await cloudSave(state); setSyncStatus("saved"); }
        catch (e) { setSyncStatus("error"); }
      }, 1500);
    };
  };

  const signInGoogle = async () => {
    setError("");
    try {
      const auth = initFirebase();
      await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (e) { setError(e.message); }
  };

  const signOut = async () => {
    window.__cloudSave = null;
    localStorage.removeItem(STORE_KEY);
    const auth = initFirebase();
    if (auth) await auth.signOut();
  };
  window.__signOut = signOut;

  if (phase === "login" || phase === "init") return <LoginScreen onGoogle={signInGoogle} error={error} />;
  if (phase === "loading") return <Loading msg="Loading your workouts…" />;
  return (
    <React.Fragment>
      <SyncBadge status={syncStatus} />
      <App />
    </React.Fragment>
  );
}

window.RootGate = RootGate;
