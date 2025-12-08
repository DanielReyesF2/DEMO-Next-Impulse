import AppLayout from '@/components/layout/AppLayout';
import { CURRENT_CLIENT, egoExhibitors } from '@/data/mockExhibitors';
import { Package, Recycle, Clock, Leaf, TrendingUp, Droplets, Zap, TreePine, Car, Factory } from 'lucide-react';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { company, totalExhibitors, totalGraphicsRecycled, emissions, comparison, materials } = CURRENT_CLIENT;

  // Cálculos detallados
  const emissionsSavings = Math.round((1 - comparison.circularEmissions / comparison.traditionalEmissions) * 100);
  const costSavings = Math.round((1 - comparison.circularCost / comparison.traditionalCost) * 100);
  const totalCycles = egoExhibitors.reduce((sum, e) => sum + e.graphicChanges, 0);
  const avgCyclesPerExhibitor = (totalCycles / totalExhibitors).toFixed(1);
  const co2PerCycle = (emissions.avoided / totalCycles).toFixed(2);
  const savingsPerExhibitor = Math.round((comparison.traditionalCost - comparison.circularCost) / totalExhibitors);

  // Equivalencias de impacto ambiental (basadas en emisiones evitadas)
  const co2Avoided = emissions.avoided; // kg CO2
  const waterSaved = Math.round(co2Avoided * 8.2); // litros de agua (aprox 8.2L por kg CO2)
  const energySaved = Math.round(co2Avoided * 2.4); // kWh (aprox 2.4 kWh por kg CO2)
  const treesEquivalent = (co2Avoided / 21).toFixed(1); // Un árbol absorbe ~21kg CO2/año
  const kmCarAvoided = Math.round(co2Avoided / 0.12); // 0.12 kg CO2 por km en auto
  const plasticDiverted = materials.recycledKg; // kg de plástico desviado de relleno

  // Datos para gráfico de ciclos por año
  const cyclesByYear = [
    { year: '2019', cycles: 12 },
    { year: '2020', cycles: 28 },
    { year: '2021', cycles: 35 },
    { year: '2022', cycles: 32 },
    { year: '2023', cycles: 30 },
    { year: '2024', cycles: 19 },
  ];

  // Datos para pie chart de flujos
  const flowData = [
    { name: '→ Gráficos', value: 64, color: '#10B981' },
    { name: '→ Exhibidores', value: 36, color: '#3B82F6' },
  ];

  // Top exhibidores por ciclos
  const topExhibitors = [...egoExhibitors]
    .sort((a, b) => b.graphicChanges - a.graphicChanges)
    .slice(0, 3);

  return (
    <AppLayout>
      {/* Header con fecha */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Ejecutivo</h1>
        <span className="text-sm text-gray-400">Actualizado: {new Date().toLocaleDateString('es-MX')}</span>
            </div>

      {/* KPIs principales - 2 filas */}
      <div data-tour="dashboard-kpis" className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-1" />+2 YTD</span>
            </div>
          <div className="text-2xl font-semibold text-gray-700">{totalExhibitors}</div>
          <div className="text-xs text-gray-500">Exhibidores activos</div>
          </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Recycle className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-1" />+23%</span>
                  </div>
          <div className="text-2xl font-semibold text-gray-700">{totalGraphicsRecycled}</div>
          <div className="text-xs text-gray-500">Gráficos reciclados (2024)</div>
                  </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
                </div>
          <div className="text-2xl font-semibold text-gray-700">{avgCyclesPerExhibitor}</div>
          <div className="text-xs text-gray-500">Ciclos promedio / exhibidor</div>
              </div>
        
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-emerald-600">-{emissionsSavings}% vs tradicional</span>
                  </div>
          <div className="text-2xl font-bold text-emerald-600">-{Math.abs(emissions.netBalance).toFixed(0)} kg</div>
          <div className="text-xs text-gray-500">CO₂e balance neto</div>
                </div>
              </div>

      {/* IMPACTO AMBIENTAL EN TIEMPO REAL - Nueva sección */}
      <div data-tour="dashboard-impacto" className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-emerald-800">🌍 Impacto Ambiental Total - {company}</h3>
          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">En tiempo real</span>
                  </div>
        
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Leaf className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
            <div className="text-xl font-bold text-emerald-600">{co2Avoided}</div>
            <div className="text-xs text-gray-500">kg CO₂ evitados</div>
              </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-xl font-bold text-blue-600">{waterSaved.toLocaleString()}</div>
            <div className="text-xs text-gray-500">litros agua ahorrados</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-xl font-bold text-yellow-600">{energySaved.toLocaleString()}</div>
            <div className="text-xs text-gray-500">kWh energía evitada</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <TreePine className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-xl font-bold text-green-600">{treesEquivalent}</div>
            <div className="text-xs text-gray-500">árboles equivalentes</div>
              </div>
              
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Car className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-xl font-bold text-gray-700">{kmCarAvoided.toLocaleString()}</div>
            <div className="text-xs text-gray-500">km auto evitados</div>
                        </div>
                        
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Factory className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-xl font-bold text-purple-600">{plasticDiverted}</div>
            <div className="text-xs text-gray-500">kg plástico reciclado</div>
                          </div>
                        </div>
                        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Equivalente a <span className="font-medium text-emerald-700">{treesEquivalent} árboles absorbiendo CO₂ por 1 año</span> 
            {' '}o <span className="font-medium text-blue-700">{kmCarAvoided.toLocaleString()} km</span> que un auto dejó de recorrer
          </p>
                          </div>
                        </div>
                        
      {/* Comparativa + Gráfico */}
      <div data-tour="dashboard-comparativa" className="grid grid-cols-2 gap-6 mb-6">
        {/* Comparativa */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Comparativa: Tradicional vs Circular</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Emisiones CO₂e</span>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 line-through">{comparison.traditionalEmissions.toLocaleString()}</span>
                  <span className="font-bold text-emerald-600">{comparison.circularEmissions} kg</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">-{emissionsSavings}%</span>
                </div>
                          </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${100 - emissionsSavings}%` }}></div>
                        </div>
                      </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Costo anual</span>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 line-through">${(comparison.traditionalCost/1000).toFixed(0)}k</span>
                  <span className="font-bold text-emerald-600">${(comparison.circularCost/1000).toFixed(0)}k</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">-{costSavings}%</span>
                    </div>
                          </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${100 - costSavings}%` }}></div>
                        </div>
                          </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Residuos generados</span>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 line-through">{comparison.traditionalWaste} kg</span>
                  <span className="font-bold text-emerald-600">0 kg</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">-100%</span>
                        </div>
                          </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                          </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Ahorro total anual</span>
                <span className="text-lg font-bold text-emerald-600">${((comparison.traditionalCost - comparison.circularCost)/1000).toFixed(0)}k MXN</span>
                        </div>
                      </div>
                    </div>
                  </div>

        {/* Gráfico de ciclos por año */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Ciclos de Reciclaje por Año</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cyclesByYear}>
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ fontSize: 12 }}
                  formatter={(value: number) => [`${value} ciclos`, 'Ciclos']}
                />
                <Bar dataKey="cycles" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
                        </div>
          <div className="text-xs text-gray-400 text-center mt-2">Total histórico: {totalCycles} ciclos</div>
                      </div>
                    </div>

      {/* Flujos circulares + Top Exhibidores */}
      <div className="grid grid-cols-3 gap-6">
        {/* Flujos */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Destino del Reciclaje</h3>
          <div className="flex items-center justify-center">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={flowData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="value"
                  >
                    {flowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4 space-y-2">
              {flowData.map((item) => (
                <div key={item.name} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                  <span className="ml-2 font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
              </div>

        {/* Top Exhibidores */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Top Exhibidores por Rendimiento</h3>
            <Link href="/exhibidores">
              <span className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer">Ver todos →</span>
            </Link>
                </div>
          <div className="space-y-3">
            {topExhibitors.map((exhibitor, index) => (
              <div key={exhibitor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-200 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>{index + 1}</span>
                  <div>
                    <div className="font-medium text-sm">{exhibitor.id}</div>
                    <div className="text-xs text-gray-400">{exhibitor.location.store}</div>
              </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{exhibitor.graphicChanges} ciclos</div>
                  <div className="text-xs text-gray-400">{exhibitor.yearsInOperation.toFixed(1)} años</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
