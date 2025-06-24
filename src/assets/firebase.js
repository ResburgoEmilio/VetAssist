import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB200_9MnOJrrGT3JcabdzYF4ZEgjMjP-A",
  authDomain: "veteprodemo.firebaseapp.com",
  projectId: "veteprodemo",
  storageBucket: "veteprodemo.appspot.com",
  messagingSenderId: "989394402465",
  appId: "1:989394402465:web:6db190bb7d9fa8a7d984e0",
  measurementId: "G-ZBRSQW5KM2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
