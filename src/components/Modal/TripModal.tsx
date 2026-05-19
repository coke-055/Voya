import { useState, useEffect, useRef } from 'react'
import { X, Search, MapPin } from 'lucide-react'
import { Trip, City } from '../../types'
import { CITIES, COUNTRY_EMOJIS, searchCities } from '../../data/cities'
import { useTripStore } from '../../store/useTripStore'
import { today } from '../../utils/dateUtils'
import FlightLookup from './FlightLookup'
import { FlightResult, isoToDate } from '../../utils/flightApi'

interface Props {
  trip?: Trip | null
  initialDates?: { startDate: string; endDate: string }
  initialCities?: string[]
  onClose: () => void
}

const EMOJI_OPTIONS = ['✈️', '🏖️', '🏔️', '🏯', '🗼', '🎡', '🌸', '🍜', '🎿', '🤿', '🛳️', '🚂']

const DEFAULT_FORM = {
  title: '',
  startDate: today(),
  endDate: today(),
  country: '',
  countryCode: '',
  cities: [] as string[],
  notes: '',
  coverEmoji: '✈️',
}

// Country code → Chinese name
const COUNTRY_ZH: Record<string, string> = {
  JP: '日本', KR: '韓國', CN: '中國', HK: '香港', MO: '澳門', TW: '台灣',
  TH: '泰國', VN: '越南', SG: '新加坡', MY: '馬來西亞', ID: '印尼',
  PH: '菲律賓', MM: '緬甸', KH: '柬埔寨', LA: '寮國',
  IN: '印度', LK: '斯里蘭卡', NP: '尼泊爾',
  AE: '杜拜', QA: '卡達', TR: '土耳其', IL: '以色列',
  GB: '英國', FR: '法國', DE: '德國', NL: '荷蘭', BE: '比利時',
  CH: '瑞士', AT: '奧地利', CZ: '捷克', HU: '匈牙利', PL: '波蘭',
  IT: '義大利', ES: '西班牙', PT: '葡萄牙', GR: '希臘',
  DK: '丹麥', SE: '瑞典', NO: '挪威', FI: '芬蘭', IS: '冰島', IE: '愛爾蘭',
  RU: '俄羅斯',
  US: '美國', CA: '加拿大', MX: '墨西哥', BR: '巴西', AR: '阿根廷', PE: '秘魯',
  AU: '澳洲', NZ: '紐西蘭', FJ: '斐濟',
  EG: '埃及', ZA: '南非', KE: '肯亞', MA: '摩洛哥',
}

