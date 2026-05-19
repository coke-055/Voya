import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Trip } from '../types'

interface TripStore {
  trips: Trip[]
  addTrip: (trip: Omit<Trip, 'id'>) => void
  updateTrip: (id: string, updates: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  importTrips: (trips: Omit<Trip, 'id'>[]) => void
}

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      trips: [],

      addTrip: (trip) =>
        set((state) => ({
          trips: [
            ...state.trips,
            { ...trip, id: `trip-${Date.now()}-${Math.random().toString(36).slice(2)}` },
          ],
        })),

      updateTrip: (id, updates) =>
        set((state) => ({
          trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
        })),

      importTrips: (newTrips) =>
        set((state) => ({
          trips: [
            ...state.trips,
            ...newTrips.map((t) => ({
              ...t,
              id: `trip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            })),
          ],
        })),
    }),
    {
      name: 'voya-trips',
      // Sync to file immediately on app startup (so Electron widget gets data right away)
      onRehydrateStorage: () => (state) => {
        if (state?.trips) {
          fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.trips),
          }).catch(() => {})
        }
      },
    }
  )
)

// Also sync on every change (add / edit / delete)
useTripStore.subscribe((state) => {
  fetch('/api/trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.trips),
  }).catch(() => {})
})

export const getVisitedCities = (trips: Trip[]): Set<string> => {
  const today = new Date().toISOString().slice(0, 10)
  const visited = new Set<string>()
  trips
    .filter((t) => t.endDate <= today)
    .forEach((t) => t.cities.forEach((c) => visited.add(c)))
  return visited
}

export const getFutureTrips = (trips: Trip[]): Trip[] => {
  const today = new Date().toISOString().slice(0, 10)
  return trips
    .filter((t) => t.startDate > today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export const getPastTrips = (trips: Trip[]): Trip[] => {
  const today = new Date().toISOString().slice(0, 10)
  return trips
    .filter((t) => t.endDate <= today)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
}
