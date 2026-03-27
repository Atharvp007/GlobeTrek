// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGjr82MmqWWR6Cy6wAhDPK8qJwAbKTi1Q",
  authDomain: "globetrek-3c993.firebaseapp.com",
  projectId: "globetrek-3c993",
  storageBucket: "globetrek-3c993.appspot.com",
  messagingSenderId: "687669658573",
  appId: "1:687669658573:web:881962bdbdbb4031cb3a84",
  measurementId: "G-JTE8BN382D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);