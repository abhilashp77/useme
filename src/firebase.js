import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    projectId: "useme-driver-app",
    appId: "1:531405665149:web:27a9e457e390109b099214",
    storageBucket: "useme-driver-app.firebasestorage.app",
    apiKey: "AIzaSyCsla03SRzyoT8vtfsjVosw5ggC3HFuF64",
    authDomain: "useme-driver-app.firebaseapp.com",
    messagingSenderId: "531405665149",
    measurementId: "G-RQEEMD1PT4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
