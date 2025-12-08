import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { egoExhibitors, CURRENT_CLIENT, calculateExhibitorStats } from '@/data/mockExhibitors';
import { CleanStatCard } from '@/components/ui/CleanStatCard';
import { ESRCemefiReport, GRIReport, NISMexicoReport, GHGProtocolReport } from '@/components/reports';
import { Package, RefreshCw, Leaf, TrendingUp, ArrowRight, MapPin, FileText, Award, BarChart3, Eye, Download, Clock, CheckCircle2 } from 'lucide-react';

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
  const [, setLocation] = useLocation();
  
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
  const avgCycles = totalExhibitors > 0 ? (totalCycles / totalExhibitors).toFixed(1) : '0';
  
  // Top exhibidores por impacto
  const topExhibitors = exhibitors
    .map(exhibitor => {
      const stats = calculateExhibitorStats(exhibitor);
      return { ...exhibitor, stats, impact: stats.emissionsAvoided };
    })
    .sort((a, b) => b.impact - a.impact);

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
        <div className="bg-white border-b border-gray-200 px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('exhibidores')}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                activeTab === 'exhibidores'
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Mis Exhibidores
            </button>
            <button
              onClick={() => setActiveTab('reportes')}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                activeTab === 'reportes'
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Reportes
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* TAB: Resumen */}
            {activeTab === 'overview' && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-medium text-gray-700 mb-2">Trazabilidad</h1>
                  <p className="text-gray-600">Visión general de tus exhibidores y gráficos</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <CleanStatCard title="Exhibidores" value={totalExhibitors} description="en operación" icon="Package" color="emerald" />
                  <CleanStatCard title="Ciclos totales" value={totalCycles} description={`${avgCycles} por exhibidor`} icon="RefreshCw" color="blue" />
                  <CleanStatCard title="CO₂e evitado" value={totalEmissionsAvoided.toFixed(0)} unit="kg" description="acumulado" icon="Leaf" color="emerald" />
                  <CleanStatCard title="Material reciclado" value={totalWeight.toFixed(0)} unit="kg" description="acumulado" icon="TrendingUp" color="purple" />
                </div>

                {/* Top Exhibidores */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-700">Top Exhibidores</h2>
                    <button onClick={() => setActiveTab('exhibidores')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                      Ver todos <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topExhibitors.slice(0, 3).map((exhibitor, index) => (
                      <Link key={exhibitor.id} href={`/trazabilidad/${exhibitor.id}`}>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                            <h3 className="font-semibold text-gray-900">{exhibitor.id}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{exhibitor.model}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-1 text-emerald-600">
                              <Leaf className="w-4 h-4" />
                              <span className="font-semibold">{exhibitor.stats.emissionsAvoided.toFixed(0)} kg</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <RefreshCw className="w-4 h-4" />
                              <span>{exhibitor.graphicChanges}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Flujos */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-4">Flujos de Economía Circular</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <RefreshCw className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-900">Gráficos → Gráficos</h3>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {exhibitors.reduce((sum, e) => sum + e.graphicHistory.filter(g => g.recycledInto === 'graphic').length, 0)}
                      </div>
                      <div className="text-xs text-gray-500">ciclos</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Gráficos → Exhibidores</h3>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {exhibitors.reduce((sum, e) => sum + e.graphicHistory.filter(g => g.recycledInto === 'exhibitor').length, 0)}
                      </div>
                      <div className="text-xs text-gray-500">ciclos</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">Impacto Total</h3>
                      </div>
                      <div className="text-lg font-bold text-purple-600">-{totalEmissionsAvoided.toFixed(0)} kg CO₂</div>
                      <div className="text-xs text-gray-500">{totalWeight.toFixed(0)} kg reciclado</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB: Exhibidores */}
            {activeTab === 'exhibidores' && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-medium text-gray-700 mb-2">Mis Exhibidores</h1>
                  <p className="text-gray-600">{totalExhibitors} exhibidores en operación</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topExhibitors.map((exhibitor) => (
                    <Link key={exhibitor.id} href={`/trazabilidad/${exhibitor.id}`}>
                      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">{exhibitor.id}</h3>
                            <p className="text-sm text-gray-500">{exhibitor.model}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            exhibitor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {exhibitor.status === 'active' ? 'Activo' : 'En tránsito'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {exhibitor.location.store}, {exhibitor.location.city}
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{exhibitor.graphicChanges}</div>
                            <div className="text-xs text-gray-500">ciclos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-emerald-600">{exhibitor.stats.emissionsAvoided.toFixed(0)}</div>
                            <div className="text-xs text-gray-500">kg CO₂</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{exhibitor.stats.totalWeight.toFixed(0)}</div>
                            <div className="text-xs text-gray-500">kg rec.</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* TAB: Reportes */}
            {activeTab === 'reportes' && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-medium text-gray-700 mb-2">Reportes</h1>
                  <p className="text-gray-600">Genera reportes de sustentabilidad</p>
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
                          isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'
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
                      <button onClick={() => setShowReport(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        <Eye className="w-4 h-4" />Vista previa
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                        <Download className="w-4 h-4" />Descargar PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Historial */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-700">Historial</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {reportHistory.map((report) => {
                      const info = getStandardInfo(report.standard);
                      const Icon = info?.icon || FileText;
                      return (
                        <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
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
                              <CheckCircle2 className="w-3 h-3" />Generado
                            </span>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
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
