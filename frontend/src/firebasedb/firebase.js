// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgFtE6bRJU7WBptVoiilYju0Pvx1nIgzw",
  authDomain: "nobeeswax-439c7.firebaseapp.com",
  projectId: "nobeeswax-439c7",
  storageBucket: "nobeeswax-439c7.firebasestorage.app",
  messagingSenderId: "39620699023",
  appId: "1:39620699023:web:8058f7f3c3c8f81592a1fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Get firestore instance

export { db };
