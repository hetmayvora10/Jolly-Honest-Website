import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeAuth, browserSessionPersistence, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

// Lazy by design: this must only run in the browser (inside useEffect/handlers),
// never at module scope, so builds don't require Firebase env vars to prerender.
//
// Session persistence instead of the default (IndexedDB, kept indefinitely):
// the admin's refresh token is dropped when the tab closes rather than
// lingering in long-lived storage on a shared shop computer. No popup/redirect
// resolver is loaded since the admin only signs in with email and password.
export function getClientAuth(): Auth {
  if (!authInstance) {
    authInstance = initializeAuth(getFirebaseApp(), {
      persistence: browserSessionPersistence,
    });
  }
  return authInstance;
}
