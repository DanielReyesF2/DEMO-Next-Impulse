import { GraphicCycle } from '@/data/mockExhibitors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from 'recharts';

interface EmissionsChartProps {
  cycles: GraphicCycle[];
}

export function EmissionsChart({ cycles }: EmissionsChartProps) {
  // Ordenar por número de ciclo
  const sortedCycles = [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber);
  
  // Calcular emisiones acumuladas y evitadas + Business As Usual
  let cumulativeEmissions = 0;
  let cumulativeAvoided = 0;
  let cumulativeBAU = 0;
  
  const chartData = sortedCycles.map(cycle => {
    cumulativeEmissions += cycle.emissions.total;
    // Emisiones evitadas = peso del gráfico * factor de emisión de material virgen
    const avoided = cycle.weight * 3.5; // 3.5 kg CO2e por kg de plástico virgen
    cumulativeAvoided += avoided;
    
    // Business As Usual: emisiones si usaran material virgen cada vez
    // Producción de material virgen + transporte + procesamiento completo
    const bauForCycle = (cycle.weight * 4.2) + cycle.emissions.transport; // 4.2 kg CO2e por kg plástico virgen
    cumulativeBAU += bauForCycle;
    
    return {
      name: `C${cycle.cycleNumber}`,
      fullName: cycle.campaign,
      transport: cycle.emissions.transport,
      processing: cycle.emissions.processing,
      total: cycle.emissions.total,
      avoided,
      businessAsUsual: Number(bauForCycle.toFixed(2)),
      cumulativeEmissions: Number(cumulativeEmissions.toFixed(2)),
      cumulativeAvoided: Number(cumulativeAvoided.toFixed(2)),
      cumulativeBAU: Number(cumulativeBAU.toFixed(2)),
      netBalance: Number((cumulativeAvoided - cumulativeEmissions).toFixed(2)),
    };
  });

  const totalEmissions = chartData[chartData.length - 1]?.cumulativeEmissions || 0;
  const totalAvoided = chartData[chartData.length - 1]?.cumulativeAvoided || 0;
  const totalBAU = chartData[chartData.length - 1]?.cumulativeBAU || 0;
  const netBalance = chartData[chartData.length - 1]?.netBalance || 0;
  const savingsPercent = totalBAU > 0 ? Math.round(((totalBAU - totalEmissions) / totalBAU) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPIs de resumen */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          <div className="text-xl font-bold text-gray-500">{totalBAU.toFixed(0)}</div>
          <div className="text-xs text-gray-400">Sin reciclar</div>
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg text-center">
          <div className="text-xl font-bold text-emerald-600">{totalEmissions.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Con reciclaje</div>
        </div>
        <div className="p-3 bg-emerald-100 rounded-lg text-center">
          <div className="text-xl font-bold text-emerald-700">-{(totalBAU - totalEmissions).toFixed(0)}</div>
          <div className="text-xs text-gray-500">kg CO₂ ahorrados</div>
        </div>
        <div className="p-3 bg-emerald-600 rounded-lg text-center">
          <div className="text-xl font-bold text-white">{savingsPercent}%</div>
          <div className="text-xs text-emerald-100">menos emisiones</div>
        </div>
      </div>

      {/* Gráfico de emisiones por ciclo con BAU */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Emisiones por Ciclo vs Sin Reciclar</h4>
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
                    const savings = data.businessAsUsual - data.total;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 text-sm">{data.fullName}</p>
                        <p className="text-xs text-gray-500 mt-1">Ciclo {label?.replace('C', '')}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs"><span className="text-gray-400">■</span> Sin reciclar: {data.businessAsUsual} kg CO₂e</p>
                          <p className="text-xs"><span className="text-emerald-600">■</span> Con reciclaje: {data.total} kg CO₂e</p>
                          <p className="text-xs font-medium text-emerald-600 pt-1 border-t border-gray-100">
                            Ahorro: -{savings.toFixed(1)} kg CO₂e
                          </p>
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
              {/* Barra gris de fondo = Business As Usual */}
              <Bar dataKey="businessAsUsual" fill="#e5e7eb" name="Sin reciclar (BAU)" radius={[4, 4, 0, 0]} />
              {/* Barra verde = emisiones reales con reciclaje */}
              <Bar dataKey="total" fill="#10B981" name="Con reciclaje" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          La barra gris muestra lo que emitirías sin reciclar. La verde es tu huella real.
        </p>
      </div>

      {/* Gráfico de emisiones acumuladas vs BAU */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Emisiones Acumuladas: Reciclaje vs Tradicional</h4>
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const savings = data.cumulativeBAU - data.cumulativeEmissions;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 text-sm">{data.fullName}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs"><span className="text-gray-400">●</span> Sin reciclar: {data.cumulativeBAU} kg CO₂e</p>
                          <p className="text-xs"><span className="text-emerald-500">●</span> Con reciclaje: {data.cumulativeEmissions} kg CO₂e</p>
                          <p className="text-xs font-bold text-emerald-600 pt-1 border-t border-gray-100">
                            Ahorro total: -{savings.toFixed(0)} kg CO₂e
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {/* Área gris = Business As Usual acumulado */}
              <Area 
                type="monotone" 
                dataKey="cumulativeBAU" 
                fill="#f3f4f6" 
                stroke="#9ca3af" 
                strokeDasharray="5 5"
                name="Sin reciclar (acum.)"
              />
              {/* Área verde = emisiones reales con reciclaje */}
              <Area 
                type="monotone" 
                dataKey="cumulativeEmissions" 
                fill="#d1fae5" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Con reciclaje (acum.)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          El área entre las líneas representa todo el CO₂ que evitas al reciclar.
        </p>
      </div>
    </div>
  );
}

