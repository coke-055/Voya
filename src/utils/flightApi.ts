import { getAirportByIATA } from '../data/airports'
import { CITIES } from '../data/cities'

export const FLIGHT_API_KEY_STORAGE = 'voya-aerodatabox-key'

export function getApiKey(): string {
  return localStorage.getItem(FLIGHT_API_KEY_STORAGE) ?? ''
}

export function saveApiKey(key: string) {
  localStorage.setItem(FLIGHT_API_KEY_STORAGE, key.trim())
}

export interface FlightResult {
  flightNumber: string
  airlineName: string
  date: string
  departure: {
    iata: string
    airportName: string
    city: string
    cityZh: string
    countryCode: string
    scheduled: string
  }
  arrival: {
    iata: string
    airportName: string
    city: string
    cityZh: string
    countryCode: string
    scheduled: string
  }
  matchedCityName?: string
}

// Normalise flight number: "CI 1" / "ci001" / "CI001" → "CI1"
export function normaliseFlightNumber(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '')
  const m = cleaned.match(/^([A-Z]{2})0*(\d{1,4}[A-Z]?)$/)
  if (m) return m[1] + m[2]
  return cleaned
}

export async function lookupFlight(
  flightNumber: string,
  date: string            // YYYY-MM-DD
): Promise<FlightResult> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_KEY')

  const iata = normaliseFlightNumber(flightNumber)

  // AeroDataBox — HTTPS supported on free plan, no proxy needed
  const url = `https://aerodatabox.p.rapidapi.com/flights/number/${iata}/${date}`

  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    },
  })

  let json: unknown
  try {
    json = await res.json()
  } catch {
    throw new Error(`HTTP ${res.status}`)
  }

  if (!res.ok) {
    const err = json as Record<string, unknown>
    const msg = String(err?.message ?? err?.error ?? `HTTP ${res.status}`)
    throw new Error(msg)
  }

  const data = json as AeroDataBoxFlight[]
  if (!Array.isArray(data) || data.length === 0) throw new Error('NOT_FOUND')

  const f = data[0]

  const depIata = f.departure?.airport?.iata ?? ''
  const arrIata = f.arrival?.airport?.iata ?? ''

  const depAirport = getAirportByIATA(depIata)
  const arrAirport = getAirportByIATA(arrIata)

  const matchedCity = arrAirport
    ? CITIES.find((c) => c.name === arrAirport.city || c.countryCode === arrAirport.countryCode)
    : undefined

  return {
    flightNumber: f.number ?? iata,
    airlineName:  f.airline?.name ?? '',
    date,
    departure: {
      iata:        depIata,
      airportName: f.departure?.airport?.name ?? depIata,
      city:        depAirport?.city ?? f.departure?.airport?.municipalityName ?? depIata,
      cityZh:      depAirport?.cityZh ?? f.departure?.airport?.municipalityName ?? depIata,
      countryCode: f.departure?.airport?.countryCode ?? depAirport?.countryCode ?? '',
      scheduled:   f.departure?.scheduledTime?.local ?? f.departure?.scheduledTime?.utc ?? '',
    },
    arrival: {
      iata:        arrIata,
      airportName: f.arrival?.airport?.name ?? arrIata,
      city:        arrAirport?.city ?? f.arrival?.airport?.municipalityName ?? arrIata,
      cityZh:      arrAirport?.cityZh ?? f.arrival?.airport?.municipalityName ?? arrIata,
      countryCode: f.arrival?.airport?.countryCode ?? arrAirport?.countryCode ?? '',
      scheduled:   f.arrival?.scheduledTime?.local ?? f.arrival?.scheduledTime?.utc ?? '',
    },
    matchedCityName: matchedCity?.name,
  }
}

// AeroDataBox response shape (partial)
interface AeroDataBoxAirport {
  iata: string
  name: string
  municipalityName?: string
  countryCode: string
}

interface AeroDataBoxEndpoint {
  airport: AeroDataBoxAirport
  scheduledTime?: {
    utc?: string    // "2026-09-23 00:05Z"
    local?: string  // "2026-09-23 08:05+08:00"
  }
}

interface AeroDataBoxFlight {
  number?: string
  airline?: { name: string; iata?: string }
  departure: AeroDataBoxEndpoint
  arrival:   AeroDataBoxEndpoint
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function isoToDate(iso: string): string {
  return iso.slice(0, 10)
}

export function isoToTime(iso: string): string {
  if (!iso) return ''
  // AeroDataBox local format: "2026-09-23 08:05+08:00" — normalise space → T
  const t = new Date(iso.replace(' ', 'T'))
  if (isNaN(t.getTime())) {
    // Fallback: extract HH:MM directly from string
    const m = iso.match(/\d{2}:\d{2}/)
    return m ? m[0] : ''
  }
  return t.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
}
