import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { ClubHeader } from "../components/dashboard/ClubHeader";
import { Droplets, TrendingDown, Recycle, Gauge } from "lucide-react";

// Datos simulados de agua
const waterData = [
  { month: 'Ene', consumo: 12800, reciclada: 3200, lluvia: 1850, calidad: 98, costo: 78500 },
  { month: 'Feb', consumo: 11900, reciclada: 3400, lluvia: 2100, calidad: 97, costo: 73200 },
  { month: 'Mar', consumo: 13500, reciclada: 3800, lluvia: 1200, calidad: 99, costo: 83100 },
  { month: 'Abr', consumo: 14200, reciclada: 4100, lluvia: 2800, calidad: 98, costo: 87400 },
  { month: 'May', consumo: 15800, reciclada: 4600, lluvia: 3900, calidad: 96, costo: 97200 },
  { month: 'Jun', consumo: 17300, reciclada: 5100, lluvia: 4200, calidad: 97, costo: 106500 },
];

export default function Agua() {
  const totalConsumo = waterData.reduce((sum, month) => sum + month.consumo, 0);
  const totalReciclada = waterData.reduce((sum, month) => sum + month.reciclada, 0);
  const totalLluvia = waterData.reduce((sum, month) => sum + month.lluvia, 0);
  const porcentajeReciclada = ((totalReciclada / totalConsumo) * 100).toFixed(1);
  const ahorroAnual = 890000; // Pesos mexicanos
  const reduccionHuella = 34.2; // Porcentaje

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <ClubHeader />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header del módulo */}
          <div className="mb-8">
            <h1 className="text-3xl font-anton text-gray-800 uppercase tracking-wider">
              Gestión Hídrica
            </h1>
            <p className="text-gray-600 mt-2">
              PTAR, laguna de riego y sistema de conservación integral
            </p>
            
            {/* Infraestructura del club */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-medium text-blue-900 mb-2">🏭 Planta PTAR</h3>
                <p className="text-sm text-blue-700">
                  Planta de Tratamiento de Aguas Residuales en operación para el procesamiento y reutilización del agua
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="font-medium text-green-900 mb-2">🏌️ Sistema de Riego</h3>
                <p className="text-sm text-green-700">
                  Laguna de almacenamiento para riego eficiente del campo de golf
                </p>
              </div>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <Droplets className="w-8 h-8 text-blue-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{(totalConsumo/1000).toFixed(1)}</div>
                  <div className="text-sm text-gray-600">ML consumidos</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Millones de litros - semestre</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <Recycle className="w-8 h-8 text-green-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{porcentajeReciclada}%</div>
                  <div className="text-sm text-gray-600">Agua reciclada</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Meta: 35% en 2026</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <TrendingDown className="w-8 h-8 text-purple-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">$890K</div>
                  <div className="text-sm text-gray-600">Ahorro anual</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">vs. año anterior</div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-teal-100">
              <div className="flex items-center justify-between mb-3">
                <Gauge className="w-8 h-8 text-teal-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">{reduccionHuella}%</div>
                  <div className="text-sm text-gray-600">Huella hídrica reducida</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Impacto ambiental</div>
            </div>
          </div>

          {/* Impacto ambiental específico de agua */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 mb-8 border border-blue-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Impacto Ambiental Hídrico
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{(totalLluvia/1000).toFixed(1)}ML</div>
                <div className="text-sm text-gray-600 mb-2">Agua de lluvia captada</div>
                <div className="text-xs text-gray-500">Equivale al consumo de 180 hogares</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">{(totalReciclada/1000).toFixed(1)}ML</div>
                <div className="text-sm text-gray-600 mb-2">Agua tratada y reutilizada</div>
                <div className="text-xs text-gray-500">Para riego y servicios</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">67%</div>
                <div className="text-sm text-gray-600 mb-2">Eficiencia hídrica</div>
                <div className="text-xs text-gray-500">vs. promedio nacional</div>
              </div>
            </div>
          </div>

          {/* Análisis detallado */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Análisis Hídrico Detallado
            </h2>
            
            <Tabs defaultValue="consumption" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="consumption">Consumo</TabsTrigger>
                <TabsTrigger value="recycling">Reciclaje</TabsTrigger>
                <TabsTrigger value="rainwater">Pluvial</TabsTrigger>
                <TabsTrigger value="quality">Calidad</TabsTrigger>
              </TabsList>
              
              <TabsContent value="consumption">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waterData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value, name) => [`${Number(value).toLocaleString()} L`, name]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #273949',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      />
                      <Legend />
                      <Area dataKey="consumo" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Consumo Total" />
                      <Area dataKey="reciclada" stackId="2" stroke="#22c55e" fill="#22c55e" name="Agua Reciclada" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="recycling">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={waterData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                        <YAxis fontSize={12} stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString()} L`, 'Agua Reciclada']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #22c55e',
                            borderRadius: '12px',
                          }}
                        />
                        <Bar dataKey="reciclada" fill="#22c55e" name="Agua Reciclada" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Procesos de Tratamiento</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Aguas Grises</span>
                        <span className="text-sm font-bold text-green-600">65%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Osmosis Inversa</span>
                        <span className="text-sm font-bold text-blue-600">25%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Biodigestión</span>
                        <span className="text-sm font-bold text-purple-600">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rainwater">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={waterData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                        <YAxis fontSize={12} stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString()} L`, 'Captación Pluvial']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #06b6d4',
                            borderRadius: '12px',
                          }}
                        />
                        <Line type="monotone" dataKey="lluvia" stroke="#06b6d4" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Sistema de Captación</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>7,500 m² de superficie de captación</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Cisternas con capacidad de 850 m³</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Sistema de filtración automático</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Monitoreo de calidad en tiempo real</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quality">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Índice de Calidad Mensual</h3>
                    {waterData.map((month, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{month.month}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${month.calidad}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{month.calidad}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-anton text-lg text-gray-800 mb-4 uppercase tracking-wide">
                      Parámetros Monitoreados
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>pH</span>
                        <span className="font-bold text-green-600">7.2 ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Turbidez</span>
                        <span className="font-bold text-green-600">0.8 NTU ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cloro residual</span>
                        <span className="font-bold text-green-600">0.7 mg/L ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coliformes</span>
                        <span className="font-bold text-green-600">0 UFC/100mL ✓</span>
                      </div>
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