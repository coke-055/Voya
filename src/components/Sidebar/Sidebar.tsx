import { useState } from 'react'
import { Plus, Globe, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useTripStore, getFutureTrips, getPastTrips } from '../../store/useTripStore'
import { Trip } from '../../types'
import TripCard from './TripCard'

interface Props {
  onAddTrip: () => void
  onEditTrip: (trip: Trip) => void
  onOpenHidden: () => void
}

export default function Sidebar({ onAddTrip, onEditTrip, onOpenHidden }: Props) {
  const trips = useTripStore((s) => s.trips)
  const deleteTrip = useTripStore((s) => s.deleteTrip)
  const [showPast, setShowPast] = useState(true)

  const futureTrips = getFutureTrips(trips)
  const pastTrips = getPastTrips(trips)

  const countriesVisited = new Set(pastTrips.map((t) => t.countryCode)).size
  const citiesVisited = new Set(pastTrips.flatMap((t) => t.cities)).size

  return (
    <div className="relative flex flex-col h-full bg-gray-950/95 backdrop-blur-md border-l border-white/10 w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-blue-400" />
          <span className="font-bold text-white text-lg">Voya</span>
        </div>
        <button
          onClick={onAddTrip}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={15} />
          新增行程
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b border-white/10">
        <StatCard label="造訪國家" value={countriesVisited} emoji="🌍" />
        <StatCard label="造訪城市" value={citiesVisited} emoji="🏙️" />
        <StatCard label="歷史行程" value={pastTrips.length} emoji="✈️" />
        <StatCard label="即將出發" value={futureTrips.length} emoji="🗓️" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {/* Future trips */}
        {futureTrips.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">即將出發</span>
              <span className="text-xs text-blue-500 bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                {futureTrips.length}
              </span>
            </div>
            <div className="space-y-3">
              {futureTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  isFuture
                  onEdit={onEditTrip}
                  onDelete={deleteTrip}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past trips */}
        {pastTrips.length > 0 && (
          <section>
            <button
              onClick={() => setShowPast((v) => !v)}
              className="flex items-center gap-2 mb-3 text-left w-full group"
            >
              <Globe size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-300">過去足跡</span>
              <span className="text-xs text-gray-500 bg-white/10 px-1.5 py-0.5 rounded-full">
                {pastTrips.length}
              </span>
              <span className="ml-auto text-gray-500 group-hover:text-gray-300 transition-colors">
                {showPast ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </button>
            {showPast && (
              <div className="space-y-3">
                {pastTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onEdit={onEditTrip}
                    onDelete={deleteTrip}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {trips.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Globe size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">還沒有行程記錄</p>
            <p className="text-xs mt-1 text-gray-600">點擊「新增行程」開始記錄你的足跡</p>
          </div>
        )}
      </div>

      {/* Secret trigger — barely visible, hover to reveal */}
      <button
        onClick={onOpenHidden}
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-gray-900 hover:text-gray-700 transition-colors duration-500 select-none text-xs tracking-widest"
        tabIndex={-1}
        aria-hidden="true"
      >
        ···
      </button>
    </div>
  )
}

function StatCard({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 text-center">
      <div className="text-xl mb-0.5">{emoji}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  )
}
