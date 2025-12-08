import { useState } from 'react';
import { useWalkthrough } from './WalkthroughContext';
import { Search, X, ArrowRight } from 'lucide-react';

export function LotSearchModal() {
  const { isLotSearchOpen, closeLotSearch, startTour, openModal } = useWalkthrough();
  const [lotId, setLotId] = useState('');

  if (!isLotSearchOpen) return null;

  const handleSearch = () => {
    const searchId = lotId.trim() || 'EXH-EGO-001';
    startTour('traceability', searchId);
  };

  const handleBack = () => {
    closeLotSearch();
    openModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeLotSearch}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 text-white">
          <button 
            onClick={closeLotSearch}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Buscar Exhibidor</h2>
              <p className="text-blue-100 text-sm">Ingresa el ID para rastrearlo</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuál es el ID de tu exhibidor?
            </label>
            <input
              type="text"
              value={lotId}
              onChange={(e) => setLotId(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="EXH-EGO-001"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg font-mono"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">
              Déjalo vacío para usar el ejemplo: EXH-EGO-001
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              ← Volver
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              Buscar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

