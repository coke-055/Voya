import { useRef, useState, useCallback, useEffect } from 'react'
import { X, GripHorizontal, Minimize2, Maximize2, Monitor } from 'lucide-react'
import { useTripStore, getFutureTrips } from '../../store/useTripStore'
import { getDaysUntil } from '../../utils/dateUtils'
import { COUNTRY_EMOJIS } from '../../data/cities'

interface Props {
  onClose: () => void
}

// Sky colour palette — each card gets one
const SKY_GRADIENTS = [
  'linear-gradient(135deg, #74b9e8 0%, #a8d8f0 45%, #deeef8 100%)',
  'linear-gradient(135deg, #5fa8d3 0%, #90c8e8 50%, #cce8f5 100%)',
  'linear-gradient(135deg, #82bfe6 0%, #b5d8f0 50%, #e0f0fa 100%)',
  'linear-gradient(135deg, #6aaddb 0%, #9ecbeb 50%, #d4eaf8 100%)',
]

function CloudSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      style={{ position: 'absolute', bottom: 8, right: 8, width: 90, opacity: 0.22, pointerEvents: 'none' }}
    >
      <ellipse cx="100" cy="40" rx="80" ry="22" fill="white" />
      <ellipse cx="72"  cy="30" rx="44" ry="26" fill="white" />
      <ellipse cx="120" cy="28" rx="36" ry="24" fill="white" />
      <ellipse cx="148" cy="38" rx="30" ry="18" fill="white" />
    </svg>
  )
}

export default function CountdownWidget({ onClose }: Props) {
  const trips = useTripStore((s) => s.trips)
  const futureTrips = getFutureTrips(trips)

  // ── Drag state ───────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ dragging: false, ox: 0, oy: 0 })
  const [pos, setPos] = useState({ x: 24, y: 80 })
  const [collapsed, setCollapsed] = useState(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { dragging: true, ox: e.clientX - pos.x, oy: e.clientY - pos.y }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return
      setPos({ x: e.clientX - dragRef.current.ox, y: e.clientY - dragRef.current.oy })
    }
    const up = () => { dragRef.current.dragging = false }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [])

  // ── Touch drag ───────────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    dragRef.current = { dragging: true, ox: t.clientX - pos.x, oy: t.clientY - pos.y }
  }, [pos])

  useEffect(() => {
    const move = (e: TouchEvent) => {
      if (!dragRef.current.dragging) return
      const t = e.touches[0]
      setPos({ x: t.clientX - dragRef.current.ox, y: t.clientY - dragRef.current.oy })
    }
    const up = () => { dragRef.current.dragging = false }
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => { window.removeEventListener('touchmove', move); window.removeEventListener('touchend', up) }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 1000,
        width: 300,
        userSelect: 'none',
        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))',
      }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15,23,42,0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: collapsed ? 14 : '14px 14px 0 0',
          padding: '8px 12px',
          gap: 6,
          border: '1px solid rgba(255,255,255,0.12)',
          borderBottom: collapsed ? undefined : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <GripHorizontal size={14} color="rgba(255,255,255,0.4)" />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✈️ 即將出發</span>
          {futureTrips.length > 0 && (
            <span style={{
              background: 'rgba(59,130,246,0.8)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 99,
              padding: '1px 6px',
            }}>
              {futureTrips.length}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => {
              window.open(
                '/widget.html',
                'voya-widget',
                'width=320,height=520,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes'
              )
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 2, display: 'flex' }}
            title="在獨立視窗開啟（可放桌面）"
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 2, display: 'flex' }}
            title={collapsed ? '展開' : '收合'}
          >
            {collapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 2, display: 'flex' }}
            title="關閉"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* ── Cards ──────────────────────────────────────────────────────────── */}
      {!collapsed && (
        <div style={{
          background: 'rgba(15,23,42,0.88)',
          backdropFilter: 'blur(8px)',
          borderRadius: '0 0 14px 14px',
          border: '1px solid rgba(255,255,255,0.12)',
          borderTop: 'none',
          overflow: 'hidden',
          maxHeight: 480,
          overflowY: 'auto',
          padding: '8px 10px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {futureTrips.length === 0 ? (
            <EmptyState />
          ) : (
            futureTrips.map((trip, idx) => {
              const daysUntil = getDaysUntil(trip.startDate) ?? 0
              const flag = trip.coverEmoji || COUNTRY_EMOJIS[trip.countryCode] || '🌍'
              const gradient = SKY_GRADIENTS[idx % SKY_GRADIENTS.length]
              return (
                <CountdownCard
                  key={trip.id}
                  title={trip.title}
                  date={trip.startDate}
                  flag={flag}
                  daysUntil={daysUntil}
                  gradient={gradient}
                />
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

// ── Single countdown card ──────────────────────────────────────────────────────
function CountdownCard({
  title, date, flag, daysUntil, gradient,
}: {
  title: string
  date: string
  flag: string
  daysUntil: number
  gradient: string
}) {
  const [d, m, y] = date.split('-').reverse() // YYYY-MM-DD → display
  const displayDate = `${date.slice(0,4)}-${date.slice(5,7)}-${date.slice(8,10)}`

  const label =
    daysUntil === 0 ? '今天出發！'
    : daysUntil === 1 ? '明天出發！'
    : `${daysUntil}`

  const unit = daysUntil > 1 ? '天' : ''

  return (
    <div style={{
      position: 'relative',
      borderRadius: 11,
      overflow: 'hidden',
      background: gradient,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 72,
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    }}>
      <CloudSvg />

      {/* Left side: emoji + text */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#1a2e4a',
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 160,
        }}>
          {flag} {title}
        </div>
        <div style={{ fontSize: 11, color: '#3b5778', marginTop: 3 }}>{displayDate}</div>
        {daysUntil === 0 && (
          <div style={{
            display: 'inline-block',
            marginTop: 4,
            background: 'rgba(239,68,68,0.15)',
            color: '#dc2626',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 6,
            padding: '1px 6px',
            border: '1px solid rgba(239,68,68,0.3)',
          }}>
            今天出發！
          </div>
        )}
      </div>

      {/* Right side: big countdown */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
        {daysUntil > 1 ? (
          <>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#1a2e4a', lineHeight: 1 }}>
              {daysUntil}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#3b5778', marginLeft: 2 }}>天</span>
          </>
        ) : daysUntil === 1 ? (
          <span style={{ fontSize: 18, fontWeight: 900, color: '#1a2e4a', lineHeight: 1 }}>明天</span>
        ) : (
          <span style={{ fontSize: 22, fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>🚀</span>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      borderRadius: 11,
      background: SKY_GRADIENTS[0],
      padding: '20px 16px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <CloudSvg />
      <div style={{ fontSize: 24, marginBottom: 6 }}>✈️</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a' }}>創建你的日程吧！</div>
      <div style={{ fontSize: 11, color: '#3b5778', marginTop: 3 }}>新增即將出發的行程</div>
    </div>
  )
}
