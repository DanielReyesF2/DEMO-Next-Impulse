import { useState } from 'react';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { egoExhibitors, CURRENT_CLIENT, calculateExhibitorStats } from '@/data/mockExhibitors';
import { ESRCemefiReport, GRIReport, NISMexicoReport, GHGProtocolReport } from '@/components/reports';
import { 
  Package, RefreshCw, Leaf, TrendingUp, ArrowRight, MapPin, 
  FileText, Award, BarChart3, Eye, Download, Clock, CheckCircle2,
  Recycle, Factory, Truck, Zap
} from 'lucide-react';

type TabType = 'overview' | 'exhibidores' | 'reportes';
type ReportStandard = 'esr' | 'gri' | 'nis' | 'ghg';

const standards = [
  { id: 'esr', name: 'ESR', full: 'CEMEFI', icon: Award, color: '#2563EB' },
  { id: 'gri', name: 'GRI', full: 'Standards', icon: FileText, color: '#10B981' },
  { id: 'nis', name: 'NIS', full: 'México', icon: BarChart3, color: '#8B5CF6' },
  { id: 'ghg', name: 'Alcance 3', full: 'GHG Protocol', icon: Leaf, color: '#F59E0B' },
];

const reportHistory = [
  { id: 1, standard: 'gri', date: '2024-12-01', downloadCount: 3 },
  { id: 2, standard: 'ghg', date: '2024-11-15', downloadCount: 5 },
  { id: 3, standard: 'esr', date: '2024-10-20', downloadCount: 2 },
];

