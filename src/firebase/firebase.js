// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqzwKUSoVs4FB9PlxorR6y0wLy6LZJ85E",
  authDomain: "chatap-b6d99.firebaseapp.com",
  projectId: "chatap-b6d99",
  storageBucket: "chatap-b6d99.appspot.com",
  messagingSenderId: "366809527378",
  appId: "1:366809527378:web:c0e76c12b08ec530a15b8b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
