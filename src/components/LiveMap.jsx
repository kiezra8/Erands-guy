import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom colored markers
function createMarker(color, emoji) {
    return L.divIcon({
        className: '',
        html: `<div style="
      width:40px;height:40px;background:${color};
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:3px solid #fff;
      box-shadow:0 4px 20px rgba(0,0,0,0.4);
    "><span style="transform:rotate(45deg);font-size:16px">${emoji}</span></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
    })
}

const riderIcon = createMarker('#00E5A0', '🏍️')
const customerIcon = createMarker('#7C3AED', '📍')
const pickupIcon = createMarker('#F59E0B', '📦')

export default function LiveMap({
    center = [-0.3476, 32.5825], // Kampala, Uganda
    zoom = 13,
    riderPosition,
    customerPosition,
    pickupPosition,
    showRoute = false,
    height = '100%',
    onMapClick,
}) {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const riderMarkerRef = useRef(null)
    const customerMarkerRef = useRef(null)
    const pickupMarkerRef = useRef(null)
    const routeLineRef = useRef(null)

    useEffect(() => {
        if (mapInstanceRef.current) return

        const map = L.map(mapRef.current, {
            center,
            zoom,
            zoomControl: true,
            attributionControl: false,
        })

        // Dark map tiles (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(map)

        if (onMapClick) {
            map.on('click', (e) => onMapClick(e.latlng))
        }

        mapInstanceRef.current = map
        return () => {
            map.remove()
            mapInstanceRef.current = null
        }
    }, [])

    // Update rider marker
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map || !riderPosition) return
        if (riderMarkerRef.current) {
            riderMarkerRef.current.setLatLng(riderPosition)
        } else {
            riderMarkerRef.current = L.marker(riderPosition, { icon: riderIcon })
                .addTo(map)
                .bindPopup('<div style="color:#00E5A0;font-weight:700">🏍️ Rider</div>')
        }
    }, [riderPosition])

    // Update customer marker
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map || !customerPosition) return
        if (customerMarkerRef.current) {
            customerMarkerRef.current.setLatLng(customerPosition)
        } else {
            customerMarkerRef.current = L.marker(customerPosition, { icon: customerIcon })
                .addTo(map)
                .bindPopup('<div style="color:#A78BFA;font-weight:700">📍 You</div>')
        }
    }, [customerPosition])

    // Update pickup marker
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map || !pickupPosition) return
        if (pickupMarkerRef.current) {
            pickupMarkerRef.current.setLatLng(pickupPosition)
        } else {
            pickupMarkerRef.current = L.marker(pickupPosition, { icon: pickupIcon })
                .addTo(map)
                .bindPopup('<div style="color:#F59E0B;font-weight:700">📦 Pickup</div>')
        }
    }, [pickupPosition])

    // Draw route line
    useEffect(() => {
        const map = mapInstanceRef.current
        if (!map || !showRoute || !riderPosition || !customerPosition) return
        if (routeLineRef.current) { routeLineRef.current.remove() }
        routeLineRef.current = L.polyline(
            [riderPosition, customerPosition],
            { color: '#00E5A0', weight: 3, dashArray: '8 6', opacity: 0.8 }
        ).addTo(map)
    }, [showRoute, riderPosition, customerPosition])

    return (
        <div
            ref={mapRef}
            style={{ width: '100%', height, borderRadius: 'inherit' }}
        />
    )
}
