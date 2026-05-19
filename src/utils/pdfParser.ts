import { ParsedTripDates } from '../types'

// Convert ROC (民國) date to ISO string
// Format: YYY/MM/DD or YYY-MM-DD where YYY is ROC year
function rocToISO(rocDate: string): string {
  const cleaned = rocDate.replace(/[.\s]/g, '/').trim()
  const parts = cleaned.split('/')
  if (parts.length !== 3) return ''
  const year = parseInt(parts[0]) + 1911
  const month = parts[1].padStart(2, '0')
  const day = parts[2].padStart(2, '0')
  if (isNaN(year) || year < 1911 || year > 2100) return ''
  return `${year}-${month}-${day}`
}

// Try to parse as AD date (YYYY/MM/DD)
function adToISO(dateStr: string): string {
  const cleaned = dateStr.replace(/[.\s]/g, '/').trim()
  const parts = cleaned.split('/')
  if (parts.length !== 3) return ''
  const year = parseInt(parts[0])
  if (year >= 1911 && year <= 2100) {
    const month = parts[1].padStart(2, '0')
    const day = parts[2].padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return ''
}

function parseDate(raw: string): string {
  const cleaned = raw.trim()
  // ROC year (< 200) or AD year
  const firstPart = cleaned.split(/[/.\-]/)[0]
  const firstNum = parseInt(firstPart)
  if (firstNum < 200) {
    return rocToISO(cleaned)
  }
  return adToISO(cleaned)
}

export async function parseCertificatePDF(file: File): Promise<ParsedTripDates[]> {
  // Dynamically import pdfjs to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n'
  }

  return extractTripDates(fullText)
}

function extractTripDates(text: string): ParsedTripDates[] {
  const results: ParsedTripDates[] = []

  // Pattern for 內政部移民署 入出國日期證明書
  // Looks for pairs of dates: departure (出境) and return (入境)
  // Dates appear as YYY/MM/DD or YYYY/MM/DD
  const datePattern = /(\d{2,3})[\/\.\-](\d{1,2})[\/\.\-](\d{1,2})/g
  const dates: string[] = []
  let match

  while ((match = datePattern.exec(text)) !== null) {
    const raw = match[0]
    const parsed = parseDate(raw)
    if (parsed) {
      dates.push(parsed)
    }
  }

  // The certificate lists dates in pairs: departure date, then return date
  // Usually alternating: out, in, out, in...
  // We group them into pairs of 2
  for (let i = 0; i + 1 < dates.length; i += 2) {
    const d1 = dates[i]
    const d2 = dates[i + 1]
    // departure should be before return
    if (d1 <= d2) {
      results.push({ startDate: d1, endDate: d2 })
    } else {
      results.push({ startDate: d2, endDate: d1 })
    }
  }

  return results
}

// Parse manually entered date string (flexible format)
export function parseManualDate(input: string): string {
  if (!input) return ''
  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input
  return parseDate(input)
}
