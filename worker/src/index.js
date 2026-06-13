// gym-track-api — Cloudflare Worker
// Lets Google-signed-in users save their gym data to the OWNER's GitHub repo.
// The owner's GitHub token lives only here (as a secret); browsers never see it.
//
// Routes:
//   GET  /api/data         -> this user's data (data/<uid>.json)
//   PUT  /api/data         -> save this user's data (+ profiles/<uid>.json)
//   GET  /api/admin/users  -> owner only: every user's profile + summary stats

import { importX509, jwtVerify } from "jose";

// ---- Firebase ID token verification ----
let certCache = { keys: null, exp: 0 };

async function getCerts() {
  if (certCache.keys && Date.now() < certCache.exp) return certCache.keys;
  const res = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
  );
  const keys = await res.json();
  const cc = res.headers.get("cache-control") || "";
  const m = /max-age=(\d+)/.exec(cc);
  certCache = { keys, exp: Date.now() + (m ? +m[1] * 1000 : 3600_000) };
  return keys;
}

function b64urlJson(part) {
  return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
}

async function verifyIdToken(token, projectId) {
  const header = b64urlJson(token.split(".")[0]);
  const certs = await getCerts();
  const pem = certs[header.kid];
  if (!pem) throw new Error("Unknown signing key");
  const key = await importX509(pem, "RS256");
  const { payload } = await jwtVerify(token, key, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });
  if (!payload.sub) throw new Error("Token missing subject");
  return payload; // { sub: uid, email, name, picture, ... }
}

// ---- GitHub Contents API ----
function ghHeaders(env) {
  return {
    Authorization: `token ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "gym-track-api",
  };
}
function ghFileUrl(env, path) {
  return `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${path}`;
}
const b64encode = (str) => btoa(unescape(encodeURIComponent(str)));
const b64decode = (b64) => decodeURIComponent(escape(atob(b64)));

async function ghGet(env, path) {
  const res = await fetch(`${ghFileUrl(env, path)}?ref=${env.GH_BRANCH}`, { headers: ghHeaders(env) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} ${res.status}`);
  return res.json();
}
async function ghReadJson(env, path) {
  const f = await ghGet(env, path);
  return f ? JSON.parse(b64decode(f.content)) : null;
}
async function ghPut(env, path, obj, message) {
  const cur = await ghGet(env, path);
  const body = {
    message: message || `gym-track: update ${path}`,
    content: b64encode(JSON.stringify(obj, null, 2)),
    branch: env.GH_BRANCH,
  };
  if (cur && cur.sha) body.sha = cur.sha;
  const res = await fetch(ghFileUrl(env, path), {
    method: "PUT",
    headers: { ...ghHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path} ${res.status}: ${await res.text()}`);
}
async function ghList(env, dir) {
  const res = await fetch(`${ghFileUrl(env, dir)}?ref=${env.GH_BRANCH}`, { headers: ghHeaders(env) });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list ${dir} ${res.status}`);
  return res.json();
}

const dataPath = (env, uid) => `${env.GH_PATH}/${uid}.json`;
const profilePath = (uid) => `profiles/${uid}.json`;

// ---- summary stats from a user's state ----
function summarize(state) {
  const history = (state && state.history) || [];
  let totalVolume = 0, totalSets = 0, last = 0;
  history.forEach((s) => {
    if (s.date > last) last = s.date;
    (s.entries || []).forEach((e) => (e.sets || []).forEach((set) => {
      totalSets++;
      totalVolume += (set.reps || 0) * (set.kg || 0);
    }));
  });
  return { workouts: history.length, totalSets, totalVolume: Math.round(totalVolume), lastActive: last || null };
}

// ---- CORS ----
function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
function json(env, obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }
    const url = new URL(request.url);

    // authenticate (all routes require a valid Google sign-in)
    const auth = request.headers.get("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return json(env, { error: "Missing token" }, 401);
    let user;
    try {
      user = await verifyIdToken(token, env.FIREBASE_PROJECT_ID);
    } catch (e) {
      return json(env, { error: "Invalid token: " + e.message }, 401);
    }
    const uid = user.sub;

    try {
      // ----- admin: list all users (owner only) -----
      if (url.pathname === "/api/admin/users") {
        if (!env.ADMIN_EMAIL || user.email !== env.ADMIN_EMAIL) {
          return json(env, { error: "Forbidden" }, 403);
        }
        const files = await ghList(env, env.GH_PATH);
        const users = [];
        for (const f of files) {
          if (!f.name.endsWith(".json")) continue;
          const id = f.name.replace(/\.json$/, "");
          const [state, profile] = await Promise.all([
            ghReadJson(env, dataPath(env, id)),
            ghReadJson(env, profilePath(id)),
          ]);
          users.push({
            uid: id,
            email: profile?.email || null,
            name: profile?.name || null,
            picture: profile?.picture || null,
            ...summarize(state),
          });
        }
        users.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
        return json(env, { users });
      }

      // ----- per-user data -----
      if (url.pathname === "/api/data") {
        if (request.method === "GET") {
          const data = await ghReadJson(env, dataPath(env, uid));
          return json(env, { data });
        }
        if (request.method === "PUT") {
          const state = await request.json();
          await ghPut(env, dataPath(env, uid), state, `gym-track: data ${uid}`);
          // stamp who this uid is, so the owner can identify users
          await ghPut(env, profilePath(uid), {
            uid,
            email: user.email || null,
            name: user.name || null,
            picture: user.picture || null,
            updatedAt: Date.now(),
          }, `gym-track: profile ${uid}`);
          return json(env, { ok: true });
        }
        return json(env, { error: "Method not allowed" }, 405);
      }

      return json(env, { error: "Not found" }, 404);
    } catch (e) {
      return json(env, { error: e.message }, 502);
    }
  },
};
