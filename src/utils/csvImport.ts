import * as XLSX from 'xlsx'
import { Trip } from '../types'
import { CITIES } from '../data/cities'

export interface ImportRow {
  title: string
  startDate: string
  endDate: string
  country: string
  cities: string[]
  notes: string
  coverEmoji: string
  _errors: string[]
}

// Canonical column names (accept Chinese or English headers)
const COL_MAP: Record<string, keyof Omit<ImportRow, '_errors'>> = {
  // Chinese
  '行程名稱': 'title', '名稱': 'title',
  '出發日期': 'startDate', '出發': 'startDate',
  '返回日期': 'endDate', '返回': 'endDate', '回台日期': 'endDate',
  '國家': 'country',
  '城市': 'cities',
  '備註': 'notes', '說明': 'notes',
  '圖示': 'coverEmoji',
  // English
  'title': 'title', 'name': 'title',
  'startdate': 'startDate', 'start': 'startDate', 'departure': 'startDate',
  'enddate': 'endDate', 'end': 'endDate', 'return': 'endDate',
  'country': 'country',
  'cities': 'cities', 'city': 'cities',
  'notes': 'notes', 'note': 'notes',
  'emoji': 'coverEmoji', 'icon': 'coverEmoji',
}

function normaliseDate(raw: string | number): string {
  if (!raw) return ''
  // Excel serial date number
  if (typeof raw === 'number') {
    const d = XLSX.SSF.parse_date_code(raw)
    if (d) {
      const m = String(d.m).padStart(2, '0')
      const day = String(d.d).padStart(2, '0')
      return `${d.y}-${m}-${day}`
    }
    return ''
  }
  const s = String(raw).trim()
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  // YYYY/MM/DD
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(s)) return s.replace(/\//g, '-')
  // ROC YYY/MM/DD
  const roc = s.match(/^(\d{2,3})[\/\-](\d{1,2})[\/\-](\d{1,2})$/)
  if (roc && parseInt(roc[1]) < 200) {
    const y = parseInt(roc[1]) + 1911
    return `${y}-${roc[2].padStart(2,'0')}-${roc[3].padStart(2,'0')}`
  }
  return s
}

function parseCities(raw: string): string[] {
  if (!raw) return []
  return raw.split(/[,，、\/]/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(name => {
      // Try to match against city DB (English or Chinese)
      const match = CITIES.find(
        c => c.name.toLowerCase() === name.toLowerCase() || c.nameZh === name
      )
      return match?.name ?? name
    })
}

export function parseImportFile(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const wb = XLSX.read(data, { type: 'array', cellDates: false })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const raw: Record<string, string | number>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
        if (raw.length === 0) { resolve([]); return }

        // Map headers
        const headerMap: Record<string, keyof Omit<ImportRow, '_errors'>> = {}
        const firstRow = raw[0]
        for (const h of Object.keys(firstRow)) {
          const norm = h.trim().toLowerCase()
          const mapped = COL_MAP[norm] ?? COL_MAP[h.trim()]
          if (mapped) headerMap[h] = mapped
        }

        const rows: ImportRow[] = raw.map((r, i) => {
          const row: ImportRow = {
            title: '', startDate: '', endDate: '',
            country: '', cities: [], notes: '',
            coverEmoji: '✈️', _errors: [],
          }
          for (const [col, field] of Object.entries(headerMap)) {
            const val = String(r[col] ?? '').trim()
            if (field === 'cities') {
              row.cities = parseCities(val)
            } else if (field === 'startDate' || field === 'endDate') {
              row[field] = normaliseDate(r[col])
            } else {
              (row as unknown as Record<string, string>)[field] = val
            }
          }

          // Validations
          if (!row.startDate) row._errors.push('缺少出發日期')
          if (!row.endDate) row._errors.push('缺少返回日期')
          if (!row.title) {
            // Auto-generate title from country/city
            if (row.country) row.title = `${row.country} 之旅`
            else if (row.cities.length) row.title = `${row.cities[0]} 之旅`
            else row._errors.push('缺少行程名稱')
          }
          if (!row.coverEmoji) row.coverEmoji = '✈️'

          return row
        })

        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('檔案讀取失敗'))
    reader.readAsArrayBuffer(file)
  })
}

export function rowsToTrips(rows: ImportRow[]): Omit<Trip, 'id'>[] {
  return rows
    .filter(r => r._errors.length === 0)
    .map(r => ({
      title: r.title,
      startDate: r.startDate,
      endDate: r.endDate,
      country: r.country || (r.cities.length > 0
        ? (CITIES.find(c => c.name === r.cities[0])?.country ?? '') : ''),
      countryCode: CITIES.find(c => c.name === r.cities[0])?.countryCode ?? '',
      cities: r.cities,
      notes: r.notes,
      coverEmoji: r.coverEmoji || '✈️',
    }))
}

// Generate CSV template as a Blob for download
export function generateTemplate(): Blob {
  const ws = XLSX.utils.aoa_to_sheet([
    ['行程名稱', '出發日期', '返回日期', '城市', '國家', '備註', '圖示'],
    ['東京春遊', '2024-03-20', '2024-03-28', 'Tokyo', 'Japan', '賞櫻', '🌸'],
    ['首爾跨年', '2023-12-24', '2024-01-02', 'Seoul', 'South Korea', '', '❄️'],
    ['峇里島度假', '2023-07-10', '2023-07-17', 'Bali', 'Indonesia', '', '🏖️'],
  ])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '行程匯入')
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}
