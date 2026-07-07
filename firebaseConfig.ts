import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native"; // 📍 Import Platform to detect web vs mobile

const firebaseConfig = {
  apiKey: "AIzaSyBg4TdacUUmbuMQ9UnttM-naJYj9F4-nLk",
  authDomain: "sudoku-11e8f.firebaseapp.com",
  projectId: "sudoku-11e8f",
  storageBucket: "sudoku-11e8f.firebasestorage.app",
  messagingSenderId: "784201668466",
  appId: "1:784201668466:web:a54bd8c1a1e483c3d26feb",
  measurementId: "G-KDZ48K18RL"
};

const app = initializeApp(firebaseConfig);

// 📍 Fix the blank screen: Use standard web auth for browser, native persistence for mobile!
const auth = Platform.OS === "web" 
  ? getAuth(app) 
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

const db = getFirestore(app);

export { app, auth, db };