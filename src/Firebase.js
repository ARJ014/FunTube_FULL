import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwZskPaZiAwEQXkQjeya1Jchn7u4aRlG8",
  authDomain: "funtube-2f35e.firebaseapp.com",
  projectId: "funtube-2f35e",
  storageBucket: "funtube-2f35e.appspot.com",
  messagingSenderId: "1056253933864",
  appId: "1:1056253933864:web:a3c331c0c82d3d4e57b81d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const GoogleProvider = new GoogleAuthProvider();

export default app;
