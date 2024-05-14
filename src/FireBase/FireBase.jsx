// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCayViKK8VTVud1EecTPeRJJ8Yoc55Vew0",
  authDomain: "reelflix-da99c.firebaseapp.com",
  projectId: "reelflix-da99c",
  storageBucket: "reelflix-da99c.appspot.com",
  messagingSenderId: "202310811714",
  appId: "1:202310811714:web:60af3afaae115fe5f46ddb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
