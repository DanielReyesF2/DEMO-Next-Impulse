import { useState } from 'react';
import { GraphicCycle } from '@/data/mockExhibitors';
import { ArrowRight, Recycle, ChevronDown, ChevronUp } from 'lucide-react';

interface CycleTimelineProps {
  cycles: GraphicCycle[];
  selectedCycleNumber?: number;
  exhibitorId?: string;
}

export function CycleTimeline({ cycles, selectedCycleNumber }: CycleTimelineProps) {
  const [showAll, setShowAll] = useState(false);
  
  const sortedCycles = [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber);
  const visibleCycles = showAll ? sortedCycles : sortedCycles.slice(-3);
  const hiddenCount = sortedCycles.length - 3;
  const initialWeight = sortedCycles[0] ? Math.round(sortedCycles[0].weight * 1.015) : 0;

  const getColor = (cycle: GraphicCycle) => {
    if (cycle.endDate === null) return { bg: 'bg-amber-500', border: 'border-amber-300', light: 'bg-amber-50' };
    if (cycle.recycledInto === 'exhibitor') return { bg: 'bg-indigo-500', border: 'border-indigo-300', light: 'bg-indigo-50' };
    return { bg: 'bg-emerald-500', border: 'border-emerald-300', light: 'bg-emerald-50' };
  };

  return (
    <div className="space-y-4">
      {/* Header simple */}
      <div className="text-center">
        <h3 className="text-base font-medium text-gray-600">Historia de Reciclaje</h3>
        <p className="text-sm text-gray-400">{sortedCycles.length} ciclos</p>
      </div>

      {/* Timeline visual */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1 min-w-max px-2">
          
          {/* ORIGEN - Simple */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center overflow-hidden">
              <img 
                src="/images/residuos-graficos.png" 
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-1 text-center">
              <div className="text-xs font-bold text-amber-600">{initialWeight} kg</div>
              <div className="text-[10px] text-gray-400">inicio</div>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />

          {/* Ciclos - Super simplificado */}
          {visibleCycles.map((cycle, index) => {
            const colors = getColor(cycle);
            const isActive = cycle.endDate === null;
            
            return (
              <div key={cycle.lotId} className="flex items-center gap-1">
                {index > 0 && <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                
                <div className="flex flex-col items-center">
                  {/* Círculo con número */}
                  <div className={`w-14 h-14 rounded-full ${colors.bg} text-white font-bold text-lg flex items-center justify-center shadow-md ${isActive ? 'ring-4 ring-amber-200' : ''}`}>
                    {cycle.cycleNumber}
                  </div>
                  
                  {/* Info mínima */}
                  <div className="mt-1 text-center max-w-[80px]">
                    <div className="text-xs font-semibold text-gray-700 truncate">{cycle.weight.toFixed(0)} kg</div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {isActive ? '🔄 activo' : cycle.recycledInto === 'graphic' ? '🎨 gráfico' : '📦 exhibidor'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda visual */}
      <div className="flex justify-center gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-500">→ Gráfico</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-gray-500">→ Exhibidor</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-500">Activo</span>
        </div>
      </div>

      {/* Expandir */}
      {hiddenCount > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Ver {sortedCycles.length} ciclos
              </>
            )}
          </button>
        </div>
      )}

      {/* Resumen visual */}
      <div className="flex justify-center gap-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">{sortedCycles.reduce((sum, c) => sum + c.weight, 0).toFixed(0)}</div>
          <div className="text-[10px] text-gray-400">kg reciclados</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">-{sortedCycles.reduce((sum, c) => sum + c.savingsVsVirgin, 0).toFixed(0)}</div>
          <div className="text-[10px] text-gray-400">kg CO₂</div>
        </div>
      </div>
    </div>
  );
}
