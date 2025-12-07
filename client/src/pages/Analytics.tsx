import AppLayout from '@/components/layout/AppLayout';
import { useClientData } from '@/hooks/useClientData';
import { ImpactMetricsHero } from '@/components/dashboard/ImpactMetricsHero';
import { 
  TrendingUp, 
  Package, 
  Leaf, 
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#00C853', '#2196F3', '#9C27B0', '#FF6D00', '#FFC107'];

export default function Analytics() {
  const { lots: clientLots, metrics, currentClient } = useClientData();

  // Mock monthly data basada en los datos del cliente
  const monthlyData = [
    { month: 'Ene', cycles: Math.floor(metrics.totalCycles * 0.08), emissions: metrics.totalEmissionsAvoided * 0.08, plastic: metrics.totalPlasticRecycled * 0.08 },
    { month: 'Feb', cycles: Math.floor(metrics.totalCycles * 0.10), emissions: metrics.totalEmissionsAvoided * 0.10, plastic: metrics.totalPlasticRecycled * 0.10 },
    { month: 'Mar', cycles: Math.floor(metrics.totalCycles * 0.12), emissions: metrics.totalEmissionsAvoided * 0.12, plastic: metrics.totalPlasticRecycled * 0.12 },
    { month: 'Abr', cycles: Math.floor(metrics.totalCycles * 0.14), emissions: metrics.totalEmissionsAvoided * 0.14, plastic: metrics.totalPlasticRecycled * 0.14 },
    { month: 'May', cycles: Math.floor(metrics.totalCycles * 0.16), emissions: metrics.totalEmissionsAvoided * 0.16, plastic: metrics.totalPlasticRecycled * 0.16 },
    { month: 'Jun', cycles: Math.floor(metrics.totalCycles * 0.18), emissions: metrics.totalEmissionsAvoided * 0.18, plastic: metrics.totalPlasticRecycled * 0.18 },
    { month: 'Jul', cycles: Math.floor(metrics.totalCycles * 0.20), emissions: metrics.totalEmissionsAvoided * 0.20, plastic: metrics.totalPlasticRecycled * 0.20 },
    { month: 'Ago', cycles: Math.floor(metrics.totalCycles * 0.12), emissions: metrics.totalEmissionsAvoided * 0.12, plastic: metrics.totalPlasticRecycled * 0.12 }
  ];

  // Flow type distribution del cliente
  const flowTypeData = [
    { 
      name: 'Gráficos → Exhibidores', 
      value: clientLots.filter(l => l.flowType === 'graficos-exhibidores').length, 
      color: '#8B5CF6' 
    },
    { 
      name: 'Exhibidores → Exhibidores', 
      value: clientLots.filter(l => l.flowType === 'exhibidores-exhibidores').length, 
      color: '#3B82F6' 
    },
    { 
      name: 'Gráficos → Gráficos', 
      value: clientLots.filter(l => l.flowType === 'graficos-graficos').length, 
      color: '#6366F1' 
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Mi Impacto Ambiental
            </h1>
            <p className="text-gray-600 text-lg">
              Métricas detalladas y proyecciones de {currentClient.name}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ImpactMetricsHero
              title="Mis Ciclos Totales"
              value={metrics.totalCycles}
              subtitle="completados"
              icon={<Package className="w-8 h-8" />}
              color="blue"
              trend={{
                value: 15,
                isPositive: true
              }}
            />
            
            <ImpactMetricsHero
              title="Mi CO₂ Evitado"
              value={`${metrics.totalEmissionsAvoided.toFixed(1)} kg`}
              subtitle="emisiones reducidas"
              icon={<Leaf className="w-8 h-8" />}
              color="green"
              trend={{
                value: 12,
                isPositive: true
              }}
            />
            
            <ImpactMetricsHero
              title="Mi Material Reciclado"
              value={`${metrics.totalPlasticRecycled.toFixed(0)} kg`}
              subtitle="plástico recuperado"
              icon={<TrendingUp className="w-8 h-8" />}
              color="purple"
            />
            
            <ImpactMetricsHero
              title="Mi Promedio Ciclos"
              value={metrics.avgCyclesPerLot.toFixed(1)}
              subtitle="ciclos por lote"
              icon={<BarChart3 className="w-8 h-8" />}
              color="orange"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Mis Tendencias Mensuales</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cycles" 
                    stroke="#2196F3" 
                    strokeWidth={3}
                    name="Ciclos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke="#00C853" 
                    strokeWidth={3}
                    name="CO₂ Evitado (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Flow Type Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Mi Distribución por Tipo de Flujo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={flowTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {flowTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projections */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white">
            <h3 className="text-2xl font-black mb-6">Mis Proyecciones 2024</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-black mb-2">{Math.floor(metrics.totalCycles * 1.5)}+</div>
                <div className="text-green-100">Ciclos estimados</div>
                <div className="text-sm text-green-200 mt-2">+50% vs actual</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black mb-2">{(metrics.totalEmissionsAvoided * 1.5).toFixed(0)} kg</div>
                <div className="text-green-100">CO₂ evitado proyectado</div>
                <div className="text-sm text-green-200 mt-2">+50% vs actual</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black mb-2">$12K</div>
                <div className="text-green-100">Ahorros acumulados</div>
                <div className="text-sm text-green-200 mt-2">+40% vs actual</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