export default function Trazabilidad() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedStandard, setSelectedStandard] = useState<ReportStandard>('esr');
  const [showReport, setShowReport] = useState(false);
  
  const exhibitors = egoExhibitors.filter(e => e.clientOwner === CURRENT_CLIENT.company);
  const { company, emissions, materials } = CURRENT_CLIENT;
  
  // Calcular métricas
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
  
  // Top exhibidores por impacto
  const topExhibitors = exhibitors
    .map(exhibitor => {
      const stats = calculateExhibitorStats(exhibitor);
      return { ...exhibitor, stats, impact: stats.emissionsAvoided };
    })
    .sort((a, b) => b.impact - a.impact);

  // Flujos
  const graphicsToGraphics = exhibitors.reduce((sum, e) => sum + e.graphicHistory.filter(g => g.recycledInto === 'graphic').length, 0);
  const graphicsToExhibitors = exhibitors.reduce((sum, e) => sum + e.graphicHistory.filter(g => g.recycledInto === 'exhibitor').length, 0);

  const reportData = {
    exhibitors: totalExhibitors,
    cycles: totalCycles,
    recycledKg: Math.round(totalWeight),
    emissionsAvoided: Math.round(emissions.avoided),
    emissionsGenerated: Math.round(emissions.generated),
    netBalance: Math.round(emissions.netBalance),
    totalMaterialsKg: materials.totalKg,
    recycledMaterialsKg: materials.recycledKg,
    virginMaterialsKg: materials.virginKg,
    recycledContentPercent: 60,
    wasteRecycled: Math.round(totalWeight),
    wasteToLandfill: 0,
    transportKm: 28,
  };

  const getStandardInfo = (id: string) => standards.find(s => s.id === id);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  // Vista de reporte
  if (showReport) {
    return (
      <AppLayout>
        <div className="mb-4">
          <button onClick={() => setShowReport(false)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Volver
          </button>
        </div>
        {selectedStandard === 'esr' && <ESRCemefiReport company={company} period="2024" data={reportData} />}
        {selectedStandard === 'gri' && <GRIReport company={company} period="2024" data={reportData} />}
        {selectedStandard === 'nis' && <NISMexicoReport company={company} period="2024" data={reportData} />}
        {selectedStandard === 'ghg' && <GHGProtocolReport company={company} period="2024" data={reportData} />}
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Sub-navegación */}
        <div className="bg-white border-b border-gray-200 px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-8">
            {[
              { id: 'overview', label: 'Resumen' },
              { id: 'exhibidores', label: 'Mis Exhibidores' },
              { id: 'reportes', label: 'Reportes' },
            ].map(tab => (
              <button
                key={tab.id}
                data-tour={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-emerald-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* ===== TAB: RESUMEN ===== */}
            {activeTab === 'overview' && (
              <>
                {/* Hero con impacto total */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 mb-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Trazabilidad Circular</h1>
                      <p className="text-emerald-100 text-lg">Tu impacto ambiental en tiempo real</p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold">-{(totalEmissionsAvoided/1000).toFixed(1)}t</div>
                      <div className="text-emerald-200">CO₂e evitado</div>
                    </div>
                  </div>
                  
                  {/* Stats en hero */}
                  <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-emerald-500/30">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-emerald-200" />
                      </div>
                      <div className="text-3xl font-bold">{totalExhibitors}</div>
                      <div className="text-emerald-200 text-sm">Exhibidores</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <RefreshCw className="w-5 h-5 text-emerald-200" />
                      </div>
                      <div className="text-3xl font-bold">{totalCycles}</div>
                      <div className="text-emerald-200 text-sm">Ciclos completados</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Recycle className="w-5 h-5 text-emerald-200" />
                      </div>
                      <div className="text-3xl font-bold">{(totalWeight/1000).toFixed(1)}t</div>
                      <div className="text-emerald-200 text-sm">Material reciclado</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-emerald-200" />
                      </div>
                      <div className="text-3xl font-bold">100%</div>
                      <div className="text-emerald-200 text-sm">Tasa de recuperación</div>
                    </div>
                  </div>
                </div>

                {/* Flujos circulares - visual mejorado */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Recycle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Gráficos → Gráficos</h3>
                        <p className="text-sm text-gray-500">Ciclo más frecuente</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-emerald-600">{graphicsToGraphics}</div>
                    <div className="text-sm text-gray-500 mt-1">ciclos registrados</div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        Vinilos usados → Nuevos vinilos
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Factory className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Gráficos → Exhibidores</h3>
                        <p className="text-sm text-gray-500">Transformación completa</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-blue-600">{graphicsToExhibitors}</div>
                    <div className="text-sm text-gray-500 mt-1">ciclos registrados</div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        Vinilos usados → Materia prima
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Proyección 2025</h3>
                        <p className="text-sm text-gray-500">Impacto esperado</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-purple-600">+35%</div>
                    <div className="text-sm text-gray-500 mt-1">crecimiento estimado</div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        ~120 ciclos proyectados
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Exhibidores */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Top Exhibidores por Impacto</h2>
                    <button 
                      onClick={() => setActiveTab('exhibidores')} 
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                      Ver todos <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {topExhibitors.slice(0, 5).map((exhibitor, index) => (
                      <Link key={exhibitor.id} href={`/trazabilidad/${exhibitor.id}`}>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{exhibitor.id}</span>
                              <span className="text-sm text-gray-500">{exhibitor.model}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {exhibitor.location.store}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">{exhibitor.stats.emissionsAvoided.toFixed(0)} kg</div>
                            <div className="text-xs text-gray-500">CO₂ evitado</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{exhibitor.graphicChanges}</div>
                            <div className="text-xs text-gray-500">ciclos</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ===== TAB: EXHIBIDORES ===== */}
            {activeTab === 'exhibidores' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Mis Exhibidores</h1>
                    <p className="text-gray-500">{totalExhibitors} exhibidores activos</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topExhibitors.map((exhibitor) => (
                    <Link key={exhibitor.id} href={`/trazabilidad/${exhibitor.id}`}>
                      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{exhibitor.id}</h3>
                            <p className="text-sm text-gray-500">{exhibitor.model}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            exhibitor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {exhibitor.status === 'active' ? 'Activo' : 'En tránsito'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {exhibitor.location.store}, {exhibitor.location.city}
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">{exhibitor.graphicChanges}</div>
                            <div className="text-xs text-gray-500">ciclos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-emerald-600">{(exhibitor.stats.emissionsAvoided/1000).toFixed(1)}k</div>
                            <div className="text-xs text-gray-500">kg CO₂</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-600">{(exhibitor.stats.totalWeight/1000).toFixed(1)}k</div>
                            <div className="text-xs text-gray-500">kg rec.</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* ===== TAB: REPORTES ===== */}
            {activeTab === 'reportes' && (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">Reportes de Sustentabilidad</h1>
                  <p className="text-gray-500">Genera reportes en diferentes estándares</p>
                </div>

                {/* Selector de estándares */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {standards.map((standard) => {
                    const Icon = standard.icon;
                    const isSelected = selectedStandard === standard.id;
                    return (
                      <button
                        key={standard.id}
                        onClick={() => setSelectedStandard(standard.id as ReportStandard)}
                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: standard.color }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800">{standard.name}</h3>
                        <p className="text-xs text-gray-500">{standard.full}</p>
                        {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>}
                      </button>
                    );
                  })}
                </div>

                {/* Acción */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: getStandardInfo(selectedStandard)?.color }}>
                        {(() => { const Icon = getStandardInfo(selectedStandard)?.icon || FileText; return <Icon className="w-7 h-7 text-white" />; })()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Reporte {getStandardInfo(selectedStandard)?.name} 2024</h2>
                        <p className="text-sm text-gray-500">{getStandardInfo(selectedStandard)?.full} • {company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowReport(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Eye className="w-4 h-4" />Vista previa
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        <Download className="w-4 h-4" />Descargar PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Historial */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-700">Reportes generados</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {reportHistory.map((report) => {
                      const info = getStandardInfo(report.standard);
                      const Icon = info?.icon || FileText;
                      return (
                        <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: info?.color }}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{info?.name} {info?.full}</div>
                              <div className="text-sm text-gray-500">{formatDate(report.date)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />Listo
                            </span>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
