import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
  push,
  onValue,
} from 'firebase/database';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDxs8z0LdfzktRNysdFZhHpGYVLo-NcQuU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'active-cc357.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://active-cc357-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'active-cc357',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'active-cc357.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1066675537283',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1066675537283:web:1eb414f0b43823dddb62b6',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-HF7PTGBFP6',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.databaseURL &&
  !firebaseConfig.databaseURL.includes('your_project_id')
);

let app = null;
let db = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getDatabase(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    console.log('[Firebase]: Connected to Realtime Database and Auth.');
  } catch (err) {
    console.error('[Firebase Error]: Failed to initialize Firebase:', err);
  }
}

export {
  app,
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  ref,
  set,
  get,
  child,
  update,
  remove,
  push,
  onValue,
};
