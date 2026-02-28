import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import {
    doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore'
import { auth, db, googleProvider, ADMIN_EMAIL } from '../firebase'

const AuthContext = createContext(null)

export function useAuth() {
    return useContext(AuthContext)
}

// ── determine role ──────────────────────────────────────────────
// Priority: Firestore user doc role → admin by email → customer
async function resolveRole(user) {
    if (!user) return null

    // Admin is always the hardcoded email
    if (user.email === ADMIN_EMAIL) return 'admin'

    // Check Firestore for assigned role
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (snap.exists()) {
        return snap.data().role || 'customer'
    }

    // First-time user → create customer doc
    await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'customer',
        createdAt: serverTimestamp(),
        status: 'active',
    })
    return 'customer'
}

// ── Provider ────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [role, setRole] = useState(null)  // 'admin' | 'driver' | 'customer'
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
            if (user) {
                const r = await resolveRole(user)
                setRole(r)
            } else {
                setRole(null)
            }
            setLoading(false)
        })
        return unsub
    }, [])

    // Sign in with Google
    async function loginWithGoogle() {
        const result = await signInWithPopup(auth, googleProvider)
        const r = await resolveRole(result.user)
        setRole(r)
        return { user: result.user, role: r }
    }

    // Email + password login
    async function loginWithEmail(email, password) {
        const result = await signInWithEmailAndPassword(auth, email, password)
        const r = await resolveRole(result.user)
        setRole(r)
        return { user: result.user, role: r }
    }

    // Register new customer
    async function registerCustomer(email, password, name) {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', result.user.uid), {
            email, name, role: 'customer', createdAt: serverTimestamp(), status: 'active',
        })
        setRole('customer')
        return result.user
    }

    async function logout() {
        await signOut(auth)
        setRole(null)
        setCurrentUser(null)
    }

    const value = {
        currentUser,
        role,
        loading,
        isAdmin: role === 'admin',
        isDriver: role === 'driver',
        isCustomer: role === 'customer',
        loginWithGoogle,
        loginWithEmail,
        registerCustomer,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
