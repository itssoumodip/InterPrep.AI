import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWEE-S8Rms2xdk4KBU15iLLj_aPAxda9s",
  authDomain: "interprepai.firebaseapp.com",
  projectId: "interprepai",
  storageBucket: "interprepai.firebasestorage.app",
  messagingSenderId: "209710326478",
  appId: "1:209710326478:web:be7a9316bcfa2c6d87e69f",
  measurementId: "G-TL7TF51NJV"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();;
export const auth = getAuth(app); 