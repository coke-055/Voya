export function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${y}/${m}/${d}`
}

export function getDaysUntil(isoDate: string): number | null {
  if (!isoDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(isoDate)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff : null
}

export function getTripDuration(start: string, end: string): number {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1)
}

export function isFutureDate(isoDate: string): boolean {
  if (!isoDate) return false
  const today = new Date().toISOString().slice(0, 10)
  return isoDate > today
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
