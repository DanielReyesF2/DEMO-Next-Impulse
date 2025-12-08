import { useRef, useEffect, useState } from 'react';
import { GraphicCycle, getCampaignByLotId } from '@/data/mockExhibitors';
import { MapPin, ArrowRight, ArrowUp, Recycle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface CycleTimelineProps {
  cycles: GraphicCycle[];
  selectedCycleNumber?: number;
  exhibitorId?: string;
}

export function CycleTimeline({ cycles, selectedCycleNumber, exhibitorId = 'EXH-EGO-001' }: CycleTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  
  // Ordenar ciclos: más antiguo primero
  const sortedCycles = [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber);
  
  // Mostrar últimos 3 o todos
  const visibleCycles = showAll ? sortedCycles : sortedCycles.slice(-3);
  const hiddenCount = sortedCycles.length - 3;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
  };

  // Calcular merma (1.5%)
  const calculateMerma = (cycle: GraphicCycle) => {
    if (!cycle.recycledInto) return null;
    return { kg: cycle.weight * 0.015, percent: 1.5 };
  };

  // Peso inicial
  const initialWeight = sortedCycles[0] ? Math.round(sortedCycles[0].weight * 1.015) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-base font-medium text-gray-600">Historia de Reciclaje</h3>
        <p className="text-sm text-gray-500">
          {sortedCycles.length} ciclos desde {formatDate(sortedCycles[0]?.startDate || '')}
        </p>
      </div>

      {/* Timeline horizontal */}
      <div className="overflow-x-auto pb-4" ref={containerRef}>
        <div className="flex items-stretch gap-2 min-w-max px-4">
          
          {/* ORIGEN */}
          <div className="w-64 flex-shrink-0">
            <div className="flex flex-col items-center">
              {/* Círculo */}
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md mb-2">
                <Recycle className="w-5 h-5" />
              </div>
              
              {/* Tarjeta */}
              <div className="w-full bg-amber-50 border-2 border-amber-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-amber-100 border-b border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-700">ORIGEN</span>
                    <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">INICIO</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-700">Residuos Gráficos</h4>
                </div>
                <div className="p-3">
                  <div className="w-full h-20 bg-gray-100 rounded border overflow-hidden mb-2">
                    <img 
                      src="/images/residuos-graficos.png" 
                      alt="Residuos"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold">{initialWeight} kg recolectados</p>
                    <p className="text-gray-400">{formatDate(sortedCycles[0]?.startDate || '')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flecha */}
          <div className="flex items-center self-start pt-4">
            <div className="w-6 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
            <ArrowRight className="w-4 h-4 text-emerald-500 -ml-1" />
          </div>

          {/* Ciclos */}
          {visibleCycles.map((cycle, index) => {
            const isActive = cycle.endDate === null;
            const isSelected = selectedCycleNumber === cycle.cycleNumber;
            const merma = calculateMerma(cycle);
            const prevCycle = cycles.find(c => c.cycleNumber === cycle.cycleNumber - 1);
            
            return (
              <div key={cycle.lotId} className="flex items-stretch gap-2">
                {/* Flecha entre ciclos */}
                {index > 0 && (
                  <div className="flex items-center self-start pt-4">
                    <div className="w-6 h-0.5 bg-emerald-300"></div>
                    <ArrowRight className="w-4 h-4 text-emerald-500 -ml-1" />
                  </div>
                )}
                
                {/* Tarjeta del ciclo */}
                <div className="w-64 flex-shrink-0">
                  <div className="flex flex-col items-center">
                    {/* Círculo numerado */}
                    <div className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center shadow-md mb-2 ${
                      isActive 
                        ? 'bg-amber-500' 
                        : cycle.recycledInto === 'exhibitor'
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                    }`}>
                      {cycle.cycleNumber}
                    </div>
                    
                    {/* Tarjeta */}
                    <div className={`w-full rounded-lg border-2 overflow-hidden transition-all ${
                      isSelected 
                        ? 'border-emerald-500 shadow-lg' 
                        : isActive
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-gray-200 bg-white'
                    }`}>
                      {/* Header */}
                      <div className="px-3 py-2 border-b border-gray-100 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono text-xs text-emerald-600 font-semibold">{cycle.lotId}</div>
                            <h4 className="text-sm font-medium text-gray-700 truncate">{cycle.campaign}</h4>
                          </div>
                          {isActive && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                              ACTIVO
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Origen del material */}
                      {prevCycle && cycle.sourceFromLotId && (
                        <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                          <div className="flex items-start gap-1.5">
                            <ArrowUp className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="text-xs">
                              <span className="font-semibold text-blue-800">{cycle.materialRecovered} kg</span>
                              <span className="text-blue-600"> reciclado de </span>
                              <span className="font-mono text-blue-500">{cycle.sourceFromLotId}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Info básica */}
                      <div className="px-3 py-2 space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {cycle.location.store}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(cycle.startDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Recycle className="w-3 h-3" /> {cycle.weight.toFixed(0)} kg
                        </div>
                      </div>

                      {/* Destino */}
                      {cycle.recycledInto && cycle.recycledToLotId && (
                        <div className={`px-3 py-2 border-t text-xs ${
                          cycle.recycledInto === 'graphic' 
                            ? 'bg-emerald-50 border-emerald-100' 
                            : 'bg-indigo-50 border-indigo-100'
                        }`}>
                          <div className={`font-medium mb-1 ${
                            cycle.recycledInto === 'graphic' ? 'text-emerald-700' : 'text-indigo-700'
                          }`}>
                            → {cycle.recycledInto === 'graphic' ? 'Nuevos gráficos' : 'Nuevo exhibidor'}
                          </div>
                          <div className="flex items-center justify-between text-gray-500">
                            <span className="font-mono">{cycle.recycledToLotId}</span>
                            {merma && <span className="text-[10px]">Merma: {merma.kg.toFixed(1)}kg</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón expandir/colapsar */}
      {hiddenCount > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Mostrar últimos 3 ciclos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver los {sortedCycles.length} ciclos completos
              </>
            )}
          </button>
        </div>
      )}

      {/* Resumen */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total en {sortedCycles.length} ciclos:</span>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-600">
              {sortedCycles.reduce((sum, c) => sum + c.weight, 0).toFixed(0)} kg
            </span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-emerald-600">
              -{sortedCycles.reduce((sum, c) => sum + c.savingsVsVirgin, 0).toFixed(0)} kg CO₂
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
