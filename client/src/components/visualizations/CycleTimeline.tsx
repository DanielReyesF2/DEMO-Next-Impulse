import { useRef, useEffect, useState } from 'react';
import { GraphicCycle, getCampaignByLotId } from '@/data/mockExhibitors';
import { MapPin, ArrowDown, ArrowUp, Recycle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface CycleTimelineProps {
  cycles: GraphicCycle[];
  selectedCycleNumber?: number;
  exhibitorId?: string;
}

export function CycleTimeline({ cycles, selectedCycleNumber, exhibitorId = 'EXH-EGO-001' }: CycleTimelineProps) {
  const refs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [showAll, setShowAll] = useState(false);
  
  // Ordenar ciclos: más antiguo (1) a la izquierda, más reciente (23) a la derecha
  const sortedCycles = [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber);
  const oldestFirst = sortedCycles;
  
  // Mostrar 3 tarjetas o todos
  const visibleCycles = showAll ? sortedCycles : sortedCycles.slice(-3);
  const hiddenCount = sortedCycles.length - 3;
  
  // Scroll al ciclo seleccionado (horizontal)
  useEffect(() => {
    if (selectedCycleNumber && refs.current[selectedCycleNumber]) {
      refs.current[selectedCycleNumber]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'center'
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
        <p className="text-sm text-gray-500 mb-2">
          {sortedCycles.length} ciclos de economía circular desde {formatDate(oldestFirst[0]?.startDate || '')}
        </p>
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          Cada vez que una campaña termina, los gráficos se recolectan y reciclan, regresando al ciclo como nuevo material. Este proceso se repite continuamente, extendiendo la vida útil del material original.
        </p>
      </div>

      {/* Timeline horizontal de tarjetas */}
      <div className="relative">
        {/* Contenedor con scroll horizontal */}
        <div className="overflow-x-auto pb-4 -mx-2 px-2">
          <div className="flex items-start gap-4 min-w-max">
            {/* ORIGEN: Siempre visible a la izquierda */}
            <div className="flex-shrink-0 w-80">
              <div className="relative">
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-amber-500 text-white shadow-lg mb-3 mx-auto">
                  <Recycle className="w-6 h-6" />
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 overflow-hidden">
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
                  
                  <div className="p-3">
                    <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden mb-2">
                      <img 
                        src="/images/residuos-graficos.png" 
                        alt="Residuos gráficos"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      <p className="font-medium text-gray-800 mb-1">
                        {initialWasteWeight.toFixed(0)} kg recolectados
                      </p>
                      <p className="text-gray-500">{formatDate(oldestFirst[0]?.startDate || '')}</p>
                      <p className="text-gray-500 mt-1 text-[10px]">Este material inició la cadena circular</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flecha conectora */}
            <div className="flex-shrink-0 flex items-center pt-6">
              <div className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
              <ArrowDown className="w-4 h-4 text-emerald-500 rotate-[-90deg]" />
            </div>

            {/* Ciclos visibles (3 o todos) - de izquierda a derecha */}
            {visibleCycles.map((cycle, index) => {
              const isActive = cycle.endDate === null;
              const isSelected = selectedCycleNumber === cycle.cycleNumber;
              const merma = calculateMerma(cycle);
              
              // Para el conector, necesitamos el ciclo anterior en orden cronológico
              const prevCycleNumber = cycle.cycleNumber - 1;
              const prevCycle = cycles.find(c => c.cycleNumber === prevCycleNumber);
              
              return (
                <div key={cycle.lotId} className="flex-shrink-0">
                  {/* Flecha conectora antes de cada ciclo (excepto el primero) */}
                  {index > 0 && (
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
                      <ArrowDown className="w-4 h-4 text-emerald-500 rotate-[-90deg]" />
                    </div>
                  )}
                  
                  <div 
                    ref={el => refs.current[cycle.cycleNumber] = el}
                    className="w-80"
                  >
                    {/* Círculo del ciclo arriba */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg mx-auto mb-3 ${
                      isActive 
                        ? 'bg-amber-500' 
                        : cycle.recycledInto === 'exhibitor'
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                    }`}>
                      {cycle.cycleNumber}
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className={`bg-white rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
                        : isActive
                          ? 'border-amber-300 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono text-xs text-emerald-600 font-semibold">{cycle.lotId}</div>
                            <h4 className="font-medium text-gray-700 text-sm">{cycle.campaign}</h4>
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
                              <div className="text-xs font-medium text-blue-700">ORIGEN DEL MATERIAL</div>
                              <div className="text-sm text-blue-900">
                                <span className="font-semibold">{cycle.materialRecovered} kg</span> de vinilo reciclado del ciclo anterior
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                ← Cuando terminó la campaña anterior, el material se recicló y regresó al ciclo
                              </div>
                              <div className="text-xs text-blue-500 mt-0.5 font-mono">
                                {cycle.sourceFromLotId}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Datos del ciclo - compacto */}
                      <div className="px-4 py-2 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" /> {cycle.location.store}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" /> {formatDate(cycle.startDate)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Recycle className="w-3 h-3" /> {cycle.weight.toFixed(0)} kg
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
                              }`}>DESTINO DEL RECICLAJE</div>
                              <div className={`text-sm ${
                                cycle.recycledInto === 'graphic' ? 'text-emerald-900' : 'text-indigo-900'
                              }`}>
                                Cuando esta campaña terminó, <span className="font-semibold">{cycle.materialSent} kg</span> se reciclaron
                              </div>
                              <div className={`text-xs mt-1 ${
                                cycle.recycledInto === 'graphic' ? 'text-emerald-600' : 'text-indigo-600'
                              }`}>
                                → Se convirtieron en {cycle.recycledInto === 'graphic' ? 'nuevos gráficos' : 'materia prima para exhibidores'} y regresaron al ciclo
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-xs ${cycle.recycledInto === 'graphic' ? 'text-emerald-600' : 'text-indigo-600'} font-mono`}>
                                  {cycle.recycledToLotId}
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
          </div>
        </div>

        {/* Botón para ver historial completo */}
        {hiddenCount > 0 && !showAll && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll(true)}
              className="py-3 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              Mostrar ciclo de vida completo ({sortedCycles.length} ciclos)
            </button>
          </div>
        )}

        {/* Botón para colapsar */}
        {showAll && hiddenCount > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll(false)}
              className="py-3 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ChevronUp className="w-4 h-4" />
              Mostrar solo últimos 3 ciclos
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
