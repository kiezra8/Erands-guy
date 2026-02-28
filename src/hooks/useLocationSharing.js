/**
 * useLocationSharing
 *
 * A hook that:
 *  1. Asks the user for GPS permission
 *  2. Continuously broadcasts their position to Firestore at
 *     orders/{orderId}/{field}  e.g. customerLocation / riderLocation
 *  3. Listens to the partner's position in real-time via onSnapshot
 *
 * Returns { myPos, partnerPos, permissionState, error }
 */
import { useState, useEffect, useRef } from 'react'
import { doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function useLocationSharing(orderId, myField, partnerField) {
    const [myPos, setMyPos] = useState(null)
    const [partnerPos, setPartnerPos] = useState(null)
    const [permissionState, setPermissionState] = useState('prompt') // 'prompt'|'granted'|'denied'
    const [error, setError] = useState(null)
    const watchIdRef = useRef(null)
    const enabled = !!orderId

    // ── Broadcast my position ──────────────────────────────────────
    useEffect(() => {
        if (!enabled) return

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.')
            setPermissionState('denied')
            return
        }

        const options = { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords
                const pos = [latitude, longitude]
                setMyPos(pos)
                setPermissionState('granted')

                try {
                    await updateDoc(doc(db, 'orders', orderId), {
                        [myField]: { lat: latitude, lng: longitude, accuracy, updatedAt: serverTimestamp() },
                    })
                } catch (e) {
                    // Order doc may not exist yet — ignore write errors silently
                }
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionState('denied')
                    setError('Location permission denied. Please allow location access to enable live tracking.')
                } else {
                    setError(`Location error: ${err.message}`)
                }
            },
            options
        )

        return () => {
            if (watchIdRef.current != null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
            }
        }
    }, [orderId, myField])

    // ── Listen to partner's position ───────────────────────────────
    useEffect(() => {
        if (!enabled) return
        const unsub = onSnapshot(doc(db, 'orders', orderId), (snap) => {
            if (!snap.exists()) return
            const data = snap.data()
            const p = data[partnerField]
            if (p?.lat != null) setPartnerPos([p.lat, p.lng])
        })
        return unsub
    }, [orderId, partnerField])

    return { myPos, partnerPos, permissionState, error }
}
