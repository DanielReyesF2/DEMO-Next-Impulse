import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { egoExhibitors, CURRENT_CLIENT, calculateExhibitorStats } from '@/data/mockExhibitors';
import { CleanStatCard } from '@/components/ui/CleanStatCard';
import { Package, RefreshCw, Leaf, TrendingUp, ArrowRight, MapPin } from 'lucide-react';

export default function Trazabilidad() {
  const exhibitors = egoExhibitors.filter(e => e.clientOwner === CURRENT_CLIENT.company);
  
  // Calcular métricas totales
  const totalExhibitors = exhibitors.length;
  const totalCycles = exhibitors.reduce((sum, e) => sum + e.graphicChanges, 0);
  const totalEmissionsAvoided = exhibitors.reduce((sum, e) => {
    const stats = calculateExhibitorStats(e);
    return sum + stats.emissionsAvoided;
  }, 0);
  const totalWeight = exhibitors.reduce((sum, e) => {
    const stats = calculateExhibitorStats(e);
    return sum + stats.totalWeight;
  }, 0);
  const avgCycles = totalExhibitors > 0 ? (totalCycles / totalExhibitors).toFixed(1) : '0';
  
  // Top exhibidores por impacto
  const topExhibitors = exhibitors
    .map(exhibitor => {
      const stats = calculateExhibitorStats(exhibitor);
      return {
        ...exhibitor,
        stats,
        impact: stats.emissionsAvoided
      };
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-700 mb-2">Trazabilidad</h1>
            <p className="text-gray-600">Visión general de la trazabilidad de tus exhibidores y gráficos</p>
          </div>

          {/* KPIs principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <CleanStatCard
              title="Exhibidores"
              value={totalExhibitors}
              unit=""
              description="en operación"
              icon="Package"
              color="emerald"
            />
            <CleanStatCard
              title="Ciclos totales"
              value={totalCycles}
              unit=""
              description={`${avgCycles} por exhibidor`}
              icon="RefreshCw"
              color="blue"
            />
            <CleanStatCard
              title="CO₂e evitado"
              value={totalEmissionsAvoided.toFixed(0)}
              unit="kg"
              description="acumulado"
              icon="Leaf"
              color="emerald"
            />
            <CleanStatCard
              title="Material reciclado"
              value={totalWeight.toFixed(0)}
              unit="kg"
              description="acumulado"
              icon="TrendingUp"
              color="purple"
            />
          </div>

          {/* Top Exhibidores por Impacto */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-700">Top Exhibidores por Impacto</h2>
              <Link href="/exhibidores" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topExhibitors.map((exhibitor, index) => (
                <Link key={exhibitor.id} href={`/trazabilidad/${exhibitor.id}`}>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                          <h3 className="font-semibold text-gray-900">{exhibitor.id}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{exhibitor.model}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{exhibitor.location.store}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Leaf className="w-4 h-4" />
                          <span className="font-semibold">{exhibitor.stats.emissionsAvoided.toFixed(0)} kg CO₂</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <RefreshCw className="w-4 h-4" />
                          <span className="font-medium">{exhibitor.graphicChanges} ciclos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Resumen de Flujos Circulares */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Flujos de Economía Circular</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">Gráficos → Gráficos</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Vinilos usados reciclados en nuevos gráficos (más frecuente)
                </p>
                <div className="text-2xl font-bold text-emerald-600">
                  {exhibitors.reduce((sum, e) => {
                    return sum + e.graphicHistory.filter(g => g.recycledInto === 'graphic').length;
                  }, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">ciclos registrados</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Gráficos → Exhibidores</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Vinilos reciclados convertidos en materia prima para exhibidores
                </p>
                <div className="text-2xl font-bold text-blue-600">
                  {exhibitors.reduce((sum, e) => {
                    return sum + e.graphicHistory.filter(g => g.recycledInto === 'exhibitor').length;
                  }, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">ciclos registrados</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Impacto Total</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Reducción de emisiones y material reciclado en todos los flujos
                </p>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-purple-600">
                    -{totalEmissionsAvoided.toFixed(0)} kg CO₂
                  </div>
                  <div className="text-xs text-gray-500">evitado</div>
                  <div className="text-lg font-bold text-purple-600 mt-2">
                    {totalWeight.toFixed(0)} kg
                  </div>
                  <div className="text-xs text-gray-500">material reciclado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
