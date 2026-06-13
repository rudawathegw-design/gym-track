# IRONLOG — Gym Tracker

A static (no-build) React gym tracker. Each user signs in with **Google** and
their workout data is saved to a **GitHub repo** (committed + pushed
automatically via the GitHub Contents API).

## How it works

- **Login** — Firebase Authentication (Google provider).
- **Storage** — on every change the full app state is written to
  `data/<uid>.json` in your data repo. Loading on sign-in reads it back.
- **No server** — runs as a static site (GitHub Pages). The GitHub token lives
  only in the user's browser `localStorage`; it is never committed.

## Setup

### 1. Firebase (Google login)
1. Create a project at <https://console.firebase.google.com>.
2. **Build → Authentication → Sign-in method →** enable **Google**.
3. **Project settings → Your apps → Web app** → copy the config.
4. **Authentication → Settings → Authorized domains** → add `localhost` and your
   GitHub Pages domain (e.g. `yourname.github.io`).
5. Paste the values into [`config.jsx`](config.jsx) under `firebase`.

### 2. GitHub data repo
1. Create a repo to hold the data (private recommended), e.g. `gym-track-data`.
2. Put its `owner` / `repo` / `branch` / `path` into [`config.jsx`](config.jsx)
   under `github`.
3. Each user, on first login, pastes a **fine-grained Personal Access Token**
   with **Contents: Read and write** scoped to that repo
   (<https://github.com/settings/tokens?type=beta>).

### 3. Run / deploy
- **Locally:** serve the folder (login popups need http, not `file://`):
  ```bash
  python -m http.server 8000   # then open http://localhost:8000/Gym%20Tracker.html
  ```
- **GitHub Pages:** push this repo, then **Settings → Pages → Deploy from
  branch → main**. Rename `Gym Tracker.html` to `index.html` (or add a redirect)
  for a clean URL.

## Files
| File | Purpose |
|------|---------|
| `Gym Tracker.html` | Entry point, styles, script loader |
| `config.jsx` | Firebase + GitHub settings (fill in) |
| `auth-cloud.jsx` | Login gate + GitHub load/save |
| `app.jsx` | App root, state store |
| `views.jsx`, `ui.jsx`, `charts.jsx`, `data.jsx`, `anatomy.jsx`, `i18n.jsx`, `tweaks-panel.jsx` | UI + data |
