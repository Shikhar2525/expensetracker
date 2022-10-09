import { initializeApp } from "firebase/app";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx-0FsXdHDIzFoWYZ5fRTwsjGmpUz6vn4",
  authDomain: "expensetracker-3cb3c.firebaseapp.com",
  databaseURL: "https://expensetracker-3cb3c-default-rtdb.firebaseio.com",
  projectId: "expensetracker-3cb3c",
  storageBucket: "expensetracker-3cb3c.appspot.com",
  messagingSenderId: "353062338039",
  appId: "1:353062338039:web:6b602c954b09a0868482f2",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
