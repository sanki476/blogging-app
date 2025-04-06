// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzqEHF2SIagBATuHVWIiWvA5kR2oOL6VI",
  authDomain: "blogging-app-5fdff.firebaseapp.com",
  projectId: "blogging-app-5fdff",
  storageBucket: "blogging-app-5fdff.firebasestorage.app",
  messagingSenderId: "455169887133",
  appId: "1:455169887133:web:63b0e5470272752ad9bd74",
  measurementId: "G-L14WH9F00M"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // ✅

export { app, db, auth, storage };
