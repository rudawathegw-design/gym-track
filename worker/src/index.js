// gym-track-api — Cloudflare Worker
// Lets Google-signed-in users save their gym data to the OWNER's GitHub repo.
// The owner's GitHub token lives only here (as a secret); browsers never see it.
//
// Flow: the browser sends its Firebase ID token (Bearer). We verify it against
// Google's public certs, derive the user's uid, then read/write
// <GH_PATH>/<uid>.json in the owner's repo via the GitHub Contents API.

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
  return payload; // { sub: uid, email, ... }
}

// ---- GitHub Contents API ----
function ghHeaders(env) {
  return {
    Authorization: `token ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "gym-track-api",
  };
}
function ghUrl(env, uid) {
  return `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${env.GH_PATH}/${uid}.json`;
}
const b64encode = (str) => btoa(unescape(encodeURIComponent(str)));
const b64decode = (b64) => decodeURIComponent(escape(atob(b64)));

async function ghLoad(env, uid) {
  const res = await fetch(`${ghUrl(env, uid)}?ref=${env.GH_BRANCH}`, { headers: ghHeaders(env) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub load ${res.status}`);
  const json = await res.json();
  return JSON.parse(b64decode(json.content));
}

async function ghSave(env, uid, state) {
  // fetch current sha (if the file exists) so we can update it
  let sha = null;
  const cur = await fetch(`${ghUrl(env, uid)}?ref=${env.GH_BRANCH}`, { headers: ghHeaders(env) });
  if (cur.ok) sha = (await cur.json()).sha;
  const body = {
    message: `gym-track: update ${uid}`,
    content: b64encode(JSON.stringify(state, null, 2)),
    branch: env.GH_BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(ghUrl(env, uid), {
    method: "PUT",
    headers: { ...ghHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub save ${res.status}: ${await res.text()}`);
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
    if (url.pathname !== "/api/data") return json(env, { error: "Not found" }, 404);

    // authenticate
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
      if (request.method === "GET") {
        const data = await ghLoad(env, uid);
        return json(env, { data });
      }
      if (request.method === "PUT") {
        const state = await request.json();
        await ghSave(env, uid, state);
        return json(env, { ok: true });
      }
    } catch (e) {
      return json(env, { error: e.message }, 502);
    }
    return json(env, { error: "Method not allowed" }, 405);
  },
};
