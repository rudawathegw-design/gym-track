// config.jsx — frontend configuration.
// ----------------------------------------------------------------------------
// FIREBASE  — Google login (Authentication > Sign-in method > Google enabled).
// api       — the Cloudflare Worker (see /worker) that verifies the user's
//             Google login and saves their data to the OWNER's GitHub repo
//             as data/<uid>.json. The GitHub token lives only in the Worker
//             (as a secret); users never see or supply a token.
// ----------------------------------------------------------------------------
window.GT_CONFIG = {
  firebase: {
    apiKey: "AIzaSyAr__aXp-7BHxSzY6cW7O8amPb6US9C6lE",
    authDomain: "gym-track-59355-4dc9f.firebaseapp.com",
    projectId: "gym-track-59355-4dc9f",
    appId: "1:1081368853242:web:a64c6ce66b87d4b9d3a743",
  },
  // Backend Worker that holds the owner's GitHub token and saves each
  // Google-signed-in user's data to the owner's repo. Users never see a token.
  api: "https://gym-track-api.rudaw-a-the-gw.workers.dev",
  // Shows the Admin button in Settings for this account only (the Worker
  // enforces the real check server-side via ADMIN_EMAIL).
  adminEmail: "rudaw.a.the.gw@gmail.com",
};
