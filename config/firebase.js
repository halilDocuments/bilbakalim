// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi8DMHhttuUlsF4sh243Ms9u5f91cY0Ik",
  authDomain: "sorubil-118d2.firebaseapp.com",
  databaseURL: "https://sorubil-118d2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sorubil-118d2",
  storageBucket: "sorubil-118d2.firebasestorage.app",
  messagingSenderId: "962255890657",
  appId: "1:962255890657:web:d8959004786dc4b604efa0",
  measurementId: "G-SHEZJ7KFS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database
const database = getDatabase(app);

export { database };