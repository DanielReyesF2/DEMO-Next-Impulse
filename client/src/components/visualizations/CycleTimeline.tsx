import { useState } from 'react';
import { GraphicCycle } from '@/data/mockExhibitors';
import { ChevronDown, ArrowDownRight, Recycle } from 'lucide-react';

interface CycleTimelineProps {
  cycles: GraphicCycle[];
  selectedCycleNumber?: number;
  exhibitorId?: string;
}

export function CycleTimeline({ cycles, selectedCycleNumber }: CycleTimelineProps) {
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const sortedCycles = [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber);
  const displayCycles = showAll ? sortedCycles : sortedCycles.slice(-5);
  const hiddenCount = sortedCycles.length - 5;
  
  // Totales
  const totalWeight = sortedCycles.reduce((sum, c) => sum + c.weight, 0);
  const totalSavings = sortedCycles.reduce((sum, c) => sum + c.savingsVsVirgin, 0);
  const toGraphics = sortedCycles.filter(c => c.recycledInto === 'graphic').length;
  const toExhibitors = sortedCycles.filter(c => c.recycledInto === 'exhibitor').length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header con resumen visual */}
      <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50 rounded-2xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Historia del Reciclaje</h3>
          <p className="text-sm text-gray-500">El viaje de {totalWeight.toFixed(0)} kg de material reciclado</p>
        </div>
        
        {/* Flow visual del proceso */}
        <div className="flex items-center justify-center gap-3">
          {/* Origen */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center overflow-hidden shadow-sm">
              <img src="/images/residuos-graficos.png" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-medium text-amber-700 mt-1">Residuos</span>
          </div>
          
          <ArrowDownRight className="w-6 h-6 text-gray-300 rotate-[-45deg]" />
          
          {/* Proceso */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center shadow-sm">
              <Recycle className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-700 mt-1">{sortedCycles.length} ciclos</span>
          </div>
          
          <ArrowDownRight className="w-6 h-6 text-gray-300 rotate-[-45deg]" />
          
          {/* Destino - Imagen del producto */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center overflow-hidden shadow-sm">
              <img 
                src="/images/jarritos/produccion-planta.jpg" 
                alt="Producto reciclado" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="text-center"><span class="text-2xl">📦</span></div>';
                }}
              />
            </div>
            <span className="text-xs font-medium text-emerald-700 mt-1">Producto final</span>
          </div>
        </div>

        {/* Impacto */}
        <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{totalWeight.toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg procesados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">-{totalSavings.toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg CO₂ evitado</div>
          </div>
        </div>
      </div>

      {/* Lista de ciclos - Estilo acordeón */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-sm font-medium text-gray-600">Detalle por ciclo</h4>
          {hiddenCount > 0 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-emerald-600 hover:text-emerald-700"
            >
              {showAll ? 'Ver menos' : `Ver todos (${sortedCycles.length})`}
            </button>
          )}
        </div>

        <div className="space-y-1">
          {displayCycles.map((cycle) => {
            const isActive = cycle.endDate === null;
            const isExpanded = expandedCycle === cycle.cycleNumber;
            const isGraphic = cycle.recycledInto === 'graphic';
            
            return (
              <div 
                key={cycle.lotId}
                className={`rounded-xl border transition-all ${
                  isActive 
                    ? 'border-amber-300 bg-amber-50' 
                    : isExpanded 
                      ? 'border-emerald-300 bg-emerald-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Header del ciclo - siempre visible */}
                <button
                  onClick={() => setExpandedCycle(isExpanded ? null : cycle.cycleNumber)}
                  className="w-full px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* Número de ciclo */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                      isActive ? 'bg-amber-500' : isGraphic ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}>
                      {cycle.cycleNumber}
                    </div>
                    
                    {/* Info básica */}
                    <div className="text-left">
                      <div className="font-medium text-gray-800 text-sm">{cycle.campaign}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(cycle.startDate)} · {cycle.location.store}
                      </div>
                    </div>
                  </div>
                  
                  {/* Destino + peso */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700">{cycle.weight.toFixed(0)} kg</div>
                      <div className={`text-xs ${isActive ? 'text-amber-600' : isGraphic ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {isActive ? '🔄 En uso' : isGraphic ? '→ Gráficos' : '→ Exhibidor'}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Detalle expandido */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      {/* De dónde viene */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">📥 ¿De dónde vino?</div>
                        {cycle.sourceFromLotId ? (
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold">{cycle.materialRecovered} kg</span> del reciclaje anterior
                            <div className="text-xs text-gray-400 font-mono">{cycle.sourceFromLotId}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-amber-600">Era el material inicial</div>
                        )}
                      </div>
                      
                      {/* A dónde va */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">📤 ¿A dónde fue?</div>
                        {cycle.recycledInto ? (
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold">{cycle.materialSent} kg</span> → {cycle.recycledInto === 'graphic' ? 'Gráficos nuevos' : 'Exhibidor nuevo'}
                            <div className="text-xs text-gray-400 font-mono">{cycle.recycledToLotId}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-amber-600">Todavía está en uso</div>
                        )}
                      </div>
                      
                      {/* Impacto */}
                      <div className="col-span-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Lo que ahorraste:</span>
                          <span className="font-semibold text-emerald-600">-{cycle.savingsVsVirgin.toFixed(1)} kg CO₂</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
