import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyACvG5vSEv5r8SzL2a7aHj7SC0SQuxE-o0",
  authDomain: "placepulse-60cf4.firebaseapp.com",
  projectId: "placepulse-60cf4",
  storageBucket: "placepulse-60cf4.firebasestorage.app",
  messagingSenderId: "676436494658",
  appId: "1:676436494658:web:21e0ec8798d870e895a0db"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();