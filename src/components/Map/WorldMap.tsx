import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import FogOverlay from './FogOverlay'
import { City } from '../../types'
import { CITIES } from '../../data/cities'
import { useTripStore, getVisitedCities, getFutureTrips } from '../../store/useTripStore'
import { getDaysUntil } from '../../utils/dateUtils'

// Fix Leaflet default icon issue with Vite
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// CartoDB Voyager — standard colorful map (fog effect visible on light backgrounds)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

interface Props {
  onMapClick?: (lat: number, lng: number) => void
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Gray pin icon for upcoming trips
const futurePinIcon = (daysUntil: number | null) => L.divIcon({
  className: '',
  html: `<div style="position:relative;width:28px;height:36px">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="34" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.45))">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#94a3b8" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
      <circle cx="12" cy="9" r="2.5" fill="rgba(255,255,255,0.85)"/>
    </svg>
    ${daysUntil !== null ? `<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#64748b;color:#fff;font-size:9px;font-weight:700;padding:1px 4px;border-radius:6px;white-space:nowrap;border:1px solid rgba(255,255,255,0.3)">${daysUntil === 0 ? '今天' : `${daysUntil}天`}</div>` : ''}
  </div>`,
  iconSize: [28, 36],
  iconAnchor: [14, 34],
})

// Red pulsing marker for current GPS location
const myLocationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:20px;height:20px">
    <div style="position:absolute;inset:0;border-radius:50%;background:rgba(239,68,68,0.25);animation:pulse 1.8s ease-out infinite"></div>
    <div style="position:absolute;inset:4px;border-radius:50%;background:#ef4444;border:2px solid #fff;box-shadow:0 0 8px rgba(239,68,68,0.8)"></div>
    <style>@keyframes pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.4);opacity:0}}</style>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

export default function WorldMap({ onMapClick }: Props) {
  const trips = useTripStore((s) => s.trips)
  const visitedCityNames = getVisitedCities(trips)
  const visitedCities: City[] = CITIES.filter((c) => visitedCityNames.has(c.name))
  const futureTrips = getFutureTrips(trips)
  const [map, setMap] = useState<L.Map | null>(null)
  const [myPos, setMyPos] = useState<[number, number] | null>(null)

  // Fly to user's current location + show red dot
  useEffect(() => {
    if (!map) return
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        map.setView([lat, lng], 6)
        setMyPos([lat, lng])
      },
      () => {}
    )
  }, [map])

  return (
    <MapContainer
      center={[20, 20]}
      zoom={3}
      minZoom={2}
      maxZoom={16}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
      worldCopyJump={true}
      ref={setMap}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
      {map && <FogOverlay map={map} visitedCities={visitedCities} />}
      <MapClickHandler onMapClick={onMapClick} />

      {/* Current location red dot */}
      {myPos && (
        <Marker position={myPos} icon={myLocationIcon}>
          <Popup className="fog-popup">
            <div className="text-sm font-medium">📍 你目前的位置</div>
          </Popup>
        </Marker>
      )}

      {/* City markers for visited cities */}
      {visitedCities.map((city) => (
        <Marker
          key={city.name}
          position={[city.lat, city.lng]}
          icon={L.divIcon({
            className: '',
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#60a5fa" stroke="#fff" stroke-width="1.2"/>
              <circle cx="12" cy="9" r="2.5" fill="#fff"/>
            </svg>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
          })}
        >
          <Popup className="fog-popup">
            <div className="text-sm font-medium">{city.nameZh}</div>
            <div className="text-xs text-gray-400">{city.name}, {city.country}</div>
          </Popup>
        </Marker>
      ))}

      {/* Gray markers for upcoming / future trips */}
      {futureTrips.flatMap((trip) => {
        // Collect distinct city positions for this trip
        const cities = trip.cities
          .map((name) => CITIES.find((c) => c.name === name))
          .filter((c): c is City => !!c)
        // Fallback to any city in the country
        if (cities.length === 0) {
          const fallback = CITIES.find((c) => c.countryCode === trip.countryCode)
          if (fallback) cities.push(fallback)
        }
        const daysUntil = getDaysUntil(trip.startDate)
        return cities.map((city) => (
          <Marker
            key={`future-${trip.id}-${city.name}`}
            position={[city.lat, city.lng]}
            icon={futurePinIcon(daysUntil)}
          >
            <Popup className="fog-popup">
              <div className="text-sm font-medium">{trip.title}</div>
              <div className="text-xs text-gray-400">{city.nameZh} · {trip.startDate}</div>
              {daysUntil !== null && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {daysUntil === 0 ? '今天出發！' : `${daysUntil} 天後出發`}
                </div>
              )}
            </Popup>
          </Marker>
        ))
      })}
    </MapContainer>
  )
}
