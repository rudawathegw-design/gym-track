// config.jsx — fill these in before deploying.
// ----------------------------------------------------------------------------
// 1) FIREBASE (Google login)
//    Console: https://console.firebase.google.com  -> create project
//    -> Build > Authentication > Sign-in method > enable "Google"
//    -> Project settings > Your apps > Web app -> copy the config object here.
//    -> Authentication > Settings > Authorized domains: add your GitHub Pages
//       domain (e.g. yourname.github.io) and localhost for testing.
//
// 2) GITHUB (where each user's data is committed)
//    Create a repo to hold the data (can be the SAME repo that hosts the site,
//    or a separate private one). Each user's data is written to
//    `<path>/<uid>.json` and committed+pushed automatically via the GitHub API.
//    Users supply their own fine-grained Personal Access Token at login
//    (scope: Contents read/write on that repo) — it is stored only in their
//    browser's localStorage and never committed.
// ----------------------------------------------------------------------------
window.GT_CONFIG = {
  firebase: {
    apiKey: "REPLACE_FIREBASE_API_KEY",
    authDomain: "REPLACE_PROJECT.firebaseapp.com",
    projectId: "REPLACE_PROJECT",
    appId: "REPLACE_APP_ID",
  },
  github: {
    owner: "rudawathegw-design", // repo owner
    repo: "gym-track-data",            // repo that stores user data
    branch: "main",
    path: "data",                      // folder inside the repo
  },
};
