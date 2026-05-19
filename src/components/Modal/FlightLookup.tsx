import { useState } from 'react'
import { Search, ChevronRight, Key, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import {
  lookupFlight,
  normaliseFlightNumber,
  getApiKey,
  saveApiKey,
  isoToTime,
  FlightResult,
} from '../../utils/flightApi'
import { COUNTRY_EMOJIS } from '../../data/cities'

interface Props {
  defaultDate: string
  onApply: (result: FlightResult, role: 'outbound' | 'return') => void
}

type Status = 'idle' | 'loading' | 'ok' | 'error'

const ERROR_MSGS: Record<string, string> = {
  NO_KEY:     '尚未設定 RapidAPI Key，請先展開下方設定填入',
  NOT_FOUND:  '查無此航班，請確認航班號碼與日期是否正確',
  'HTTP 401': 'RapidAPI Key 無效，請確認後重試',
  'HTTP 403': 'RapidAPI Key 無效或未訂閱 AeroDataBox，請確認',
  'HTTP 429': '已超過免費方案每月 500 次查詢上限',
}

function friendlyError(raw: string): string {
  if (ERROR_MSGS[raw]) return ERROR_MSGS[raw]
  if (/invalid.*key|not.*subscribed|subscribe/i.test(raw)) return 'RapidAPI Key 無效或尚未訂閱 AeroDataBox'
  if (/limit|quota|exceed|rate/i.test(raw)) return '已超過查詢次數上限'
  if (/not found|no.*flight|empty/i.test(raw)) return '查無此航班，請確認航班號碼與日期'
  return `查詢失敗：${raw}`
}

export default function FlightLookup({ defaultDate, onApply }: Props) {
  const [flightNo, setFlightNo] = useState('')
  const [date, setDate] = useState(defaultDate)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<FlightResult | null>(null)
  const [error, setError] = useState('')
  const [showKeyPanel, setShowKeyPanel] = useState(!getApiKey())
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey())
  const [showKey, setShowKey] = useState(false)
  const [keySaved, setKeySaved] = useState(false)

  const handleSaveKey = () => {
    saveApiKey(apiKeyInput)
    setKeySaved(true)
    setShowKeyPanel(false)
    setTimeout(() => setKeySaved(false), 2000)
  }

  const handleSearch = async () => {
    if (!flightNo.trim() || !date) return
    setStatus('loading')
    setResult(null)
    setError('')
    try {
      const r = await lookupFlight(flightNo, date)
      setResult(r)
      setStatus('ok')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(friendlyError(msg))
      setStatus('error')
    }
  }

  const depFlag = result ? COUNTRY_EMOJIS[result.departure.countryCode] ?? '🛫' : ''
  const arrFlag = result ? COUNTRY_EMOJIS[result.arrival.countryCode] ?? '🛬' : ''
  const isFromTW = result?.departure.countryCode === 'TW'

  return (
    <div className="space-y-3">
      {/* Header row with API key toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-purple-300 flex items-center gap-1.5">
          ✈️ 班機自動帶入
        </span>
        <button
          onClick={() => setShowKeyPanel((v) => !v)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Key size={11} />
          {keySaved ? <span className="text-green-400">已儲存</span> : 'API Key'}
        </button>
      </div>

      {/* API Key panel */}
      {showKeyPanel && (
        <div className="bg-gray-800/60 border border-white/10 rounded-xl p-3 space-y-2">
          <p className="text-xs text-gray-400">
            使用{' '}
            <a
              href="https://rapidapi.com/aedbx-aedbx/api/aerodatabox"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              RapidAPI › AeroDataBox
            </a>{' '}
            免費訂閱（每月 500 次，支援台灣各大航司）
          </p>
          <p className="text-xs text-gray-500 mt-1">
            註冊 RapidAPI → 搜尋 AeroDataBox → 點 Subscribe → 複製 X-RapidAPI-Key
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="貼上你的 Access Key..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 pr-9"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <button
              onClick={handleSaveKey}
              disabled={!apiKeyInput.trim()}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm disabled:opacity-40 transition-colors"
            >
              儲存
            </button>
          </div>
        </div>
      )}

      {/* Search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={flightNo}
            onChange={(e) => setFlightNo(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="航班號碼，例：TR875、CI001、BR205"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={!flightNo.trim() || !date || status === 'loading'}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          {status === 'loading' ? <Loader size={14} className="animate-spin" /> : <Search size={14} />}
          查詢
        </button>
      </div>

      {/* Error */}
      {status === 'error' && (
        <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-900/20 rounded-xl p-3">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Result card */}
      {status === 'ok' && result && (
        <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-3">
          {/* Airline + flight number */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white">{result.flightNumber}</span>
              <span className="text-xs text-gray-400 ml-2">{result.airlineName}</span>
            </div>
            <CheckCircle size={16} className="text-green-400" />
          </div>

          {/* Route */}
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-xl">{depFlag}</div>
              <div className="text-sm font-semibold text-white">{result.departure.iata}</div>
              <div className="text-xs text-gray-400">{result.departure.cityZh}</div>
              <div className="text-xs text-purple-300 mt-0.5">{isoToTime(result.departure.scheduled)}</div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-0.5 text-gray-500">
              <div className="text-xs">✈️</div>
              <div className="w-full border-t border-dashed border-gray-700" />
              <div className="text-xs">{result.date}</div>
            </div>

            <div className="text-center">
              <div className="text-xl">{arrFlag}</div>
              <div className="text-sm font-semibold text-white">{result.arrival.iata}</div>
              <div className="text-xs text-gray-400">{result.arrival.cityZh}</div>
              <div className="text-xs text-purple-300 mt-0.5">{isoToTime(result.arrival.scheduled)}</div>
            </div>
          </div>

          {/* Apply buttons */}
          <div className="flex gap-2 pt-1">
            {isFromTW && (
              <button
                onClick={() => onApply(result, 'outbound')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                填入去程
                <ChevronRight size={13} />
              </button>
            )}
            {!isFromTW && (
              <button
                onClick={() => onApply(result, 'return')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                填入回程
                <ChevronRight size={13} />
              </button>
            )}
            {isFromTW && (
              <button
                onClick={() => onApply(result, 'return')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/10 hover:bg-white/15 text-gray-300 rounded-lg text-xs font-medium transition-colors"
              >
                填入回程日期
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
