// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi8DMHhttuUlsF4sh243Ms9u5f91cY0Ik",
  authDomain: "sorubil-118d2.firebaseapp.com",
  databaseURL: "https://sorubil-118d2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sorubil-118d2",
  storageBucket: "sorubil-118d2.appspot.com",
  messagingSenderId: "962255890657",
  appId: "1:962255890657:web:d8959004786dc4b604efa0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database, app }; 7