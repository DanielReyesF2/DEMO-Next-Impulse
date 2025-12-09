import { useState } from 'react';
import { useWalkthrough } from './WalkthroughContext';
import { tourFlows, TourFlowType } from './tourFlows';
import { FileText, Search, Leaf, X, Play, ArrowRight, RotateCcw, Package } from 'lucide-react';

const iconMap = {
  FileText,
  Search,
  Leaf,
  Play,
};

type ModalView = 'welcome' | 'options' | 'end';

export function WalkthroughModal() {
  const { isModalOpen, closeModal, startTour, openLotSearch, isEndModalOpen, closeEndModal } = useWalkthrough();
  const [view, setView] = useState<ModalView>('welcome');

  // Reset view when modal opens
  if (!isModalOpen && !isEndModalOpen) {
    if (view !== 'welcome') {
      setTimeout(() => setView('welcome'), 300);
    }
    return null;
  }

  // Modal de fin del demo
  if (isEndModalOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeEndModal}
        />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header simple */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 text-white text-center">
            <button 
              onClick={closeEndModal}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-xl font-semibold">¡Listo!</h2>
            <p className="text-emerald-100 text-sm">Ya conoces tu portal</p>
          </div>

          {/* 3 botones */}
          <div className="p-6 space-y-3">
            <button
              onClick={() => {
                closeEndModal();
                window.location.href = '/trazabilidad';
                setTimeout(() => {
                  const tabReportes = document.querySelector('[data-tour="tab-reportes"]') as HTMLElement;
                  tabReportes?.click();
                }, 500);
              }}
              className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl transition-all text-left flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-800">Generar mi reporte</span>
            </button>

            <button
              onClick={() => {
                closeEndModal();
                window.location.href = '/trazabilidad';
                setTimeout(() => {
                  const tabExhibidores = document.querySelector('[data-tour="tab-exhibidores"]') as HTMLElement;
                  tabExhibidores?.click();
                }, 500);
              }}
              className="w-full p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all text-left flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-800">Ver mis exhibidores</span>
            </button>

            <button
              onClick={() => {
                closeEndModal();
                startTour('fullDemo');
              }}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all text-left flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-800">Ver de nuevo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFlowSelect = (flowId: TourFlowType) => {
    if (flowId === 'traceability') {
      closeModal();
      openLotSearch();
    } else {
      startTour(flowId);
    }
  };

  const handleStartFullDemo = () => {
    startTour('fullDemo');
  };

  // Filtrar el fullDemo de las opciones específicas
  const specificFlows = tourFlows.filter(f => f.id !== 'fullDemo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {view === 'welcome' ? (
          // Vista de Bienvenida - Simple y directa
          <>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-white text-center">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Te mostramos tu portal</h2>
              <p className="text-emerald-100">3 minutos</p>
            </div>

            <div className="p-6">
              <button
                onClick={handleStartFullDemo}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Empezar
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setView('options')}
                className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Ya conozco el portal, ir a algo específico
              </button>
            </div>
          </>
        ) : (
          // Vista de Opciones específicas
          <>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 text-white">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setView('welcome')}
                className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors text-sm"
              >
                ← Volver
              </button>
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-xl font-semibold">¿Qué necesitas?</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {specificFlows.map((flow) => {
                  const Icon = iconMap[flow.icon as keyof typeof iconMap];
                  return (
                    <button
                      key={flow.id}
                      onClick={() => handleFlowSelect(flow.id)}
                      className="group w-full p-4 bg-gray-50 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300 rounded-xl transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white group-hover:bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm transition-colors">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">
                            {flow.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {flow.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
