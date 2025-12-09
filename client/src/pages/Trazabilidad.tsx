import { useState } from 'react';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { egoExhibitors, CURRENT_CLIENT, calculateExhibitorStats } from '@/data/mockExhibitors';
import { ESRCemefiReport, GRIReport, NISMexicoReport, GHGProtocolReport, ISO14001Report } from '@/components/reports';
import { 
  Package, RefreshCw, Leaf, TrendingUp, ArrowRight, MapPin, 
  FileText, Award, BarChart3, Eye, Download, Clock, CheckCircle2,
  Recycle, Factory, Truck, Zap, Calendar, ChevronDown, Filter
} from 'lucide-react';

type TabType = 'overview' | 'exhibidores' | 'reportes';
type ReportStandard = 'esr' | 'gri' | 'nis' | 'ghg' | 'iso14001';
type ReportPeriod = 'Q1-2024' | 'Q2-2024' | 'Q3-2024' | 'Q4-2024' | 'all';

const standards = [
  { id: 'esr', name: 'ESR', full: 'CEMEFI', icon: Award, color: '#2563EB' },
  { id: 'gri', name: 'GRI', full: 'Standards', icon: FileText, color: '#10B981' },
  { id: 'nis', name: 'NIS', full: 'México', icon: BarChart3, color: '#8B5CF6' },
  { id: 'ghg', name: 'Alcance 3', full: 'GHG Protocol', icon: Leaf, color: '#F59E0B' },
  { id: 'iso14001', name: 'ISO 14001', full: 'Gestión Ambiental', icon: Award, color: '#059669' },
];

const periods = [
  { id: 'all', label: 'Todos los períodos', short: 'Todo' },
  { id: 'Q1-2025', label: 'Q1 2025 (Ene-Mar)', short: 'Q1 2025' },
  { id: 'Q4-2024', label: 'Q4 2024 (Oct-Dic)', short: 'Q4 2024' },
  { id: 'Q3-2024', label: 'Q3 2024 (Jul-Sep)', short: 'Q3 2024' },
  { id: 'Q2-2024', label: 'Q2 2024 (Abr-Jun)', short: 'Q2 2024' },
  { id: 'Q1-2024', label: 'Q1 2024 (Ene-Mar)', short: 'Q1 2024' },
];

// Historial extendido con trazabilidad
const reportHistory = [
  // Q1 2025 - Período actual
  { id: 0, standard: 'ghg', period: 'Q1-2025', date: '2025-01-15', downloadCount: 1, cycles: 3, kg: 180, co2: 22 },
  // Q4 2024
  { id: 1, standard: 'gri', period: 'Q4-2024', date: '2024-12-01', downloadCount: 3, cycles: 8, kg: 420, co2: 45 },
  { id: 2, standard: 'ghg', period: 'Q4-2024', date: '2024-11-15', downloadCount: 5, cycles: 8, kg: 420, co2: 45 },
  { id: 3, standard: 'iso14001', period: 'Q4-2024', date: '2024-10-20', downloadCount: 2, cycles: 8, kg: 420, co2: 45 },
  // Q3 2024
  { id: 4, standard: 'esr', period: 'Q3-2024', date: '2024-09-30', downloadCount: 4, cycles: 7, kg: 380, co2: 38 },
  { id: 5, standard: 'gri', period: 'Q3-2024', date: '2024-09-15', downloadCount: 2, cycles: 7, kg: 380, co2: 38 },
  // Q2 2024
  { id: 6, standard: 'ghg', period: 'Q2-2024', date: '2024-06-28', downloadCount: 3, cycles: 8, kg: 410, co2: 42 },
  { id: 7, standard: 'esr', period: 'Q2-2024', date: '2024-06-15', downloadCount: 1, cycles: 8, kg: 410, co2: 42 },
  // Q1 2024
  { id: 8, standard: 'gri', period: 'Q1-2024', date: '2024-03-29', downloadCount: 2, cycles: 7, kg: 350, co2: 35 },
  { id: 9, standard: 'iso14001', period: 'Q1-2024', date: '2024-02-15', downloadCount: 1, cycles: 7, kg: 350, co2: 35 },
];

