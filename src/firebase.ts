import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBhh9uO4VNNq1EGKV7OZgdqGH41bguPnCU",
  authDomain: "jobbiesarea-web.firebaseapp.com",
  projectId: "jobbiesarea-web",
  storageBucket: "jobbiesarea-web.firebasestorage.app",
  messagingSenderId: "676335569868",
  appId: "1:676335569868:web:35f8ca2f1cee55c169eb69"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication only (no firestore or storage)
export const auth = getAuth(app);
