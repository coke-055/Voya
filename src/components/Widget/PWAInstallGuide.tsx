import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Monitor, ExternalLink, Chrome } from 'lucide-react'
import { useTripStore, getFutureTrips } from '../../store/useTripStore'
import { getDaysUntil } from '../../utils/dateUtils'
import { COUNTRY_EMOJIS } from '../../data/cities'

interface Props {
  onClose: () => void
}

const SKY_GRADIENTS = [
  'linear-gradient(135deg,#74b9e8 0%,#a8d8f0 45%,#deeef8 100%)',
  'linear-gradient(135deg,#5fa8d3 0%,#90c8e8 50%,#cce8f5 100%)',
  'linear-gradient(135deg,#82bfe6 0%,#b5d8f0 50%,#e0f0fa 100%)',
  'linear-gradient(135deg,#6aaddb 0%,#9ecbeb 50%,#d4eaf8 100%)',
]

function CloudSvg() {
  return (
    <svg
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 6, right: 6, width: 80, opacity: 0.18, pointerEvents: 'none' }}
    >
      <ellipse cx="100" cy="40" rx="80" ry="22" fill="white" />
      <ellipse cx="72"  cy="30" rx="44" ry="26" fill="white" />
      <ellipse cx="120" cy="28" rx="36" ry="24" fill="white" />
      <ellipse cx="148" cy="38" rx="30" ry="18" fill="white" />
    </svg>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold mt-0.5">
        {n}
      </div>
      <div className="text-xs text-gray-300 leading-relaxed">{children}</div>
    </div>
  )
}

export default function PWAInstallGuide({ onClose }: Props) {
  const trips = useTripStore((s) => s.trips)
  const futureTrips = getFutureTrips(trips)
  const [showInstall, setShowInstall] = useState(false)
  const [browser, setBrowser] = useState<'chrome' | 'edge'>('chrome')

  // Detect if already running as PWA standalone
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 border border-white/12 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">✈️</span>
            <span className="font-bold text-white">即將出發倒數</span>
            {futureTrips.length > 0 && (
              <span className="bg-blue-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {futureTrips.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">

          {/* ── Countdown cards ─────────────────────────────── */}
          {futureTrips.length === 0 ? (
            <div
              className="rounded-xl overflow-hidden p-5 text-center"
              style={{ background: SKY_GRADIENTS[0], position: 'relative' }}
            >
              <CloudSvg />
              <div className="text-3xl mb-2">✈️</div>
              <div className="text-sm font-bold text-[#1a2e4a]">創建你的日程吧！</div>
              <div className="text-xs text-[#3b5778] mt-1">在側邊欄新增即將出發的行程</div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {futureTrips.map((trip, idx) => {
                const d = getDaysUntil(trip.startDate) ?? 0
                const flag = trip.coverEmoji || COUNTRY_EMOJIS[trip.countryCode] || '🌍'
                const gradient = SKY_GRADIENTS[idx % SKY_GRADIENTS.length]

                return (
                  <div
                    key={trip.id}
                    className="rounded-xl overflow-hidden"
                    style={{ background: gradient, position: 'relative', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 72, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  >
                    <CloudSvg />
                    {/* Left */}
                    <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 190 }}>
                        {flag} {trip.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#3b5778', marginTop: 3 }}>{trip.startDate}</div>
                      {d === 0 && (
                        <span style={{ display: 'inline-block', marginTop: 4, background: 'rgba(239,68,68,0.14)', color: '#dc2626', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '1px 6px', border: '1px solid rgba(239,68,68,0.28)' }}>
                          今天出發！
                        </span>
                      )}
                    </div>
                    {/* Right */}
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                      {d > 1 ? (
                        <>
                          <span style={{ fontSize: 40, fontWeight: 900, color: '#1a2e4a', lineHeight: 1 }}>{d}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#3b5778', marginLeft: 2 }}>天</span>
                        </>
                      ) : d === 1 ? (
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#1a2e4a' }}>明天</span>
                      ) : (
                        <span style={{ fontSize: 26, lineHeight: 1 }}>✈️</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Desktop install section (collapsible) ─────── */}
          <div className="border border-white/8 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowInstall((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Monitor size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  {isStandalone ? '已安裝為桌面應用程式 ✓' : '安裝為桌面應用程式'}
                </span>
              </div>
              {showInstall ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
            </button>

            {showInstall && (
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/8">
                {isStandalone ? (
                  <div className="flex items-start gap-2 text-xs text-green-400 bg-green-900/20 rounded-lg p-3">
                    <span className="text-base leading-none">✓</span>
                    <span>Voya 已安裝成功！你現在看到的就是桌面應用程式版本。<br/>可直接把這個視窗移到桌面任意位置常駐使用。</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-400">安裝後以獨立視窗執行，不顯示瀏覽器工具列。</p>

                    {/* Browser tabs */}
                    <div className="flex gap-1">
                      {(['chrome', 'edge'] as const).map((b) => (
                        <button
                          key={b}
                          onClick={() => setBrowser(b)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${browser === b ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/8'}`}
                        >
                          {b === 'chrome' ? <Chrome size={12} /> : <span className="text-[12px] leading-none">𝒆</span>}
                          {b === 'chrome' ? 'Chrome' : 'Edge'}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {browser === 'chrome' ? (
                        <>
                          <Step n={1}>網址列右側點擊 <span className="bg-white/10 px-1 rounded font-mono">⊕ 安裝</span> 圖示</Step>
                          <Step n={2}>若未出現：點右上角 <span className="font-mono bg-white/10 px-1 rounded">⋮</span> → 「儲存並分享」→「安裝網頁為應用程式」</Step>
                          <Step n={3}>點「<span className="text-white font-semibold">安裝</span>」，Voya 出現在桌面與開始選單</Step>
                        </>
                      ) : (
                        <>
                          <Step n={1}>網址列右側點擊 <span className="bg-white/10 px-1 rounded font-mono">⊕ 應用程式可用</span> 圖示</Step>
                          <Step n={2}>若未出現：點右上角 <span className="font-mono bg-white/10 px-1 rounded">…</span> → 「應用程式」→「安裝此網站為應用程式」</Step>
                          <Step n={3}>點「<span className="text-white font-semibold">安裝</span>」，Voya 出現在工作列與開始選單</Step>
                        </>
                      )}
                    </div>
                  </>
                )}

                <a
                  href="/widget.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/6 transition-colors"
                >
                  <ExternalLink size={12} />
                  在新分頁開啟倒數日曆（獨立頁面）
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
