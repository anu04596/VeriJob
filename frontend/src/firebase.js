// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0nZHzMdEiSaoAcFy7WZvuvuRUugLXh-Q",
  authDomain: "verijob-5451b.firebaseapp.com",
  projectId: "verijob-5451b",
  storageBucket: "verijob-5451b.firebasestorage.app",
  messagingSenderId: "772267833146",
  appId: "1:772267833146:web:26e1f81b91e475d5814203",
  measurementId: "G-CGE5H8YZZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);