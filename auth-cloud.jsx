// auth-cloud.jsx — Google login (Firebase) + per-user data saved on GitHub.
// Wraps <App/> in a login gate and syncs localStorage['gymtrack_v1'] to a
// GitHub repo as data/<uid>.json (committed + pushed via the Contents API).

const { useState: aUseState, useEffect: aUseEffect, useRef: aUseRef } = React;

// ---------- unicode-safe base64 ----------
const b64encode = (str) => btoa(unescape(encodeURIComponent(str)));
const b64decode = (b64) => decodeURIComponent(escape(atob(b64)));

// ---------- Firebase ----------
let _auth = null;
function initFirebase() {
  if (_auth) return _auth;
  if (!window.firebase || !window.GT_CONFIG) return null;
  if (!firebase.apps.length) firebase.initializeApp(GT_CONFIG.firebase);
  _auth = firebase.auth();
  return _auth;
}

// ---------- GitHub data store ----------
const GH_TOKEN_KEY = "gt_gh_token";
const STORE_KEY = "gymtrack_v1";

function ghCfg() { return (window.GT_CONFIG && window.GT_CONFIG.github) || {}; }
function ghToken() { return localStorage.getItem(GH_TOKEN_KEY) || ""; }
function ghFileUrl(uid) {
  const { owner, repo, path } = ghCfg();
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}/${uid}.json`;
}

async function cloudLoad(uid) {
  const { branch } = ghCfg();
  const res = await fetch(`${ghFileUrl(uid)}?ref=${branch}`, {
    headers: { Authorization: `token ${ghToken()}`, Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) return { data: null, sha: null };  // first time
  if (!res.ok) throw new Error(`GitHub load failed (${res.status})`);
  const json = await res.json();
  return { data: JSON.parse(b64decode(json.content)), sha: json.sha };
}

async function cloudSave(uid, state, sha) {
  const { branch } = ghCfg();
  const body = {
    message: `gym-track: update data for ${uid}`,
    content: b64encode(JSON.stringify(state, null, 2)),
    branch,
  };
  if (sha) body.sha = sha;
  const res = await fetch(ghFileUrl(uid), {
    method: "PUT",
    headers: { Authorization: `token ${ghToken()}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub save failed (${res.status})`);
  const json = await res.json();
  return json.content.sha; // new sha for the next write
}

// ---------- styles for the gate ----------
const GATE_CSS = `
.gate{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;z-index:100;padding:24px}
.gate__card{width:100%;max-width:380px;background:#111;border:1px solid #262626;border-radius:22px;padding:30px 24px;text-align:center}
.gate__logo{width:60px;height:60px;border-radius:18px;background:#c8ff00;display:grid;place-items:center;margin:0 auto 16px}
.gate__title{font-family:'Archivo',sans-serif;font-weight:900;letter-spacing:.14em;font-size:22px;color:#f6f6f4}
.gate__sub{font-size:13px;color:#9b9b97;margin:6px 0 22px;line-height:1.5}
.gate__btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;background:#fff;color:#1f1f1f;font-family:'Archivo',sans-serif;font-weight:700;font-size:15px;border-radius:13px;padding:13px;border:none;cursor:pointer}
.gate__btn:active{filter:brightness(.96)}
.gate__btn--lime{background:#c8ff00;color:#0a0a0a;margin-top:10px}
.gate__btn--ghost{background:#1d1d1d;color:#f6f6f4;border:1px solid #323232}
.gate__input{width:100%;background:#0a0a0a;border:1px solid #323232;border-radius:11px;color:#f6f6f4;font-size:13px;padding:12px;outline:none;margin-bottom:10px;font-family:monospace}
.gate__input:focus{border-color:#c8ff00}
.gate__err{color:#ff5b5b;font-size:12.5px;margin-top:12px}
.gate__help{font-size:11px;color:#5e5e5a;margin-top:14px;line-height:1.5}
.gate__help a{color:#c8ff00}
.gate__user{display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:18px}
.gate__avatar{width:34px;height:34px;border-radius:50%}
.gate__email{font-size:13px;color:#9b9b97}
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

// ---------- login screen ----------
function LoginScreen({ onGoogle, error }) {
  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__logo">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round">
            <path d="M3 12h2M19 12h2M7 9v6M17 9v6M9 12h6"/>
          </svg>
        </div>
        <div className="gate__title">IRONLOG</div>
        <div className="gate__sub">Sign in to sync your workouts. Your data is saved to your GitHub repo.</div>
        <button className="gate__btn" onClick={onGoogle}><GoogleIcon /> Continue with Google</button>
        {error && <div className="gate__err">{error}</div>}
      </div>
    </div>
  );
}

// ---------- GitHub token setup ----------
function TokenSetup({ user, onSave, onSignOut, error }) {
  const [val, setVal] = aUseState("");
  const { owner, repo } = ghCfg();
  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__user">
          {user.photoURL && <img className="gate__avatar" src={user.photoURL} alt="" />}
          <span className="gate__email">{user.email}</span>
        </div>
        <div className="gate__title" style={{ fontSize: 18 }}>CONNECT GITHUB</div>
        <div className="gate__sub">Paste a GitHub token with <b>Contents</b> read/write access to <b>{owner}/{repo}</b>. Stored only in this browser.</div>
        <input className="gate__input" type="password" placeholder="ghp_… or github_pat_…" value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="gate__btn gate__btn--lime" onClick={() => onSave(val.trim())} disabled={!val.trim()}>Save & continue</button>
        <button className="gate__btn gate__btn--ghost" style={{ marginTop: 10 }} onClick={onSignOut}>Sign out</button>
        {error && <div className="gate__err">{error}</div>}
        <div className="gate__help">
          Create one at <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener">github.com/settings/tokens</a> →
          Fine-grained token → Repository access: only <b>{repo}</b> → Permissions → Contents: Read and write.
        </div>
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

// ---------- sync badge ----------
function SyncBadge({ status }) {
  if (!status) return null;
  const err = status === "error";
  const label = err ? "Sync failed — retrying" : status === "saving" ? "Saving to GitHub…" : "Synced";
  return (
    <div className={"synbadge" + (err ? " synbadge--err" : "")} style={{ opacity: status === "saved" ? 0 : 1 }}>
      <span className="synbadge__dot" />{label}
    </div>
  );
}

// ============================================================ ROOT GATE
function RootGate() {
  const [phase, setPhase] = aUseState("init"); // init | login | token | loading | ready
  const [user, setUser] = aUseState(null);
  const [error, setError] = aUseState("");
  const [syncStatus, setSyncStatus] = aUseState(null);
  const shaRef = aUseRef(null);
  const saveTimer = aUseRef(null);

  // inject styles once
  aUseEffect(() => {
    if (document.getElementById("gate-css")) return;
    const s = document.createElement("style"); s.id = "gate-css"; s.textContent = GATE_CSS;
    document.head.appendChild(s);
  }, []);

  // watch auth state
  aUseEffect(() => {
    const auth = initFirebase();
    if (!auth) { setError("Firebase not configured — edit config.jsx"); setPhase("login"); return; }
    return auth.onAuthStateChanged((u) => {
      if (!u) { setUser(null); setPhase("login"); return; }
      setUser(u);
      if (!ghToken()) { setPhase("token"); return; }
      bootstrap(u);
    });
  }, []);

  // load cloud data, seed localStorage, then mount the app
  const bootstrap = async (u) => {
    setPhase("loading"); setError("");
    try {
      const { data, sha } = await cloudLoad(u.uid);
      shaRef.current = sha;
      if (data) {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
      } else {
        // first login on this account: push whatever is local (or default) up
        const local = localStorage.getItem(STORE_KEY);
        if (local) shaRef.current = await cloudSave(u.uid, JSON.parse(local), null);
      }
      installCloudSave(u.uid);
      setPhase("ready");
    } catch (e) {
      setError(e.message + " — check the token's repo permissions.");
      setPhase("token");
    }
  };

  // expose a debounced cloud-saver that useStore() calls on every change
  const installCloudSave = (uid) => {
    window.__cloudSave = (state) => {
      clearTimeout(saveTimer.current);
      setSyncStatus("saving");
      saveTimer.current = setTimeout(async () => {
        try {
          shaRef.current = await cloudSave(uid, state, shaRef.current);
          setSyncStatus("saved");
        } catch (e) {
          setSyncStatus("error");
        }
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

  const saveToken = (tok) => {
    localStorage.setItem(GH_TOKEN_KEY, tok);
    if (user) bootstrap(user);
  };

  const signOut = async () => {
    window.__cloudSave = null;
    localStorage.removeItem(GH_TOKEN_KEY);
    localStorage.removeItem(STORE_KEY);
    const auth = initFirebase();
    if (auth) await auth.signOut();
  };
  window.__signOut = signOut; // let settings panel reach it

  if (phase === "login" || phase === "init") return <LoginScreen onGoogle={signInGoogle} error={error} />;
  if (phase === "token") return <TokenSetup user={user} onSave={saveToken} onSignOut={signOut} error={error} />;
  if (phase === "loading") return <Loading msg="Loading your data from GitHub…" />;
  return (
    <React.Fragment>
      <SyncBadge status={syncStatus} />
      <App />
    </React.Fragment>
  );
}

window.RootGate = RootGate;
