import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { AppData } from './types';

export const firebaseConfig = {
  apiKey: "AIzaSyC-0bcnVFIADB_fcCiS8KIc0_ZWBl_k2i0",
  authDomain: "campeonatobrasileirao.firebaseapp.com",
  projectId: "campeonatobrasileirao",
  storageBucket: "campeonatobrasileirao.firebasestorage.app",
  messagingSenderId: "129919890031",
  appId: "1:129919890031:web:5ea9bba7c3984c1a4f139a"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error("Google login failed:", err);
    throw err;
  }
}

export async function logoutFirebase() {
  await signOut(auth);
}

export const DATA_DOC_ID = 'galo_brasileirao_v1';

export async function saveToFirestore(data: AppData, userId?: string) {
  try {
    const docRef = doc(db, 'brasileirao', userId || DATA_DOC_ID);
    await setDoc(docRef, {
      ...data,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    return false;
  }
}

export async function loadFromFirestore(userId?: string): Promise<AppData | null> {
  try {
    const docRef = doc(db, 'brasileirao', userId || DATA_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AppData;
    }
    return null;
  } catch (error) {
    console.error("Error loading from Firestore:", error);
    return null;
  }
}
