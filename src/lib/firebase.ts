import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_9CA4PNPw2woj2vKpBlSrUqqeZyYrWmU",
  authDomain: "voting-e7435.firebaseapp.com",
  projectId: "voting-e7435",
  storageBucket: "voting-e7435.firebasestorage.app",
  messagingSenderId: "973387624507",
  appId: "1:973387624507:web:da44a74917d7e5527dac1e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();