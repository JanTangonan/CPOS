import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBRZkvDC-7t4K1CYeFK1LPd3jIJdcXRWFU",
    authDomain: "cpos-afc17.firebaseapp.com",
    projectId: "cpos-afc17",
    storageBucket: "cpos-afc17.firebasestorage.app",
    messagingSenderId: "759557425052",
    appId: "1:759557425052:web:44af75d5f31952e33a6a59",
    measurementId: "G-85FX17Z7XN"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };