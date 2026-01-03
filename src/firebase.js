// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDuj_qSJ3tRrBpACh1AmQSMM4qAIArw3Zo",
    authDomain: "techxplorers-portfolios.firebaseapp.com",
    projectId: "techxplorers-portfolios",
    storageBucket: "techxplorers-portfolios.firebasestorage.app",
    messagingSenderId: "692330742262",
    appId: "1:692330742262:web:e639fee1de0d86a30747d7",
    measurementId: "G-30Z5Y2R7B0",
    databaseURL: "https://techxplorers-portfolios-default-rtdb.firebaseio.com/" // Added standard RTDB URL format based on project ID, will need verification
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth(app);