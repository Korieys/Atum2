
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDQdR4hv_P0El6ktGPzkQVwjExELDRX7dk",
    authDomain: "atum-42bac.firebaseapp.com",
    projectId: "atum-42bac",
    storageBucket: "atum-42bac.firebasestorage.app",
    messagingSenderId: "876800222364",
    appId: "1:876800222364:web:aedb63e7a7f56f4bf57959",
    measurementId: "G-EXJECQ8SRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code == 'unimplemented') {
        console.warn("The current browser does not support all of the features required to enable persistence");
    }
});
