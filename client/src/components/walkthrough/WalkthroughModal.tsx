import { useWalkthrough } from './WalkthroughContext';
import { tourFlows, TourFlowType } from './tourFlows';
import { FileCheck, FileText, Search, Leaf, X, Play } from 'lucide-react';

const iconMap = {
  FileCheck,
  FileText,
  Search,
  Leaf,
};

export function WalkthroughModal() {
  const { isModalOpen, closeModal, startTour, openLotSearch } = useWalkthrough();

  if (!isModalOpen) return null;

  const handleFlowSelect = (flowId: TourFlowType) => {
    if (flowId === 'traceability') {
      closeModal();
      openLotSearch();
    } else {
      startTour(flowId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 text-white">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Demo Guiado</h2>
              <p className="text-emerald-100 text-sm">Te mostramos cómo usar la plataforma</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
            ¿Qué necesitas encontrar hoy?
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {tourFlows.map((flow) => {
              const Icon = iconMap[flow.icon as keyof typeof iconMap];
              return (
                <button
                  key={flow.id}
                  onClick={() => handleFlowSelect(flow.id)}
                  className="group p-5 bg-gray-50 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300 rounded-xl transition-all duration-200 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white group-hover:bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm transition-colors">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">
                        {flow.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {flow.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Puedes salir del tour en cualquier momento presionando Escape
          </p>
        </div>
      </div>
    </div>
  );
}

