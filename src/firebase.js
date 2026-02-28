import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: "AIzaSyBtBDImA3JxW6drta2qG8Kacx4lk7yG85M",
    authDomain: "erands-guy.firebaseapp.com",
    projectId: "erands-guy",
    storageBucket: "erands-guy.firebasestorage.app",
    messagingSenderId: "184159634431",
    appId: "1:184159634431:web:eebacb814be5f3bd2a1dca",
    measurementId: "G-D1QR5Z20SF"
}

// Primary app — used for the admin's own auth session
const app = initializeApp(firebaseConfig)

// Secondary app — used ONLY to create driver accounts
// This prevents signing out the admin when a new driver is created
const secondaryApp = initializeApp(firebaseConfig, 'Secondary')

export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const secondaryAuth = getAuth(secondaryApp)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// The one and only super-admin
export const ADMIN_EMAIL = 'israelezrakisakye@gmail.com'
