import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsbQe0fsOcfWtJsw34Ior9RgdPxTO0A-8",
  authDomain: "just-cook-4a5ce.firebaseapp.com",
  projectId: "just-cook-4a5ce",
  storageBucket: "just-cook-4a5ce.appspot.com",
  messagingSenderId: "961222397814",
  appId: "1:961222397814:web:265b9dfe0d7a18e6023457",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const gmailProvider = new GoogleAuthProvider(app);

export const storage = getStorage(app);

export const signInWithGoogle = () =>
  signInWithPopup(auth, gmailProvider).catch((err) => err);

export const db = getFirestore(app);
