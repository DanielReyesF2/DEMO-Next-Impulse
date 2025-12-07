import { GraphicCycle } from '@/data/mockExhibitors';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CircularFlowDiagramProps {
  cycles: GraphicCycle[];
}

export function CircularFlowDiagram({ cycles }: CircularFlowDiagramProps) {
  // Contar destinos de reciclaje
  const recycledToExhibitor = cycles.filter(c => c.recycledInto === 'exhibitor').length;
  const recycledToGraphic = cycles.filter(c => c.recycledInto === 'graphic').length;
  const active = cycles.filter(c => c.recycledInto === null).length;
  
  const totalRecycled = recycledToExhibitor + recycledToGraphic;
  const completedCycles = cycles.filter(c => c.endDate !== null);
  
  // Calcular peso total reciclado
  const totalWeightToExhibitor = completedCycles
    .filter(c => c.recycledInto === 'exhibitor')
    .reduce((sum, c) => sum + c.weight, 0);
  const totalWeightToGraphic = completedCycles
    .filter(c => c.recycledInto === 'graphic')
    .reduce((sum, c) => sum + c.weight, 0);

  const pieData = [
    { name: '→ Exhibidores', value: recycledToExhibitor, color: '#3B82F6', weight: totalWeightToExhibitor },
    { name: '→ Gráficos', value: recycledToGraphic, color: '#10B981', weight: totalWeightToGraphic },
  ];

  return (
    <div className="space-y-6">
      {/* Diagrama visual de flujos */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Fuente: Gráficos usados */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-400">
              <div>
                <div className="text-2xl">🎨</div>
                <div className="text-xs font-bold text-amber-700">{totalRecycled}</div>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">Gráficos Reciclados</div>
            <div className="text-xs text-gray-500">{(totalWeightToExhibitor + totalWeightToGraphic).toFixed(1)} kg</div>
          </div>
          
          {/* Flechas de flujo */}
          <div className="flex flex-col items-center space-y-4">
            {/* Flecha hacia exhibidores */}
            <div className="flex items-center space-x-2">
              <div className="w-16 h-0.5 bg-blue-500"></div>
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blue-500"></div>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              Economía<br/>Circular
            </div>
            
            {/* Flecha hacia gráficos */}
            <div className="flex items-center space-x-2">
              <div className="w-16 h-0.5 bg-emerald-500"></div>
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-emerald-500"></div>
            </div>
          </div>
          
          {/* Destinos */}
          <div className="space-y-4">
            {/* Exhibidores */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-400">
                <div className="text-center">
                  <div className="text-xl">📦</div>
                  <div className="text-xs font-bold text-blue-700">{recycledToExhibitor}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Nuevos Exhibidores</div>
                <div className="text-xs text-gray-500">{totalWeightToExhibitor.toFixed(1)} kg reciclados</div>
              </div>
            </div>
            
            {/* Gráficos */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center border-2 border-emerald-400">
                <div className="text-center">
                  <div className="text-xl">🎨</div>
                  <div className="text-xs font-bold text-emerald-700">{recycledToGraphic}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Nuevos Gráficos</div>
                <div className="text-xs text-gray-500">{totalWeightToGraphic.toFixed(1)} kg reciclados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie chart */}
      <div className="grid grid-cols-2 gap-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
                        <p className="text-gray-600">{data.weight?.toFixed(1)} kg</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Leyenda y stats */}
        <div className="flex flex-col justify-center space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <div>
              <div className="text-sm font-medium">→ Nuevos Exhibidores</div>
              <div className="text-xs text-gray-500">{recycledToExhibitor} ciclos ({((recycledToExhibitor/totalRecycled)*100).toFixed(0)}%)</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <div>
              <div className="text-sm font-medium">→ Nuevos Gráficos</div>
              <div className="text-xs text-gray-500">{recycledToGraphic} ciclos ({((recycledToGraphic/totalRecycled)*100).toFixed(0)}%)</div>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="text-sm text-gray-500">
              Total reciclado: <span className="font-bold text-gray-900">{(totalWeightToExhibitor + totalWeightToGraphic).toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de flujos */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Historial de Reciclaje por Ciclo</h4>
        <div className="flex flex-wrap gap-1">
          {cycles.map((cycle, index) => (
            <div
              key={cycle.id}
              className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                cycle.recycledInto === 'exhibitor' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : cycle.recycledInto === 'graphic'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}
              title={`Ciclo ${cycle.cycleNumber}: ${cycle.campaign} → ${cycle.recycledInto || 'Activo'}`}
            >
              {cycle.cycleNumber}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
            <span>→ Exhibidor</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></div>
            <span>→ Gráfico</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></div>
            <span>Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

