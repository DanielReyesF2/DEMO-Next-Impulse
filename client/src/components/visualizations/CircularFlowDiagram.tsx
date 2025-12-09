import { GraphicCycle } from '@/data/mockExhibitors';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Recycle, Truck, Factory, ArrowRight, Package, Image } from 'lucide-react';

interface CircularFlowDiagramProps {
  cycles: GraphicCycle[];
}

export function CircularFlowDiagram({ cycles }: CircularFlowDiagramProps) {
  // Contar destinos de reciclaje
  const recycledToExhibitor = cycles.filter(c => c.recycledInto === 'exhibitor').length;
  const recycledToGraphic = cycles.filter(c => c.recycledInto === 'graphic').length;
  
  const totalRecycled = recycledToExhibitor + recycledToGraphic;
  const completedCycles = cycles.filter(c => c.endDate !== null);
  
  // Calcular peso total reciclado
  const totalWeightToExhibitor = completedCycles
    .filter(c => c.recycledInto === 'exhibitor')
    .reduce((sum, c) => sum + c.weight, 0);
  const totalWeightToGraphic = completedCycles
    .filter(c => c.recycledInto === 'graphic')
    .reduce((sum, c) => sum + c.weight, 0);
  const totalWeight = totalWeightToExhibitor + totalWeightToGraphic;

  const pieData = [
    { name: '→ Exhibidores', value: recycledToExhibitor, color: '#3B82F6', weight: totalWeightToExhibitor },
    { name: '→ Gráficos', value: recycledToGraphic, color: '#10B981', weight: totalWeightToGraphic },
  ];

  return (
    <div className="space-y-6">
      {/* Diagrama visual del proceso completo */}
      <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-blue-50 rounded-2xl p-6">
        <h4 className="text-sm font-medium text-gray-600 text-center mb-6">El proceso de reciclaje</h4>
        
        <div className="flex items-center justify-between">
          {/* 1. Campaña Termina */}
          <div className="flex flex-col items-center text-center w-24">
            <div className="w-16 h-16 bg-amber-100 rounded-xl border-2 border-amber-300 flex items-center justify-center">
              <Image className="w-8 h-8 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-700 mt-2">Campaña termina</span>
            <span className="text-[10px] text-gray-500">{totalWeight.toFixed(0)} kg</span>
          </div>
          
          <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
          
          {/* 2. Recolección */}
          <div className="flex flex-col items-center text-center w-24">
            <div className="w-16 h-16 bg-orange-100 rounded-xl border-2 border-orange-300 flex items-center justify-center">
              <Truck className="w-8 h-8 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-700 mt-2">Recolección</span>
            <span className="text-[10px] text-gray-500">Retiro en tienda</span>
          </div>
          
          <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
          
          {/* 3. Reprocesamiento - BLOQUE CENTRAL */}
          <div className="flex flex-col items-center text-center w-32 bg-white rounded-xl p-3 shadow-sm border border-emerald-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl border-2 border-emerald-400 flex items-center justify-center">
              <Factory className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-700 mt-2">Reprocesamiento</span>
            <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
              <div>• Molienda</div>
              <div>• Lavado</div>
              <div>• Pelletizado</div>
            </div>
          </div>
          
          <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
          
          {/* 4. Producción */}
          <div className="flex flex-col items-center text-center w-24">
            <div className="w-16 h-16 bg-purple-100 rounded-xl border-2 border-purple-300 flex items-center justify-center">
              <Recycle className="w-8 h-8 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-700 mt-2">Producción</span>
            <span className="text-[10px] text-gray-500">Inyección/Impresión</span>
          </div>
          
          <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
          
          {/* 5. Nuevo Producto */}
          <div className="flex flex-col items-center text-center w-24">
            <div className="w-16 h-16 bg-blue-100 rounded-xl border-2 border-blue-300 flex items-center justify-center overflow-hidden">
              <img 
                src="/images/jarritos/produccion-planta.jpg" 
                alt="Producto" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>';
                  }
                }}
              />
            </div>
            <span className="text-xs font-medium text-blue-700 mt-2">Nuevo producto</span>
            <span className="text-[10px] text-gray-500">{totalRecycled} ciclos</span>
          </div>
        </div>
        
        {/* Indicador de circularidad */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <span className="text-xs text-gray-500">
            🔄 Y el ciclo vuelve a empezar cuando esta campaña termine
          </span>
        </div>
      </div>

      {/* Resumen de destinos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-3">
            <Image className="w-8 h-8 text-emerald-600" />
            <div>
              <div className="text-lg font-bold text-emerald-700">{recycledToGraphic}</div>
              <div className="text-xs text-emerald-600">→ Nuevos gráficos</div>
              <div className="text-[10px] text-gray-500">{totalWeightToGraphic.toFixed(0)} kg</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-blue-700">{recycledToExhibitor}</div>
              <div className="text-xs text-blue-600">→ Nuevos exhibidores</div>
              <div className="text-[10px] text-gray-500">{totalWeightToExhibitor.toFixed(0)} kg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie chart con distribución */}
      <div className="grid grid-cols-2 gap-6">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                dataKey="value"
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 shadow-lg rounded border border-gray-200 text-sm">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-gray-600">{data.value} ciclos</p>
                        <p className="text-gray-600">{data.weight?.toFixed(0)} kg</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Leyenda simple */}
        <div className="flex flex-col justify-center space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-sm text-gray-600">{recycledToGraphic} → Gráficos ({totalRecycled > 0 ? ((recycledToGraphic/totalRecycled)*100).toFixed(0) : 0}%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-sm text-gray-600">{recycledToExhibitor} → Exhibidores ({totalRecycled > 0 ? ((recycledToExhibitor/totalRecycled)*100).toFixed(0) : 0}%)</span>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">{totalWeight.toFixed(0)} kg reciclados</span>
          </div>
        </div>
      </div>

      {/* Timeline compacto */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Destino de cada ciclo</h4>
        <div className="flex flex-wrap gap-1">
          {cycles.map((cycle) => (
            <div
              key={cycle.id}
              className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center font-medium transition-all hover:scale-110 cursor-default ${
                cycle.recycledInto === 'exhibitor' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : cycle.recycledInto === 'graphic'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300 animate-pulse'
              }`}
              title={`Ciclo ${cycle.cycleNumber}: ${cycle.campaign} → ${cycle.recycledInto || 'En uso'}`}
            >
              {cycle.cycleNumber}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

