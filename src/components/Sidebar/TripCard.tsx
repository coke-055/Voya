import { Trip } from '../../types'
import { COUNTRY_EMOJIS } from '../../data/cities'
import { formatDate, getDaysUntil, getTripDuration } from '../../utils/dateUtils'
import { Pencil, Trash2, MapPin, Calendar } from 'lucide-react'

interface Props {
  trip: Trip
  isFuture?: boolean
  onEdit: (trip: Trip) => void
  onDelete: (id: string) => void
}

export default function TripCard({ trip, isFuture, onEdit, onDelete }: Props) {
  const flag = COUNTRY_EMOJIS[trip.countryCode] ?? '🌍'
  const duration = getTripDuration(trip.startDate, trip.endDate)
  const daysUntil = getDaysUntil(trip.startDate)

  return (
    <div
      className={`
        relative rounded-xl border p-4 transition-all duration-200
        ${isFuture
          ? 'border-blue-500/40 bg-blue-950/30 hover:bg-blue-950/50'
          : 'border-white/10 bg-white/5 hover:bg-white/8'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl flex-shrink-0">{trip.coverEmoji || flag}</span>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">{trip.title}</div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <MapPin size={10} className="flex-shrink-0" />
              <span className="truncate">{trip.country}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(trip)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="編輯"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(trip.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
            title="刪除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-400">
          <Calendar size={11} />
          <span>{formatDate(trip.startDate)}</span>
          <span>→</span>
          <span>{formatDate(trip.endDate)}</span>
        </div>
        <span className="text-gray-500">{duration} 天</span>
      </div>

      {trip.cities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {trip.cities.slice(0, 4).map((city) => (
            <span
              key={city}
              className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-xs"
            >
              {city}
            </span>
          ))}
          {trip.cities.length > 4 && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-xs">
              +{trip.cities.length - 4}
            </span>
          )}
        </div>
      )}

      {isFuture && daysUntil !== null && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-blue-500/30">
            {daysUntil === 0 ? '今天出發！' : `${daysUntil} 天後`}
          </div>
        </div>
      )}
    </div>
  )
}
