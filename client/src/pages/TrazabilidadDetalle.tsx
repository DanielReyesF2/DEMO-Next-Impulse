import { useState } from 'react';
import { useRoute } from 'wouter';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { getExhibitorById, calculateExhibitorStats, GraphicCycle, ProcessPhoto, ProductionSpecs } from '@/data/mockExhibitors';
import { CycleSpiral } from '@/components/visualizations/CycleSpiral';
import { CycleTimeline } from '@/components/visualizations/CycleTimeline';
import { EmissionsChart } from '@/components/visualizations/EmissionsChart';
import { CircularFlowDiagram } from '@/components/visualizations/CircularFlowDiagram';
import { Download, FileText, MapPin, Calendar, Recycle, Route, Scale, Leaf, Clock, TrendingUp, Package, Palette, Droplets, Zap, TreePine, Camera, Factory, Gauge, Box } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

type TabType = 'timeline' | 'emissions' | 'flows' | 'evidence';

export default function TrazabilidadDetalle() {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [selectedCycle, setSelectedCycle] = useState<number | undefined>(undefined);
  const [, params] = useRoute<{ exhibitorId: string }>('/trazabilidad/:exhibitorId');
  const exhibitorId = params?.exhibitorId;

  const exhibitor = exhibitorId ? getExhibitorById(exhibitorId) : null;

  if (!exhibitor) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-xl text-gray-900">Exhibidor no encontrado</h1>
          <Link href="/trazabilidad">
            <button className="mt-4 text-emerald-600 hover:text-emerald-700">Volver</button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const stats = calculateExhibitorStats(exhibitor);
  const lifeProgress = Math.min((exhibitor.yearsInOperation / 10) * 100, 100);
  
  const avgCycleDuration = (exhibitor.yearsInOperation * 12 / exhibitor.graphicChanges).toFixed(1);
  const emissionsPerCycle = (stats.totalEmissions / stats.totalCycles).toFixed(2);
  const weightPerCycle = (stats.totalWeight / stats.totalCycles).toFixed(1);
  const distancePerCycle = (stats.totalDistance / stats.totalCycles).toFixed(0);
  const cyclesPerYear = (stats.totalCycles / exhibitor.yearsInOperation).toFixed(1);
  
  const traditionalEmissions = exhibitor.graphicChanges * 12.5;
  const savingsVsTraditional = Math.round((1 - stats.totalEmissions / traditionalEmissions) * 100);

  // Equivalencias de impacto
  const co2Avoided = stats.emissionsAvoided;
  const waterSaved = Math.round(co2Avoided * 8.2);
  const energySaved = Math.round(co2Avoided * 2.4);
  const treesEquivalent = (co2Avoided / 21).toFixed(1);

  const handleCycleSelect = (cycle: GraphicCycle) => {
    setSelectedCycle(cycle.cycleNumber);
    setActiveTab('timeline');
  };

  const tabs = [
    { id: 'timeline' as const, label: 'Ciclos', count: stats.totalCycles },
    { id: 'emissions' as const, label: 'Emisiones' },
    { id: 'flows' as const, label: 'Flujos' },
    { id: 'evidence' as const, label: 'Evidencia', icon: Camera },
  ];

  // Fotos del proceso - usar las del exhibidor si existen
  const processPhotos: ProcessPhoto[] = exhibitor.processPhotos || [
    {
      id: 1,
      title: 'Recolectamos los gráficos',
      description: 'Vinilos y gráficos listos para reciclar',
      imageUrl: '',
      date: 'Nov 2024',
      weight: '45 kg',
    },
    {
      id: 2,
      title: 'Lo procesamos',
      description: 'Separamos y trituramos',
      imageUrl: '',
      date: 'Nov 2024',
      weight: '42 kg',
    },
    {
      id: 3,
      title: 'Listo para usar',
      description: 'Material reciclado para nuevos productos',
      imageUrl: '',
      date: 'Nov 2024',
      weight: '40 kg',
    },
  ];
  
  const productionSpecs = exhibitor.productionSpecs;

  // Calcular datos para el storytelling
  const sortedCycles = [...exhibitor.graphicHistory].sort((a, b) => a.cycleNumber - b.cycleNumber);
  const firstCycle = sortedCycles[0];
  const firstCycleDate = firstCycle ? new Date(firstCycle.startDate).toLocaleDateString('es-MX', { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  }) : '';
  const initialWeight = firstCycle ? (firstCycle.weight * 1.015).toFixed(0) : '0';

  return (
    <AppLayout>
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
        <Link href="/trazabilidad"><span className="hover:text-gray-600 cursor-pointer">Exhibidores</span></Link>
        <span>/</span>
        <span className="text-gray-600">{exhibitor.id}</span>
      </nav>

      {/* Banner Narrativo Principal */}
      <div data-tour="trazabilidad-banner" className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Recycle className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">
              {stats.totalCycles} veces reciclado
            </h2>
            <p className="text-emerald-100 text-sm">
              Empezó el <span className="font-semibold text-white">{firstCycleDate}</span> con <span className="font-semibold text-white">{initialWeight} kg</span> de vinilos usados
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">-{stats.netBalance.toFixed(0)}</div>
            <div className="text-emerald-100 text-xs">kg CO₂ ahorrados</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-700">{exhibitor.id}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">{exhibitor.model}</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{exhibitor.dimensions}</span>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              exhibitor.condition === 'excellent' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {exhibitor.condition === 'excellent' ? 'Excelente' : 'Bueno'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4 mr-2" />CSV
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">
            <FileText className="w-4 h-4 mr-2" />Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* KPIs principales */}
          <div data-tour="trazabilidad-stats" className="grid grid-cols-6 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Recycle className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
              <div className="text-xl font-semibold text-gray-700">{stats.totalCycles}</div>
              <div className="text-xs text-gray-500">Veces reciclado</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Scale className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-xl font-semibold text-gray-700">{stats.totalWeight.toFixed(0)}</div>
              <div className="text-xs text-gray-500">kg reciclados</div>
            </div>
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
              <Leaf className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <div className="text-xl font-bold text-emerald-600">-{stats.netBalance.toFixed(0)}</div>
              <div className="text-xs text-gray-500">kg CO₂ ahorrado</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Route className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <div className="text-xl font-semibold text-gray-700">{stats.totalDistance}</div>
              <div className="text-xs text-gray-500">km recorridos</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-xl font-semibold text-gray-700">{cyclesPerYear}</div>
              <div className="text-xs text-gray-500">veces al año</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-gray-500" />
              <div className="text-xl font-semibold text-gray-700">{avgCycleDuration}</div>
              <div className="text-xs text-gray-500">meses cada uno</div>
            </div>
          </div>

          {/* Impacto Ambiental - Equivalencias */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 p-4">
            <h3 className="text-sm font-medium text-emerald-800 mb-3">🌍 Lo que lograste con este exhibidor</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <Leaf className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <div className="text-lg font-bold text-emerald-600">{co2Avoided.toFixed(0)}</div>
                <div className="text-xs text-gray-500">kg CO₂ no emitidos</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <div className="text-lg font-bold text-blue-600">{waterSaved.toLocaleString()}</div>
                <div className="text-xs text-gray-500">litros agua</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <div className="text-lg font-bold text-yellow-600">{energySaved}</div>
                <div className="text-xs text-gray-500">kWh energía</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <TreePine className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="text-lg font-bold text-green-600">{treesEquivalent}</div>
                <div className="text-xs text-gray-500">árboles plantados</div>
              </div>
            </div>
          </div>

          {/* Vista Espiral - Ciclo de Vida Circular */}
          <div data-tour="trazabilidad-espiral" className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-600 text-center mb-4 tracking-wide">Historia de este exhibidor</h3>
            
            {/* Texto Explicativo Sutil */}
            <div className="mb-4 space-y-2 max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 text-center">
                Cada círculo es una vez que se recicló. El punto naranja del centro es el inicio: los vinilos usados que recolectamos. Los verdes se hicieron nuevos gráficos, los azules se hicieron exhibidores.
              </p>
              <p className="text-xs text-gray-500 text-center">
                Cada vez que termina una campaña, el material se recicla y vuelve a usarse. Así se crea un ciclo que no tiene fin.
              </p>
            </div>
            
            <CycleSpiral 
              cycles={exhibitor.graphicHistory}
              onCycleSelect={handleCycleSelect}
              selectedCycleNumber={selectedCycle}
            />
            
            {/* Balance de CO2 - datos clave */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                <div className="text-xs text-red-600 font-medium mb-1">CO₂ que sí se emitió</div>
                <div className="text-xl font-bold text-red-600">{stats.totalEmissions.toFixed(0)}</div>
                <div className="text-[10px] text-red-500">kg CO₂</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                <div className="text-xs text-emerald-600 font-medium mb-1">CO₂ que se evitó</div>
                <div className="text-xl font-bold text-emerald-600">{stats.emissionsAvoided.toFixed(0)}</div>
                <div className="text-[10px] text-emerald-500">kg CO₂</div>
              </div>
            </div>
            
            {/* Balance Neto */}
            <div className="mt-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-center text-white">
              <div className="text-xs font-medium opacity-90 mb-1">Al final, te ahorraste</div>
              <div className="text-2xl font-bold">
                {(stats.totalEmissions - stats.emissionsAvoided).toFixed(0)} kg CO₂
              </div>
              <div className="text-xs opacity-80 mt-1">
                Y no usaste {stats.totalWeight.toFixed(0)} kg de material nuevo
              </div>
            </div>
          </div>

          {/* Promedios por ciclo */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Cada vez que reciclas...</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">{emissionsPerCycle}</div>
                <div className="text-xs text-gray-500">kg CO₂</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">{weightPerCycle}</div>
                <div className="text-xs text-gray-500">kg de material</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">{distancePerCycle}</div>
                <div className="text-xs text-gray-500">km de transporte</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-lg font-bold text-emerald-600">-{savingsVsTraditional}%</div>
                <div className="text-xs text-gray-500">vs no reciclar</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div data-tour="trazabilidad-timeline" className="bg-white rounded-xl border border-gray-200">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                    activeTab === tab.id ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  <span>{tab.label}</span>
                  {tab.count && <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">{tab.count}</span>}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 'timeline' && (
                <CycleTimeline 
                  cycles={exhibitor.graphicHistory} 
                  selectedCycleNumber={selectedCycle}
                  exhibitorId={exhibitor.id}
                />
              )}
              {activeTab === 'emissions' && <EmissionsChart cycles={exhibitor.graphicHistory} />}
              {activeTab === 'flows' && <CircularFlowDiagram cycles={exhibitor.graphicHistory} />}
              {activeTab === 'evidence' && (
                <div className="space-y-6">
                  {/* Fotos del proceso */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-gray-600">Fotos del Ciclo {stats.totalCycles} - {exhibitor.currentGraphic.campaign}</h3>
                    <p className="text-sm text-gray-500">Evidencia fotográfica de la producción actual</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {processPhotos.map((photo) => (
                      <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                        {photo.imageUrl ? (
                          <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            <img 
                              src={photo.imageUrl} 
                              alt={photo.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Si no carga la imagen, mostrar placeholder
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                const placeholder = document.createElement('div');
                                placeholder.className = 'text-center p-4';
                                placeholder.innerHTML = `
                                  <svg class="w-8 h-8 mx-auto mb-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <p class="text-sm text-gray-500">${photo.title}</p>
                                  <p class="text-xs text-emerald-500 mt-1">Guarda la imagen en: ${photo.imageUrl}</p>
                                `;
                                target.parentElement?.appendChild(placeholder);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-200 flex items-center justify-center">
                            <div className="text-center p-4">
                              <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">{photo.title}</p>
                              <p className="text-xs text-gray-400 mt-1">{photo.description}</p>
                            </div>
                          </div>
                        )}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-700">{photo.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{photo.description}</p>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">{photo.date}</span>
                            {photo.weight && <span className="text-xs font-medium text-emerald-600">{photo.weight}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Especificaciones técnicas */}
                  {productionSpecs && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-600 mb-4 text-center">Especificaciones Técnicas</h3>
                      <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Factory className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Orden de Trabajo: {productionSpecs.orderNumber}</h4>
                            <p className="text-sm text-gray-500">{exhibitor.currentGraphic.campaign}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                            <Box className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                            <div className="text-lg font-bold text-gray-700">{productionSpecs.totalUnits.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Piezas totales</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                            <Scale className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                            <div className="text-lg font-bold text-gray-700">{productionSpecs.weightPerUnit} gr</div>
                            <div className="text-xs text-gray-500">Peso por pieza</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                            <Package className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                            <div className="text-lg font-bold text-gray-700">{productionSpecs.totalPallets}</div>
                            <div className="text-xs text-gray-500">Tarimas</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                            <Gauge className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                            <div className="text-lg font-bold text-gray-700">{productionSpecs.cycleTime}s</div>
                            <div className="text-xs text-gray-500">Tiempo ciclo</div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-100">
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Material</h5>
                            <p className="text-sm text-gray-800 font-mono">{productionSpecs.material}</p>
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                              <span>HDPE: <strong className="text-emerald-600">{productionSpecs.totalHDPE.toLocaleString()} kg</strong></span>
                              <span>Pigmento: <strong className="text-emerald-600">{productionSpecs.totalMasterBatch} kg</strong></span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-100">
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Máquina</h5>
                            <p className="text-sm text-gray-800">{productionSpecs.injectionMachine}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Capacidad: <strong className="text-emerald-600">{productionSpecs.unitsPerHour.toFixed(0)} piezas/hora</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-emerald-700">
                      📸 Las fotos y especificaciones se actualizan en cada ciclo de producción
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Cliente</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{exhibitor.currentGraphic.client}</div>
                <div className="text-xs text-gray-500">{exhibitor.currentGraphic.campaign}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Modelo</span>
                <span className="text-gray-700">{exhibitor.model}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Contenido reciclado</span>
                <span className="text-emerald-600 font-medium">{exhibitor.recycledContent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">En operación desde</span>
                <span className="text-gray-700">{new Date(exhibitor.manufactureDate).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">¿Cuánto le queda?</span>
              <span className="text-emerald-600 font-medium">{lifeProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${lifeProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{exhibitor.yearsInOperation.toFixed(1)} años</span>
              <span>10+ años</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">¿En qué se convirtió?</h3>
            <div className="flex items-center justify-center mb-3">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-50">
                <span className="text-2xl font-bold text-emerald-600">{stats.totalCycles}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span className="text-gray-600">Exhibidores nuevos</span>
                </div>
                <span className="font-medium">{stats.recycledToExhibitors}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-emerald-500"></div>
                  <span className="text-gray-600">Gráficos nuevos</span>
                </div>
                <span className="font-medium">{stats.recycledToGraphics}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <QRCodeSVG 
              value={`${window.location.origin}/trazabilidad/${exhibitor.id}`}
              size={100}
              level="H"
              fgColor="#059669"
              className="mx-auto"
            />
            <p className="text-xs text-gray-400 mt-2 font-mono">{exhibitor.id}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
