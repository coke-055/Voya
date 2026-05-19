import { useRef, useState } from 'react'
import { X, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { parseImportFile, rowsToTrips, generateTemplate, ImportRow } from '../../utils/csvImport'
import { useTripStore } from '../../store/useTripStore'
import { formatDate } from '../../utils/dateUtils'
import { CITIES, COUNTRY_EMOJIS } from '../../data/cities'

interface Props {
  onClose: () => void
}

type Step = 'upload' | 'preview' | 'done'

export default function HiddenPanel({ onClose }: Props) {
  const importTrips = useTripStore((s) => s.importTrips)
  const [step, setStep] = useState<Step>('upload')
  const [rows, setRows] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [importedCount, setImportedCount] = useState(0)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError('')
    try {
      const parsed = await parseImportFile(file)
      if (parsed.length === 0) { setError('檔案內沒有有效資料，請確認格式'); return }
      setRows(parsed)
      setStep('preview')
    } catch {
      setError('解析失敗，請確認檔案格式正確')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleImport = () => {
    setImporting(true)
    const trips = rowsToTrips(rows)
    importTrips(trips)
    setImportedCount(trips.length)
    setStep('done')
    setImporting(false)
  }

  const downloadTemplate = () => {
    const blob = generateTemplate()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'voya-匯入範本.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  const validRows = rows.filter(r => r._errors.length === 0)
  const errorRows = rows.filter(r => r._errors.length > 0)

  return (
    <div className="fixed inset-0 z-[9999] flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel slides in from left */}
      <div
        className="relative z-10 w-[480px] max-w-full h-full bg-gray-950 border-r border-white/10 flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <div className="text-xs text-gray-600 mb-0.5 tracking-widest uppercase">Advanced</div>
            <h2 className="text-base font-semibold text-white">批次匯入行程</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Step: Upload */}
          {step === 'upload' && (
            <>
              {/* Format hint */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>支援 <span className="text-gray-300">.xlsx · .xls · .csv</span> 格式</p>
                <p>必要欄位：出發日期、返回日期（城市、國家選填）</p>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onClick={() => fileRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
                  ${dragging
                    ? 'border-blue-500 bg-blue-950/30'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/3'
                  }
                `}
              >
                <Upload size={28} className="mx-auto mb-3 text-gray-600" />
                <p className="text-sm text-gray-400">拖放檔案到這裡，或點擊選擇</p>
                <p className="text-xs text-gray-600 mt-1">.xlsx · .xls · .csv</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 rounded-xl p-3">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* Template download */}
              <div className="border border-white/8 rounded-xl p-4 space-y-2">
                <p className="text-xs text-gray-400">不知道格式？下載範本填好再匯入</p>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Download size={13} />
                  下載 Excel 範本 (.xlsx)
                </button>
                <div className="text-xs text-gray-600 font-mono mt-1 space-y-0.5">
                  <div className="text-gray-500">欄位說明：</div>
                  <div>行程名稱 · 出發日期 · 返回日期</div>
                  <div>城市 · 國家 · 備註 · 圖示(emoji)</div>
                  <div className="text-gray-600">日期支援：YYYY-MM-DD 或 YYYY/MM/DD</div>
                  <div className="text-gray-600">多個城市：用逗號分隔（例：Tokyo,Kyoto）</div>
                </div>
              </div>
            </>
          )}

          {/* Step: Preview */}
          {step === 'preview' && (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  共 <span className="text-white font-semibold">{rows.length}</span> 筆，
                  <span className="text-green-400 font-semibold">{validRows.length}</span> 筆可匯入
                  {errorRows.length > 0 && (
                    <span className="text-amber-400 ml-1">·  {errorRows.length} 筆有錯誤</span>
                  )}
                </div>
                <button
                  onClick={() => { setStep('upload'); setRows([]) }}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  重新選擇
                </button>
              </div>

              {/* Preview table */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {rows.map((row, i) => {
                  const cityObj = row.cities[0]
                    ? CITIES.find(c => c.name === row.cities[0])
                    : undefined
                  const flag = COUNTRY_EMOJIS[cityObj?.countryCode ?? ''] ?? '🌍'

                  return (
                    <div
                      key={i}
                      className={`rounded-xl px-4 py-3 text-sm ${
                        row._errors.length > 0
                          ? 'bg-amber-950/30 border border-amber-500/20'
                          : 'bg-white/5 border border-white/8'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-shrink-0">{row.coverEmoji || flag}</span>
                          <div className="min-w-0">
                            <div className="text-white font-medium truncate">
                              {row.title || <span className="text-gray-500 italic">未命名</span>}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {formatDate(row.startDate)} → {formatDate(row.endDate)}
                              {row.cities.length > 0 && (
                                <span className="ml-2 text-gray-400">{row.cities.join('、')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {row._errors.length > 0 ? (
                          <div className="flex-shrink-0 text-xs text-amber-400">{row._errors[0]}</div>
                        ) : (
                          <CheckCircle size={14} className="flex-shrink-0 text-green-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {validRows.length > 0 && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  匯入 {validRows.length} 筆行程
                </button>
              )}
            </>
          )}

          {/* Step: Done */}
          {step === 'done' && (
            <div className="text-center py-12 space-y-4">
              <CheckCircle size={48} className="mx-auto text-green-400" />
              <div>
                <p className="text-lg font-semibold text-white">匯入完成</p>
                <p className="text-sm text-gray-400 mt-1">成功新增 {importedCount} 筆行程到地圖</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                關閉
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
