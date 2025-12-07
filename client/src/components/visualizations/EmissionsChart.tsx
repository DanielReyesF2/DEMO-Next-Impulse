import { GraphicCycle } from '@/data/mockExhibitors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart, ComposedChart } from 'recharts';

interface EmissionsChartProps {
  cycles: GraphicCycle[];
}

export function EmissionsChart({ cycles }: EmissionsChartProps) {
  // Ordenar por número de ciclo
  const sortedCycles = [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber);
  
  // Calcular emisiones acumuladas y evitadas
  let cumulativeEmissions = 0;
  let cumulativeAvoided = 0;
  
  const chartData = sortedCycles.map(cycle => {
    cumulativeEmissions += cycle.emissions.total;
    // Emisiones evitadas = peso del gráfico * factor de emisión de material virgen
    const avoided = cycle.weight * 3.5; // 3.5 kg CO2e por kg de plástico virgen
    cumulativeAvoided += avoided;
    
    return {
      name: `C${cycle.cycleNumber}`,
      fullName: cycle.campaign,
      transport: cycle.emissions.transport,
      processing: cycle.emissions.processing,
      total: cycle.emissions.total,
      avoided,
      cumulativeEmissions: Number(cumulativeEmissions.toFixed(2)),
      cumulativeAvoided: Number(cumulativeAvoided.toFixed(2)),
      netBalance: Number((cumulativeAvoided - cumulativeEmissions).toFixed(2)),
    };
  });

  const totalEmissions = chartData[chartData.length - 1]?.cumulativeEmissions || 0;
  const totalAvoided = chartData[chartData.length - 1]?.cumulativeAvoided || 0;
  const netBalance = chartData[chartData.length - 1]?.netBalance || 0;

  return (
    <div className="space-y-6">
      {/* KPIs de resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-900">{totalEmissions.toFixed(1)}</div>
          <div className="text-xs text-gray-500">kg CO₂e generados</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-emerald-600">{totalAvoided.toFixed(1)}</div>
          <div className="text-xs text-gray-500">kg CO₂e evitados</div>
        </div>
        <div className="p-4 bg-emerald-100 rounded-lg text-center">
          <div className="text-2xl font-bold text-emerald-700">-{netBalance.toFixed(1)}</div>
          <div className="text-xs text-gray-500">kg CO₂e balance neto</div>
        </div>
      </div>

      {/* Gráfico de emisiones por ciclo */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Emisiones por Ciclo</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                stroke="#9ca3af"
                label={{ value: 'kg CO₂e', angle: -90, position: 'insideLeft', fontSize: 10 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 text-sm">{data.fullName}</p>
                        <p className="text-xs text-gray-500 mt-1">Ciclo {label?.replace('C', '')}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs"><span className="text-blue-600">■</span> Transporte: {data.transport} kg CO₂e</p>
                          <p className="text-xs"><span className="text-emerald-600">■</span> Procesamiento: {data.processing} kg CO₂e</p>
                          <p className="text-xs font-medium">Total: {data.total} kg CO₂e</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="transport" stackId="a" fill="#3B82F6" name="Transporte" radius={[0, 0, 0, 0]} />
              <Bar dataKey="processing" stackId="a" fill="#10B981" name="Procesamiento" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de balance acumulado */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Balance Acumulado de Emisiones</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                stroke="#9ca3af"
                label={{ value: 'kg CO₂e', angle: -90, position: 'insideLeft', fontSize: 10 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 text-sm">{data.fullName}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs"><span className="text-red-500">●</span> Emisiones acum.: {data.cumulativeEmissions} kg CO₂e</p>
                          <p className="text-xs"><span className="text-emerald-500">●</span> Evitadas acum.: {data.cumulativeAvoided} kg CO₂e</p>
                          <p className="text-xs font-medium text-emerald-600">Balance: -{data.netBalance} kg CO₂e</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area 
                type="monotone" 
                dataKey="cumulativeAvoided" 
                fill="#d1fae5" 
                stroke="#10B981" 
                name="Evitadas (acum.)"
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeEmissions" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 3 }}
                name="Generadas (acum.)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