export default function Trazabilidad() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedStandard, setSelectedStandard] = useState<ReportStandard>('esr');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('Q4-2024');
  const [showReport, setShowReport] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
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
  const periodLabel = selectedPeriod === 'all' ? '2024' : selectedPeriod.replace('-', ' ');

  // Vista de reporte
  if (showReport) {
    return (
      <AppLayout>
        <div className="mb-4">
          <button onClick={() => setShowReport(false)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Volver a Reportes
          </button>
        </div>
        {selectedStandard === 'esr' && <ESRCemefiReport company={company} period={periodLabel} data={reportData} />}
        {selectedStandard === 'gri' && <GRIReport company={company} period={periodLabel} data={reportData} />}
        {selectedStandard === 'nis' && <NISMexicoReport company={company} period={periodLabel} data={reportData} />}
        {selectedStandard === 'ghg' && <GHGProtocolReport company={company} period={periodLabel} data={reportData} />}
        {selectedStandard === 'iso14001' && <ISO14001Report company={company} period={periodLabel} data={reportData} />}
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
                {/* Header con título y KPIs compactos */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">¿Cómo funciona nuestro sistema de trazabilidad?</h1>
                      <p className="text-gray-500">Tenemos dos flujos que trabajan juntos para eliminar los residuos</p>
                    </div>
                    {/* KPIs compactos a la derecha */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-lg font-bold text-emerald-600">-{(totalEmissionsAvoided/1000).toFixed(1)}t</div>
                          <div className="text-xs text-gray-500">CO₂ evitado</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                        <Recycle className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-lg font-bold text-blue-600">{(totalWeight/1000).toFixed(1)}t</div>
                          <div className="text-xs text-gray-500">Reciclado</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explicación de los dos flujos */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                  
                  {/* Los dos flujos principales */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Flujo 1: Exhibidores */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-900">Los Exhibidores</h3>
                          <p className="text-sm text-blue-600">Estructura permanente</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span className="text-gray-700">Hechos de <strong>material 100% reciclado</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span className="text-gray-700">Duran <strong>más de 10 años</strong> en tienda</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span className="text-gray-700">Pueden recibir <strong>40+ gráficos</strong> en su vida útil</span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-blue-200 flex items-center justify-between">
                        <span className="text-blue-600 font-medium">{totalExhibitors} exhibidores activos</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Larga duración</span>
                      </div>
                    </div>

                    {/* Flujo 2: Gráficos */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <Recycle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-emerald-900">Los Gráficos</h3>
                          <p className="text-sm text-emerald-600">Se reciclan cada campaña</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span className="text-gray-700">También de <strong>material reciclado</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span className="text-gray-700">Se cambian cada <strong>~3 meses</strong> (por campaña)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span className="text-gray-700">Un exhibidor recibe <strong>4 gráficos/año</strong></span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between">
                        <span className="text-emerald-600 font-medium">{totalCycles} ciclos completados</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Alta rotación</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline visual del ciclo */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-emerald-600" />
                      Así funciona el ciclo de un gráfico
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Cuando termina una campaña, recolectamos el gráfico, lo reciclamos, y regresa como uno nuevo
                    </p>
                    
                    {/* Timeline horizontal */}
                    <div className="relative">
                      {/* Línea de tiempo */}
                      <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 rounded-full"></div>
                      
                      <div className="grid grid-cols-6 gap-2 relative">
                        {/* Enero 2026 - Entrega */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg relative z-10">
                            <Package className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-xs font-bold text-emerald-700">Ene 2026</div>
                          <div className="text-[10px] text-gray-500 mt-1">Next Impulse entrega<br/>exhibidor + gráfico A</div>
                          <div className="mt-2 px-2 py-1 bg-emerald-100 rounded text-[10px] text-emerald-700 font-medium">🆕 Gráfico nuevo</div>
                        </div>

                        {/* Marzo 2026 - Regresa */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-500 flex items-center justify-center shadow-lg relative z-10">
                            <Truck className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-xs font-bold text-amber-700">Mar 2026</div>
                          <div className="text-[10px] text-gray-500 mt-1">Termina campaña<br/>Cliente regresa gráfico A</div>
                          <div className="mt-2 px-2 py-1 bg-amber-100 rounded text-[10px] text-amber-700 font-medium">📦 Se recolecta</div>
                        </div>

                        {/* Abril 2026 - Reciclaje */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-purple-500 flex items-center justify-center shadow-lg relative z-10">
                            <Factory className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-xs font-bold text-purple-700">Abr 2026</div>
                          <div className="text-[10px] text-gray-500 mt-1">Gráfico A se recicla<br/>se convierte en materia prima</div>
                          <div className="mt-2 px-2 py-1 bg-purple-100 rounded text-[10px] text-purple-700 font-medium">♻️ Se recicla</div>
                        </div>

                        {/* Junio 2026 - Regresa nuevo */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg relative z-10 ring-4 ring-emerald-200">
                            <Recycle className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-xs font-bold text-emerald-700">Jun 2026</div>
                          <div className="text-[10px] text-gray-500 mt-1">¡Gráfico A regresa!<br/>como gráfico nuevo (B)</div>
                          <div className="mt-2 px-2 py-1 bg-emerald-100 rounded text-[10px] text-emerald-700 font-medium">🔄 El mismo material</div>
                        </div>

                        {/* Septiembre 2026 - Ciclo 2 */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-500 flex items-center justify-center shadow-lg relative z-10">
                            <Truck className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-xs font-bold text-amber-700">Sep 2026</div>
                          <div className="text-[10px] text-gray-500 mt-1">Termina campaña B<br/>Se recolecta de nuevo</div>
                          <div className="mt-2 px-2 py-1 bg-amber-100 rounded text-[10px] text-amber-700 font-medium">📦 Otro ciclo</div>
                        </div>

                        {/* Diciembre 2026 - Y así... */}
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg relative z-10">
                            <TrendingUp className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-xs font-bold text-emerald-700">Dic 2026</div>
                          <div className="text-[10px] text-gray-500 mt-1">¡Regresa otra vez!<br/>Como gráfico nuevo (C)</div>
                          <div className="mt-2 px-2 py-1 bg-emerald-100 rounded text-[10px] text-emerald-700 font-medium">♾️ Y sigue...</div>
                        </div>
                      </div>
                    </div>

                    {/* Nota explicativa */}
                    <div className="mt-6 flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>El gráfico "salta" un ciclo:</strong> Mientras tu nueva campaña está en tienda con gráfico B, 
                          el material del gráfico A anterior se está procesando para regresar en la siguiente campaña. 
                          Así, el mismo material puede usarse <strong>20+ veces</strong> durante la vida del exhibidor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impacto Real - Equivalencias */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">¿Qué significa tu impacto?</h2>
                      <p className="text-sm text-gray-500">Traducimos los números a cosas que puedes imaginar</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 rounded-full text-sm font-medium text-emerald-700">
                      -{(totalEmissionsAvoided/1000).toFixed(1)} toneladas de CO₂
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Árboles */}
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <div className="text-4xl mb-2">🌳</div>
                      <div className="text-2xl font-bold text-emerald-600">{Math.round(totalEmissionsAvoided / 21)}</div>
                      <div className="text-sm text-gray-600">Árboles plantados</div>
                      <div className="text-xs text-gray-400 mt-1">equivalente en 1 año</div>
                    </div>
                    
                    {/* Viajes en coche */}
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="text-4xl mb-2">🚗</div>
                      <div className="text-2xl font-bold text-blue-600">{Math.round(totalEmissionsAvoided / 0.21).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Km en coche</div>
                      <div className="text-xs text-gray-400 mt-1">que no se recorrieron</div>
                    </div>
                    
                    {/* Vuelos */}
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="text-4xl mb-2">✈️</div>
                      <div className="text-2xl font-bold text-purple-600">{(totalEmissionsAvoided / 255).toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Vuelos CDMX-NY</div>
                      <div className="text-xs text-gray-400 mt-1">que se evitaron</div>
                    </div>
                    
                    {/* Hogares */}
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-2xl font-bold text-amber-600">{(totalEmissionsAvoided / 4600).toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Casas por 1 año</div>
                      <div className="text-xs text-gray-400 mt-1">energía ahorrada</div>
                    </div>
                  </div>

                  {/* Comparativa vs Tradicional */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Comparado con el modelo tradicional
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Modelo tradicional */}
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm font-medium text-red-700">Si fuera desechable</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Exhibidores comprados:</span>
                            <span className="font-medium text-red-600">{totalCycles} unidades</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Material desperdiciado:</span>
                            <span className="font-medium text-red-600">{(totalWeight).toFixed(0)} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">CO₂ emitido:</span>
                            <span className="font-medium text-red-600">+{(totalEmissionsAvoided + 500).toFixed(0)} kg</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Modelo circular */}
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-medium text-emerald-700">Con Next Impulse</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Exhibidores necesarios:</span>
                            <span className="font-medium text-emerald-600">{totalExhibitors} unidades</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Material en circulación:</span>
                            <span className="font-medium text-emerald-600">{(totalWeight).toFixed(0)} kg ♻️</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">CO₂ neto:</span>
                            <span className="font-medium text-emerald-600">-{totalEmissionsAvoided.toFixed(0)} kg 🌱</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Resumen del ahorro */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white text-center">
                      <span className="text-sm">Ahorraste </span>
                      <span className="text-lg font-bold">{Math.round((1 - totalExhibitors/totalCycles) * 100)}%</span>
                      <span className="text-sm"> en materiales y </span>
                      <span className="text-lg font-bold">{(totalEmissionsAvoided/1000).toFixed(1)}t</span>
                      <span className="text-sm"> de CO₂</span>
                    </div>
                  </div>
                </div>

                {/* Acciones Rápidas + Perfil */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Perfil de la empresa */}
                  <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Tu compromiso ambiental</h2>
                        <p className="text-sm text-gray-500">Resumen de {company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Cliente desde 2019
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Economía Circular
                        </span>
                      </div>
                    </div>
                    
                    {/* Timeline de logros */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-gray-800">{totalExhibitors}</div>
                        <div className="text-xs text-gray-500">Exhibidores activos</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600">{totalCycles}</div>
                        <div className="text-xs text-gray-500">Ciclos completados</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">5.9</div>
                        <div className="text-xs text-gray-500">Años promedio/exhibidor</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">100%</div>
                        <div className="text-xs text-gray-500">Tasa de reciclaje</div>
                      </div>
                    </div>

                    {/* Logros/Badges */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg border-2 border-white">🌱</div>
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg border-2 border-white">♻️</div>
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg border-2 border-white">🏆</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">Top 10% de clientes en impacto ambiental</div>
                        <div className="text-xs text-gray-500">Más de 9 toneladas de CO₂ evitadas desde 2019</div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Qué quieres hacer?</h2>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('exhibidores')}
                        className="w-full flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 group-hover:text-emerald-700">Ver mis exhibidores</div>
                          <div className="text-xs text-gray-500">{totalExhibitors} activos</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                      </button>

                      <button 
                        onClick={() => setActiveTab('reportes')}
                        className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 group-hover:text-blue-700">Generar reporte</div>
                          <div className="text-xs text-gray-500">ESR, GRI, ISO 14001...</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </button>

                      <Link href={`/trazabilidad/${topExhibitors[0]?.id || 'EXH-EGO-001'}`}>
                        <div className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left group cursor-pointer">
                          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 group-hover:text-purple-700">Ver trazabilidad</div>
                            <div className="text-xs text-gray-500">Detalle de un exhibidor</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ===== TAB: EXHIBIDORES ===== */}
            {activeTab === 'exhibidores' && (
              <>
                {/* Header con KPIs */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Mis Exhibidores</h1>
                      <p className="text-gray-500">Tu flota de exhibidores circulares</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                        <Package className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-lg font-bold text-emerald-600">{totalExhibitors}</div>
                          <div className="text-xs text-gray-500">Activos</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                        <RefreshCw className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-lg font-bold text-blue-600">{totalCycles}</div>
                          <div className="text-xs text-gray-500">Ciclos totales</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resumen rápido */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">{totalExhibitors}</div>
                        <div className="text-xs text-gray-500">Exhibidores</div>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">{(totalEmissionsAvoided/1000).toFixed(1)}t</div>
                        <div className="text-xs text-gray-500">CO₂ evitado</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{(totalWeight/1000).toFixed(1)}t</div>
                        <div className="text-xs text-gray-500">Material reciclado</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{(totalCycles/totalExhibitors).toFixed(0)}</div>
                        <div className="text-xs text-gray-500">Ciclos promedio</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid de exhibidores mejorado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topExhibitors.map((exhibitor, index) => (
                    <Link key={exhibitor.id} href={`/trazabilidad/${exhibitor.id}`}>
                      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                          {/* Número de ranking */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                              index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                              index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                              'bg-gradient-to-br from-emerald-400 to-emerald-500'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          
                          {/* Info del exhibidor */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{exhibitor.id}</h3>
                                <p className="text-sm text-gray-500">{exhibitor.model}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                exhibitor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {exhibitor.status === 'active' ? '● Activo' : '◐ En tránsito'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {exhibitor.location.store}, {exhibitor.location.city}
                            </div>

                            {/* Métricas del exhibidor */}
                            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">{exhibitor.graphicChanges}</div>
                                <div className="text-[10px] text-gray-500">Ciclos</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-emerald-600">{exhibitor.stats.emissionsAvoided.toFixed(0)}</div>
                                <div className="text-[10px] text-gray-500">kg CO₂</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-600">{exhibitor.stats.totalWeight.toFixed(0)}</div>
                                <div className="text-[10px] text-gray-500">kg rec.</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-600">{exhibitor.yearsInOperation.toFixed(1)}</div>
                                <div className="text-[10px] text-gray-500">Años</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Barra de progreso del impacto */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Contribución al impacto total</span>
                            <span className="font-medium text-emerald-600">
                              {((exhibitor.stats.emissionsAvoided / totalEmissionsAvoided) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                              style={{ width: `${(exhibitor.stats.emissionsAvoided / totalEmissionsAvoided) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Nota informativa */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Haz clic en cualquier exhibidor</strong> para ver su historia completa de reciclaje, 
                      incluyendo todos los ciclos, campañas y el impacto ambiental detallado.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ===== TAB: REPORTES ===== */}
            {activeTab === 'reportes' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Genera tu Reporte</h1>
                    <p className="text-gray-500">Documenta tu impacto ambiental</p>
                  </div>
                  
                  {/* Selector de período */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-gray-700">
                        {periods.find(p => p.id === selectedPeriod)?.short}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showPeriodDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
                        {periods.map((period) => (
                          <button
                            key={period.id}
                            onClick={() => {
                              setSelectedPeriod(period.id as ReportPeriod);
                              setShowPeriodDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                              selectedPeriod === period.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                            }`}
                          >
                            <div className="font-medium">{period.short}</div>
                            {period.id !== 'all' && (
                              <div className="text-xs text-gray-400">{period.label.split(' (')[1]?.replace(')', '')}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen de datos disponibles */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Datos: {selectedPeriod === 'all' ? 'Todo 2024-2025' : selectedPeriod.replace('-', ' ')}
                        </h3>
                        <p className="text-sm text-gray-500">Lo que incluirá tu reporte</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center px-5 py-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-gray-800">{totalExhibitors}</div>
                        <div className="text-xs text-gray-500">Exhibidores</div>
                      </div>
                      <div className="text-center px-5 py-3 bg-emerald-50 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600">{totalCycles}</div>
                        <div className="text-xs text-gray-500">Ciclos</div>
                      </div>
                      <div className="text-center px-5 py-3 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{(totalWeight/1000).toFixed(1)}t</div>
                        <div className="text-xs text-gray-500">Reciclado</div>
                      </div>
                      <div className="text-center px-5 py-3 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">-{(totalEmissionsAvoided/1000).toFixed(1)}t</div>
                        <div className="text-xs text-gray-500">CO₂</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selector de estándares */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">¿Qué formato necesitas?</h3>
                      <p className="text-sm text-gray-500">Elige el estándar que pide tu organización</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {standards.map((standard) => {
                      const Icon = standard.icon;
                      const isSelected = selectedStandard === standard.id;
                      return (
                        <button
                          key={standard.id}
                          onClick={() => setSelectedStandard(standard.id as ReportStandard)}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: standard.color }}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-bold text-gray-800 text-sm">{standard.name}</h3>
                          <p className="text-[10px] text-gray-500 leading-tight">{standard.full}</p>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Acción */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: getStandardInfo(selectedStandard)?.color }}>
                        {(() => { const Icon = getStandardInfo(selectedStandard)?.icon || FileText; return <Icon className="w-8 h-8 text-white" />; })()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          Reporte {getStandardInfo(selectedStandard)?.name} - {selectedPeriod === 'all' ? '2024' : selectedPeriod.replace('-', ' ')}
                        </h2>
                        <p className="text-sm text-gray-500">{getStandardInfo(selectedStandard)?.full} • {company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowReport(true)} className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                        <Eye className="w-5 h-5" />Ver primero
                      </button>
                      <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
                        <Download className="w-5 h-5" />Descargar PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Historial con trazabilidad */}
                <div className="bg-white rounded-2xl border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-700">Historial de Reportes</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Filter className="w-3 h-3" />
                      {selectedPeriod === 'all' ? 'Todos' : `Filtrando: ${selectedPeriod.replace('-', ' ')}`}
                    </div>
                  </div>
                  
                  {/* Agrupados por trimestre */}
                  {(() => {
                    const filteredHistory = selectedPeriod === 'all' 
                      ? reportHistory 
                      : reportHistory.filter(r => r.period === selectedPeriod);
                    
                    const groupedByPeriod = filteredHistory.reduce((acc, report) => {
                      if (!acc[report.period]) acc[report.period] = [];
                      acc[report.period].push(report);
                      return acc;
                    }, {} as Record<string, typeof reportHistory>);
                    
                    return Object.entries(groupedByPeriod).map(([period, reports]) => (
                      <div key={period}>
                        {/* Header del período */}
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-700">{period.replace('-', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{reports[0].cycles} ciclos</span>
                            <span>{reports[0].kg} kg</span>
                            <span className="text-emerald-600">-{reports[0].co2} kg CO₂</span>
                          </div>
                        </div>
                        
                        {/* Reportes del período */}
                        <div className="divide-y divide-gray-100">
                          {reports.map((report) => {
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
                                  <button 
                                    onClick={() => {
                                      setSelectedStandard(report.standard as ReportStandard);
                                      setShowReport(true);
                                    }}
                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Ver reporte"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                  
                  {/* Si no hay reportes en el período */}
                  {selectedPeriod !== 'all' && !reportHistory.some(r => r.period === selectedPeriod) && (
                    <div className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">No hay reportes en este período</p>
                      <p className="text-sm text-gray-400">Genera tu primer reporte de {selectedPeriod.replace('-', ' ')}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
