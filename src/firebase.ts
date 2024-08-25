import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpLONM68rGLx6S3CpgasmLDXwIAm6RJCo",
  authDomain: "community-type.firebaseapp.com",
  projectId: "community-type",
  storageBucket: "community-type.appspot.com",
  messagingSenderId: "305389549313",
  appId: "1:305389549313:web:765ab825fc9eac450a4d00",
  measurementId: "G-0RR7JP9CKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app)
export const db = getFirestore(app)