function autoTitle(startDate: string, countryCode: string): string {
  if (!startDate || !countryCode) return ''
  const yyyymm = startDate.replace(/-/g, '').slice(0, 6)
  const countryZh = COUNTRY_ZH[countryCode] ?? ''
  if (!countryZh) return ''
  return `${yyyymm} ${countryZh}之旅`
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function TripModal({ trip, initialDates, initialCities, onClose }: Props) {
  const addTrip   = useTripStore((s) => s.addTrip)
  const updateTrip = useTripStore((s) => s.updateTrip)

  const buildInitialForm = () => {
    const base = { ...DEFAULT_FORM, ...initialDates }
    if (initialCities && initialCities.length > 0) {
      const firstCity = CITIES.find((c) => c.name === initialCities[0])
      base.cities = initialCities
      if (firstCity) {
        base.country     = firstCity.country
        base.countryCode = firstCity.countryCode
        // Auto-generate title on first open
        base.title = autoTitle(base.startDate, firstCity.countryCode)
      }
    }
    return base
  }

  const [form, setForm]           = useState(buildInitialForm)
  const [citySearch, setCitySearch] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab]   = useState<'basic' | 'flight'>('basic')
  const searchRef = useRef<HTMLDivElement>(null)
  // Track whether user has manually edited the title
  const titleEditedRef = useRef(!!trip)

  useEffect(() => {
    if (trip) {
      setForm({
        title:       trip.title,
        startDate:   trip.startDate,
        endDate:     trip.endDate,
        country:     trip.country,
        countryCode: trip.countryCode,
        cities:      [...trip.cities],
        notes:       trip.notes,
        coverEmoji:  trip.coverEmoji,
      })
      titleEditedRef.current = true
    }
  }, [trip])

  useEffect(() => {
    if (!citySearch.trim()) { setCityResults([]); return }
    setCityResults(searchCities(citySearch).slice(0, 8))
  }, [citySearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-update title when date or countryCode changes (unless manually edited)
  const maybeUpdateTitle = (nextForm: typeof form) => {
    if (titleEditedRef.current) return nextForm
    const generated = autoTitle(nextForm.startDate, nextForm.countryCode)
    return generated ? { ...nextForm, title: generated } : nextForm
  }

  const addCity = (city: City) => {
    if (form.cities.includes(city.name)) return
    setForm((f) => maybeUpdateTitle({
      ...f,
      cities:      [...f.cities, city.name],
      country:     f.country     || city.country,
      countryCode: f.countryCode || city.countryCode,
    }))
    setCitySearch(''); setCityResults([]); setShowResults(false)
  }

  const removeCity = (name: string) =>
    setForm((f) => ({ ...f, cities: f.cities.filter((c) => c !== name) }))

  const handleFlightApply = (result: FlightResult, role: 'outbound' | 'return') => {
    if (role === 'outbound') {
      setForm((f) => {
        const next = {
          ...f,
          startDate:   isoToDate(result.departure.scheduled) || result.date,
          country:     result.arrival.city
            ? (CITIES.find((c) => c.countryCode === result.arrival.countryCode)?.country ?? f.country)
            : f.country,
          countryCode: result.arrival.countryCode || f.countryCode,
          cities:      result.matchedCityName && !f.cities.includes(result.matchedCityName)
            ? [...f.cities, result.matchedCityName]
            : f.cities,
        }
        if (!titleEditedRef.current) {
          const generated = autoTitle(next.startDate, next.countryCode)
          next.title = generated || f.title || `${result.arrival.cityZh}之旅`
        }
        return next
      })
    } else {
      setForm((f) => ({ ...f, endDate: isoToDate(result.arrival.scheduled) || result.date }))
    }
    setActiveTab('basic')
  }

  const handleSubmit = () => {
    if (!form.startDate || !form.endDate) return
    // If title still empty, use auto-generated or fallback
    const finalTitle = form.title.trim() || autoTitle(form.startDate, form.countryCode) || '未命名行程'
    const data = {
      ...form,
      title:       finalTitle,
      country:     form.country     || (form.cities.length > 0 ? (CITIES.find(c => c.name === form.cities[0])?.country ?? '') : ''),
      countryCode: form.countryCode || (form.cities.length > 0 ? (CITIES.find(c => c.name === form.cities[0])?.countryCode ?? '') : ''),
    }
    if (trip) updateTrip(trip.id, data)
    else addTrip(data)
    onClose()
  }

  const flag = COUNTRY_EMOJIS[form.countryCode] ?? ''

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">{trip ? '編輯行程' : '新增行程'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(['basic', 'flight'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'basic' ? '基本資訊' : '✈️ 班機查詢'}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {activeTab === 'basic' && (
            <>
              {/* Emoji + Title */}
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <label className="text-xs text-gray-400 mb-1.5 block">圖示</label>
                  <div className="flex flex-wrap gap-1.5 w-32">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setForm((f) => ({ ...f, coverEmoji: e }))}
                        className={`text-xl p-1 rounded-lg transition-all ${
                          form.coverEmoji === e ? 'bg-blue-600 scale-110' : 'hover:bg-white/10'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1.5 block">行程名稱</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      titleEditedRef.current = true
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }}
                    placeholder={autoTitle(form.startDate, form.countryCode) || '例：202509 日本關西之旅'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">出發日期 *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => {
                      const start = e.target.value
                      setForm((f) => maybeUpdateTitle({
                        ...f,
                        startDate: start,
                        endDate: f.endDate <= start ? addDays(start, 5) : f.endDate,
                      }))
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">返回日期 *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* City search */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={11} />
                  造訪城市
                  <span className="text-gray-600">（選擇後解鎖地圖霧效果）</span>
                  {flag && <span className="ml-auto">{flag} {form.country}</span>}
                </label>

                {form.cities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.cities.map((cityName) => {
                      const city = CITIES.find((c) => c.name === cityName)
                      return (
                        <span
                          key={cityName}
                          className="flex items-center gap-1.5 bg-blue-900/40 border border-blue-500/30 rounded-lg px-2.5 py-1 text-sm text-blue-200"
                        >
                          {city ? COUNTRY_EMOJIS[city.countryCode] ?? '🌍' : '🌍'}
                          {city?.nameZh ?? cityName}
                          <button
                            onClick={() => removeCity(cityName)}
                            className="text-blue-400 hover:text-red-400 transition-colors ml-0.5"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}

                <div className="relative" ref={searchRef}>
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => { setCitySearch(e.target.value); setShowResults(true) }}
                    onFocus={() => citySearch && setShowResults(true)}
                    placeholder="搜尋城市（中英文均可，例：芭達雅 / Pattaya）"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  {showResults && cityResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-white/15 rounded-xl overflow-hidden shadow-xl z-10">
                      {cityResults.map((city) => (
                        <button
                          key={city.name}
                          onMouseDown={() => addCity(city)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left"
                        >
                          <span className="text-base">{COUNTRY_EMOJIS[city.countryCode] ?? '🌍'}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-white">{city.nameZh}</span>
                            <span className="text-gray-400 text-xs ml-1.5">{city.name}</span>
                            <div className="text-xs text-gray-500">{city.country}</div>
                          </div>
                          {form.cities.includes(city.name) && (
                            <span className="text-blue-400 text-xs flex-shrink-0">已加入</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">備註</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="旅遊心得、亮點..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </>
          )}

          {activeTab === 'flight' && (
            <FlightLookup defaultDate={form.startDate} onApply={handleFlightApply} />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.startDate || !form.endDate}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {trip ? '儲存' : '新增'}
          </button>
        </div>
      </div>
    </div>
  )
}
