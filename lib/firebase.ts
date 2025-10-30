// Client-side Firebase initialization
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCAMYizegsxVcvvrxdKL30eAdALwO-Oiko",
  authDomain: "design-comp-6a7ac.firebaseapp.com",
  projectId: "design-comp-6a7ac",
  storageBucket: "design-comp-6a7ac.firebasestorage.app",
  messagingSenderId: "908124423871",
  appId: "1:908124423871:web:a886750ca563ad5463a80a",
  measurementId: "G-5JKB8HPB91",
};

// Initialize Firebase (guard for hot reloads / multiple inits)
let app: FirebaseApp;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  app = initializeApp(firebaseConfig);
}

// Expose Auth and Analytics
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics can only run in browser environments
export function initAnalytics() {
  try {
    if (typeof window !== "undefined") {
      return getAnalytics(app);
    }
  } catch (e) {
    // ignore if analytics not available in the environment
  }
  return null;
}

export default app;
