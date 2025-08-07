import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { ClubHeader } from "../components/dashboard/ClubHeader";
import { Zap, TrendingDown, Battery, Sun } from "lucide-react";

// Datos simulados de energía
const energyData = [
  { month: 'Ene', consumo: 45600, renovable: 12300, eficiencia: 89, costo: 87500 },
  { month: 'Feb', consumo: 42800, renovable: 13100, eficiencia: 91, costo: 82100 },
  { month: 'Mar', consumo: 48200, renovable: 14800, eficiencia: 88, costo: 92300 },
  { month: 'Abr', consumo: 51300, renovable: 16200, eficiencia: 86, costo: 98600 },
  { month: 'May', consumo: 54700, renovable: 18500, eficiencia: 87, costo: 104800 },
  { month: 'Jun', consumo: 58900, renovable: 20100, eficiencia: 85, costo: 112900 },
];

export default function Energia() {
  const totalConsumo = energyData.reduce((sum, month) => sum + month.consumo, 0);
  const totalRenovable = energyData.reduce((sum, month) => sum + month.renovable, 0);
  const porcentajeRenovable = ((totalRenovable / totalConsumo) * 100).toFixed(1);
  const ahorroAnual = 1350000; // Pesos mexicanos
  const reduccionCO2 = 125.7; // Toneladas CO2

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <ClubHeader />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header del módulo */}
          <div className="mb-8">
            <h1 className="text-3xl font-anton text-gray-800 uppercase tracking-wider">
              Gestión Energética
            </h1>
            <p className="text-gray-600 mt-2">
              Eficiencia energética y proyecto de paneles solares
            </p>
            
            {/* Proyecto solar del club */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100 mt-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Sun className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-900">⚡ Proyecto de Paneles Solares</h3>
                  <p className="text-sm text-yellow-700">
                    En fase de planificación para implementación de sistema solar fotovoltaico
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                    En Desarrollo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-sm border border-yellow-100">
              <div className="flex items-center justify-between mb-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{(totalConsumo/1000).toFixed(0)}</div>
                  <div className="text-sm text-gray-600">MWh total</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Consumo semestral</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <Sun className="w-8 h-8 text-green-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{porcentajeRenovable}%</div>
                  <div className="text-sm text-gray-600">Renovable</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Meta: 50% en 2026</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <TrendingDown className="w-8 h-8 text-blue-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">$1.35M</div>
                  <div className="text-sm text-gray-600">Ahorro anual</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">vs. año anterior</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <Battery className="w-8 h-8 text-purple-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{reduccionCO2}</div>
                  <div className="text-sm text-gray-600">Ton CO₂ reducidas</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Emisiones evitadas</div>
            </div>
          </div>

          {/* Impacto ambiental específico de energía */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8 border border-green-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Impacto Ambiental Energético
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">{reduccionCO2}</div>
                <div className="text-sm text-gray-600 mb-2">Toneladas CO₂ reducidas</div>
                <div className="text-xs text-gray-500">Equivale a plantar 1,574 árboles</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">2.1M</div>
                <div className="text-sm text-gray-600 mb-2">Litros de agua ahorrados</div>
                <div className="text-xs text-gray-500">En generación de energía</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-yellow-600 mb-2">156</div>
                <div className="text-sm text-gray-600 mb-2">Hogares alimentados</div>
                <div className="text-xs text-gray-500">Con energía renovable</div>
              </div>
            </div>
          </div>

          {/* Análisis detallado */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Análisis Energético Detallado
            </h2>
            
            <Tabs defaultValue="consumption" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="consumption">Consumo</TabsTrigger>
                <TabsTrigger value="renewable">Renovables</TabsTrigger>
                <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
                <TabsTrigger value="costs">Costos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="consumption">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value, name) => [`${Number(value).toLocaleString()} kWh`, name]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #273949',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      />
                      <Legend />
                      <Area dataKey="consumo" stackId="1" stroke="#273949" fill="#273949" name="Consumo Total" />
                      <Area dataKey="renovable" stackId="2" stroke="#22c55e" fill="#22c55e" name="Energía Renovable" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="renewable">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                        <YAxis fontSize={12} stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString()} kWh`, 'Energía Renovable']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #22c55e',
                            borderRadius: '12px',
                          }}
                        />
                        <Line type="monotone" dataKey="renovable" stroke="#22c55e" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Fuentes Renovables</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Paneles Solares</span>
                        <span className="text-sm font-bold text-green-600">85%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Energía Eólica</span>
                        <span className="text-sm font-bold text-blue-600">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="efficiency">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Índice de Eficiencia Mensual</h3>
                    {energyData.map((month, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{month.month}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${month.eficiencia}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{month.eficiencia}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-anton text-lg text-gray-800 mb-4 uppercase tracking-wide">
                      Medidas de Eficiencia
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>LED en 100% de luminarias</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Sistema de climatización inteligente</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Monitoreo en tiempo real</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Aislamiento térmico mejorado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="costs">
                <div className="h-[300px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Costo Mensual']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #f59e0b',
                          borderRadius: '12px',
                        }}
                      />
                      <Line type="monotone" dataKey="costo" stroke="#f59e0b" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-100">
                  <h3 className="font-medium text-gray-900 mb-4">Proyección de Ahorros</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-green-600">$2.1M</div>
                      <div className="text-sm text-gray-600">Ahorro proyectado 2025</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">$8.7M</div>
                      <div className="text-sm text-gray-600">Ahorro acumulado 5 años</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">3.2 años</div>
                      <div className="text-sm text-gray-600">ROI proyecto renovables</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}