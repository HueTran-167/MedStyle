import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBbp__VgZwPAqqPjMQeloCd_l45XerJkWc",
    authDomain: "medstyle052026.firebaseapp.com",
    projectId: "medstyle052026",
    storageBucket: "medstyle052026.firebasestorage.app",
    messagingSenderId: "682907843223",
    appId: "1:682907843223:web:ce9fbf9e86a0a1bc9187d2",
    measurementId: "G-4ZGBFYWH2C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);