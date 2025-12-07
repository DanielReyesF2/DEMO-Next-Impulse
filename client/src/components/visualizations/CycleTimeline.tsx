import { useRef, useEffect, useState } from 'react';
import { GraphicCycle, getCampaignByLotId } from '@/data/mockExhibitors';
import { MapPin, ArrowDown, ArrowUp, Recycle, Package, Palette, Calendar, Truck, Leaf, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface CycleTimelineProps {
  cycles: GraphicCycle[];
  selectedCycleNumber?: number;
  exhibitorId?: string;
}

export function CycleTimeline({ cycles, selectedCycleNumber, exhibitorId = 'EXH-EGO-001' }: CycleTimelineProps) {
  const refs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [showAll, setShowAll] = useState(false);
  
  // Ordenar ciclos cronológicamente (más reciente primero para mostrar últimos 5)
  const sortedCycles = [...cycles].sort((a, b) => b.cycleNumber - a.cycleNumber);
  const oldestFirst = [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber);
  
  // Mostrar últimos 5 o todos
  const visibleCycles = showAll ? sortedCycles : sortedCycles.slice(0, 5);
  const hiddenCount = sortedCycles.length - 5;
  
  // Scroll al ciclo seleccionado
  useEffect(() => {
    if (selectedCycleNumber && refs.current[selectedCycleNumber]) {
      refs.current[selectedCycleNumber]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [selectedCycleNumber]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
  };

  // Calcular merma del proceso (eficiencia del 98.5%, merma de 1.5%)
  const calculateMerma = (currentCycle: GraphicCycle) => {
    if (!currentCycle.recycledInto) return null;
    const mermaPercent = 1.5;
    const merma = currentCycle.weight * (mermaPercent / 100);
    return { kg: merma, percent: mermaPercent };
  };

  // Peso inicial de residuos
  const initialWasteWeight = oldestFirst[0] ? oldestFirst[0].weight * 1.015 : 0;

  return (
    <div className="space-y-0">
      {/* Título narrativo */}
      <div className="text-center mb-6">
        <h3 className="text-base font-medium text-gray-600 tracking-wide">Historia de Reciclaje</h3>
        <p className="text-sm text-gray-500">
          {sortedCycles.length} ciclos de economía circular desde {formatDate(oldestFirst[0]?.startDate || '')}
        </p>
      </div>

      {/* Timeline de tarjetas */}
      <div className="relative">
        {/* Línea vertical central */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-emerald-300 to-emerald-400"></div>

        {/* ORIGEN: Siempre visible */}
        <div className="relative mb-4">
          <div className="flex items-start gap-4 pb-4">
            <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-amber-500 text-white shadow-lg">
              <Recycle className="w-6 h-6" />
            </div>

            <div className="flex-1 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden">
              <div className="px-4 py-2 border-b border-amber-200 bg-amber-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">Origen</div>
                    <h4 className="font-medium text-gray-700 text-sm">Residuos Gráficos Post-Consumo</h4>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-amber-200 text-amber-800 rounded-full font-medium">
                    INICIO
                  </span>
                </div>
              </div>
              
              <div className="p-3 flex gap-3 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src="/images/residuos-graficos.png" 
                    alt="Residuos gráficos"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-xs text-gray-600">
                  <p className="font-medium text-gray-800">{initialWasteWeight.toFixed(0)} kg recolectados</p>
                  <p className="text-gray-500">{formatDate(oldestFirst[0]?.startDate || '')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ciclos visibles (últimos 5 o todos) */}
        {visibleCycles.map((cycle, index) => {
          const isActive = cycle.endDate === null;
          const isSelected = selectedCycleNumber === cycle.cycleNumber;
          const merma = calculateMerma(cycle);
          
          // Para el conector, necesitamos el ciclo anterior en orden cronológico
          const prevCycleNumber = cycle.cycleNumber - 1;
          const prevCycle = cycles.find(c => c.cycleNumber === prevCycleNumber);
          
          return (
            <div 
              key={cycle.lotId}
              ref={el => refs.current[cycle.cycleNumber] = el}
              className="relative"
            >
              {/* Tarjeta del ciclo */}
              <div className="flex items-start gap-4 pb-4">
                {/* Círculo del ciclo */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                  isActive 
                    ? 'bg-amber-500' 
                    : cycle.recycledInto === 'exhibitor'
                      ? 'bg-indigo-500'
                      : 'bg-emerald-500'
                }`}>
                  {cycle.cycleNumber}
                </div>

                {/* Contenido de la tarjeta */}
                <div className={`flex-1 bg-white rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
                    : isActive
                      ? 'border-amber-300 shadow-md'
                      : 'border-gray-200'
                }`}>
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-xs text-emerald-600 font-semibold">{cycle.lotId}</div>
                        <h4 className="font-medium text-gray-700">{cycle.campaign}</h4>
                      </div>
                      {isActive && (
                        <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">
                          ACTIVO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sección ORIGEN - De dónde viene el material */}
                  {prevCycle && cycle.sourceFromLotId && (
                    <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                      <div className="flex items-start gap-2">
                        <ArrowUp className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-blue-700">ORIGEN</div>
                          <div className="text-sm text-blue-900">
                            <span className="font-semibold">{cycle.materialRecovered} kg</span> de vinilo reciclado
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            ← De: <span className="font-mono">{cycle.sourceFromLotId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Datos del ciclo - compacto */}
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {cycle.location.store}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(cycle.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Recycle className="w-3 h-3" /> {cycle.weight.toFixed(0)} kg
                      </span>
                    </div>
                  </div>

                  {/* Sección DESTINO - A dónde va el material */}
                  {cycle.recycledInto && cycle.recycledToLotId && (
                    <div className={`px-4 py-3 border-t ${
                      cycle.recycledInto === 'graphic' 
                        ? 'bg-emerald-50 border-emerald-100' 
                        : 'bg-indigo-50 border-indigo-100'
                    }`}>
                      <div className="flex items-start gap-2">
                        <ArrowDown className={`w-4 h-4 mt-0.5 ${
                          cycle.recycledInto === 'graphic' ? 'text-emerald-500' : 'text-indigo-500'
                        }`} />
                        <div className="flex-1">
                          <div className={`text-xs font-medium ${
                            cycle.recycledInto === 'graphic' ? 'text-emerald-700' : 'text-indigo-700'
                          }`}>DESTINO</div>
                          <div className={`text-sm ${
                            cycle.recycledInto === 'graphic' ? 'text-emerald-900' : 'text-indigo-900'
                          }`}>
                            <span className="font-semibold">{cycle.materialSent} kg</span> → {cycle.recycledInto === 'graphic' ? 'Nuevos gráficos' : 'Nuevo exhibidor'}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${cycle.recycledInto === 'graphic' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                              → <span className="font-mono">{cycle.recycledToLotId}</span>
                            </span>
                            {merma && (
                              <span className="text-[10px] text-gray-500">
                                Merma: {merma.kg.toFixed(1)} kg ({merma.percent}%)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Botón para ver historial completo */}
        {hiddenCount > 0 && !showAll && (
          <div className="flex items-center gap-4 pb-4">
            <div className="w-12 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
                +{hiddenCount}
              </div>
            </div>
            <button
              onClick={() => setShowAll(true)}
              className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              Ver {hiddenCount} ciclos anteriores
            </button>
          </div>
        )}

        {/* Botón para colapsar */}
        {showAll && hiddenCount > 0 && (
          <div className="flex items-center gap-4 pb-4">
            <div className="w-12"></div>
            <button
              onClick={() => setShowAll(false)}
              className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ChevronUp className="w-4 h-4" />
              Mostrar solo últimos 5
            </button>
          </div>
        )}
      </div>

      {/* Resumen compacto */}
      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total procesado en {sortedCycles.length} ciclos:</span>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-emerald-600">{sortedCycles.reduce((sum, c) => sum + c.weight, 0).toFixed(0)} kg</span>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-emerald-600">-{sortedCycles.reduce((sum, c) => sum + c.savingsVsVirgin, 0).toFixed(0)} kg CO₂</span>
          </div>
        </div>
      </div>
    </div>
  );
}
