import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4VeBH9ljMMptBJTWFKiHDB_vQPnd7ADI",
    authDomain: "voluntariados-app.firebaseapp.com",
    projectId: "voluntariados-app",
    storageBucket: "voluntariados-app.firebasestorage.app",
    messagingSenderId: "789999672240",
    appId: "1:789999672240:web:408b9f7ca46e874bbed475",
    measurementId: "G-35EXFETM4G"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };

