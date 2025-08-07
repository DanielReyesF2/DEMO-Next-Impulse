import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { ClubHeader } from "../components/dashboard/ClubHeader";
import { TrueCertification } from "../components/dashboard/TrueCertification";
import { EnvironmentalImpact } from "../components/dashboard/EnvironmentalImpact";

interface WasteData {
  id: number;
  date: string;
  organicWaste: number;
  inorganicWaste: number;
  recyclables: number;
  poda: number;
}

export default function Residuos() {
  const { data: wasteData } = useQuery<WasteData[]>({
    queryKey: ["/api/waste-data"],
  });

  if (!wasteData) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos de residuos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Procesar datos para métricas
  const totalWaste = wasteData.reduce((sum, month) => sum + month.organicWaste + month.inorganicWaste + month.recyclables, 0);
  const organicTotal = wasteData.reduce((sum, month) => sum + month.organicWaste, 0);
  const recyclableTotal = wasteData.reduce((sum, month) => sum + month.recyclables, 0);
  const inorganicTotal = wasteData.reduce((sum, month) => sum + month.inorganicWaste, 0);
  
  // Calcular desviación
  const deviationPercentage = ((organicTotal + recyclableTotal) / totalWaste * 100).toFixed(1);

  // Datos para gráficas
  const monthlyData = wasteData.map(month => ({
    name: new Date(month.date).toLocaleDateString('es-MX', { month: 'short' }),
    organicos: Math.round(month.organicWaste * 1000), // kg
    inorganicos: Math.round(month.inorganicWaste * 1000), // kg
    reciclables: Math.round(month.recyclables * 1000), // kg
  }));

  const pieData = [
    { name: 'Orgánicos', value: organicTotal, fill: '#b5e951' },
    { name: 'Reciclables', value: recyclableTotal, fill: '#d97706' },
    { name: 'Inorgánicos', value: inorganicTotal, fill: '#273949' },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <ClubHeader />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header del módulo */}
          <div className="mb-8">
            <h1 className="text-3xl font-anton text-gray-800 uppercase tracking-wider">
              Gestión de Residuos Sólidos
            </h1>
            <p className="text-gray-600 mt-2">
              Seguimiento integral para certificación TRUE Zero Waste
            </p>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{deviationPercentage}%</div>
              <div className="text-sm text-gray-600">Desviación actual</div>
              <div className="text-xs text-gray-500 mt-1">Meta: 90%</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{(organicTotal).toFixed(1)}</div>
              <div className="text-sm text-gray-600">Ton. orgánicas</div>
              <div className="text-xs text-gray-500 mt-1">Compostaje y biodigestión</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-orange-600">{(recyclableTotal).toFixed(1)}</div>
              <div className="text-sm text-gray-600">Ton. reciclables</div>
              <div className="text-xs text-gray-500 mt-1">Valorización material</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-red-600">{(inorganicTotal).toFixed(1)}</div>
              <div className="text-sm text-gray-600">Ton. inorgánicas</div>
              <div className="text-xs text-gray-500 mt-1">Relleno sanitario</div>
            </div>
          </div>

          {/* Impacto ambiental */}
          <EnvironmentalImpact 
            organicWasteDiverted={organicTotal * 1000}
            recyclableWasteDiverted={recyclableTotal * 1000}
          />

          {/* Análisis detallado */}
          <div className="bg-white rounded-xl p-8 mb-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Análisis Detallado de Residuos
            </h2>
            
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="monthly">Tendencia Mensual</TabsTrigger>
                <TabsTrigger value="composition">Composición</TabsTrigger>
                <TabsTrigger value="metrics">Métricas Clave</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value, name) => [`${Number(value).toLocaleString()} kg`, name]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #273949',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="organicos" fill="#b5e951" name="Orgánicos" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="reciclables" fill="#d97706" name="Reciclables" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inorganicos" fill="#273949" name="Inorgánicos" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="composition">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} ton`, 'Cantidad']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Distribución por Categoría</h3>
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }}></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{item.value.toFixed(1)} ton</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TrueCertification currentDeviation={parseFloat(deviationPercentage)} />
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-anton text-lg text-gray-800 mb-4 uppercase tracking-wide">
                      Progreso Mensual
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mejor mes</span>
                        <span className="text-sm font-bold text-green-600">Mayo 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tendencia</span>
                        <span className="text-sm font-bold text-blue-600">↗ Mejorando</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Próxima meta</span>
                        <span className="text-sm font-bold text-purple-600">75% Jul 2025</span>
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