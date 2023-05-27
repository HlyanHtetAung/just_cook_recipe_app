import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_MESSAGING_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const gmailProvider = new GoogleAuthProvider(app);

export const storage = getStorage(app);

export const signInWithGoogle = () =>
  signInWithPopup(auth, gmailProvider).catch((err) => err);

export const db = getFirestore(app);
