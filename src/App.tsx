import { useState } from 'react'
import { Film, LayoutGrid } from 'lucide-react'
import WorldMap from './components/Map/WorldMap'
import Sidebar from './components/Sidebar/Sidebar'
import TripModal from './components/Modal/TripModal'
import AnimationExporter from './components/Animation/AnimationExporter'
import HiddenPanel from './components/HiddenPanel/HiddenPanel'
import PWAInstallGuide from './components/Widget/PWAInstallGuide'
import { Trip } from './types'
import { useTripStore } from './store/useTripStore'
import { CITIES } from './data/cities'

type Modal = 'none' | 'add' | 'edit' | 'animation' | 'hidden' | 'widget'

export default function App() {
  const trips = useTripStore((s) => s.trips)
  const [modal, setModal] = useState<Modal>('none')
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [initialCities, setInitialCities] = useState<string[]>([])

  const openEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setModal('edit')
  }

  const closeModal = () => {
    setModal('none')
    setEditingTrip(null)
    setInitialCities([])
  }

  const handleMapClick = (lat: number, lng: number) => {
    // Find nearest city within 200 km
    let nearest: string | null = null
    let minDist = Infinity
    for (const city of CITIES) {
      const d = Math.hypot(city.lat - lat, city.lng - lng)
      if (d < minDist) { minDist = d; nearest = city.name }
    }
    // ~2 degrees ≈ 200 km
    setInitialCities(nearest && minDist < 2 ? [nearest] : [])
    setModal('add')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white font-sans">
      {/* Map takes remaining space */}
      <div className="relative flex-1" style={{ height: '100vh' }}>
        <WorldMap onMapClick={handleMapClick} />

        {/* Floating controls */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-[500]">
          <button
            onClick={() => setModal('animation')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/90 hover:bg-gray-800 border border-white/15 rounded-xl text-sm text-white backdrop-blur-md transition-all shadow-lg"
            title="生成飛機動畫"
          >
            <Film size={16} className="text-blue-400" />
            生成動畫
          </button>
          <button
            onClick={() => setModal('widget')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/90 hover:bg-gray-800 border border-white/15 rounded-xl text-sm text-white backdrop-blur-md transition-all shadow-lg"
            title="桌面倒數日曆"
          >
            <LayoutGrid size={16} className="text-blue-400" />
            倒數日曆
          </button>
        </div>

        {/* Attribution */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-600 z-[500]">
          © OpenStreetMap © CARTO
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        onAddTrip={() => setModal('add')}
        onEditTrip={openEdit}
        onOpenHidden={() => setModal('hidden')}
      />

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <TripModal
          trip={modal === 'edit' ? editingTrip : null}
          initialCities={modal === 'add' ? initialCities : undefined}
          onClose={closeModal}
        />
      )}

      {modal === 'animation' && (
        <AnimationExporter trips={trips} onClose={closeModal} />
      )}

      {modal === 'hidden' && (
        <HiddenPanel onClose={closeModal} />
      )}

      {modal === 'widget' && (
        <PWAInstallGuide onClose={closeModal} />
      )}
    </div>
  )
}
