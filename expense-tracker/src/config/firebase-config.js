// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYy4E3sxFyoZWUq1RJXnWVk--3h5R-DPI",
  authDomain: "expense-tracker-7ca23.firebaseapp.com",
  projectId: "expense-tracker-7ca23",
  storageBucket: "expense-tracker-7ca23.appspot.com",
  messagingSenderId: "951996627372",
  appId: "1:951996627372:web:986831016a6510e8ef2209",
  measurementId: "G-KEXVPS3D6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ These are the three exports your app is expecting
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export them so other files can import
export { app, auth, provider, db };

