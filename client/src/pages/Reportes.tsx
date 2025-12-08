import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CURRENT_CLIENT, egoExhibitors, calculateExhibitorStats } from '@/data/mockExhibitors';
import { Download, FileSpreadsheet, Copy, Check, Info, ExternalLink } from 'lucide-react';

type ReportStandard = 'gri' | 'sasb' | 'issb' | 'cdp';

const standards = [
  { id: 'gri', name: 'GRI', full: 'Global Reporting Initiative' },
  { id: 'sasb', name: 'SASB', full: 'Sustainability Accounting Standards' },
  { id: 'issb', name: 'ISSB', full: 'IFRS Sustainability Standards' },
  { id: 'cdp', name: 'CDP', full: 'Carbon Disclosure Project' },
];

export default function Reportes() {
  const [selectedStandard, setSelectedStandard] = useState<ReportStandard>('gri');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [copied, setCopied] = useState(false);

  const { company, emissions, comparison, materials, totalExhibitors, totalGraphicsRecycled } = CURRENT_CLIENT;

  // Cálculos detallados
  const totalCycles = egoExhibitors.reduce((sum, e) => sum + e.graphicChanges, 0);
  const totalWeight = egoExhibitors.reduce((sum, e) => {
    const stats = calculateExhibitorStats(e);
    return sum + stats.totalWeight;
  }, 0);
  const avgRecycledContent = 60; // % promedio
  const emissionsIntensity = (emissions.generated / totalExhibitors).toFixed(2);
  const reductionVsBaseline = Math.round((1 - comparison.circularEmissions / comparison.traditionalEmissions) * 100);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reportes de Sustentabilidad</h1>
          <p className="text-sm text-gray-500 mt-1">Datos para tu reporte de Alcance 3 • {company}</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {/* Selector de estándar */}
      <div data-tour="reportes-selector" className="flex space-x-2 mb-6">
        {standards.map((standard) => (
          <button
            key={standard.id}
            onClick={() => setSelectedStandard(standard.id as ReportStandard)}
            className={`px-5 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center ${
              selectedStandard === standard.id
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}
          >
            <span className="font-bold">{standard.name}</span>
            <span className={`text-xs ${selectedStandard === standard.id ? 'text-emerald-100' : 'text-gray-400'}`}>{standard.full}</span>
          </button>
        ))}
      </div>

      {/* Contenido del reporte */}
      <div data-tour="reportes-preview" className="bg-white rounded-xl border border-gray-200">
        {/* Acciones */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{standards.find(s => s.id === selectedStandard)?.full}</span>
            <span className="text-xs text-gray-400">• Período {selectedYear}</span>
          </div>
          <div data-tour="reportes-download" className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4 mr-1" />PDF
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              <FileSpreadsheet className="w-4 h-4 mr-1" />Excel
            </button>
            <button 
              onClick={handleCopy}
              className={`flex items-center px-3 py-1.5 text-sm rounded-lg ${copied ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* GRI */}
          {selectedStandard === 'gri' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 mb-4">GRI 301: MATERIALES</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3">301-1 Materiales por peso</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Materiales totales</span>
                        <span className="text-sm font-medium">{materials.totalKg} kg</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Materiales reciclados</span>
                        <span className="text-sm font-medium text-emerald-600">{materials.recycledKg} kg ({Math.round(materials.recycledKg/materials.totalKg*100)}%)</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">Materiales vírgenes</span>
                        <span className="text-sm font-medium">{materials.virginKg} kg ({Math.round(materials.virginKg/materials.totalKg*100)}%)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3">301-2 Insumos reciclados</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">% insumos reciclados</span>
                        <span className="text-sm font-medium text-emerald-600">{avgRecycledContent}%+</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Tipo de material</span>
                        <span className="text-sm font-medium">HDPE post-consumo</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">Proveedor verificado</span>
                        <span className="text-sm font-medium text-emerald-600">✓ Next Impulse Green</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-emerald-600 mb-4">GRI 305: EMISIONES</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3">305-3 Alcance 3 (Cat. 1)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Bienes adquiridos</span>
                        <span className="text-sm font-medium">{emissions.generated} kg CO₂e</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Transporte upstream</span>
                        <span className="text-sm font-medium">18.4 kg CO₂e</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">Fin de vida (crédito)</span>
                        <span className="text-sm font-medium text-emerald-600">-{emissions.avoided} kg CO₂e</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3">305-5 Reducción de emisiones</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Emisiones evitadas</span>
                        <span className="text-sm font-medium text-emerald-600">{emissions.avoided} kg CO₂e</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Reducción vs baseline</span>
                        <span className="text-sm font-medium text-emerald-600">-{reductionVsBaseline}%</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-600">Metodología</span>
                        <span className="text-sm font-medium">GHG Protocol, EPA WARM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-emerald-600 mb-4">GRI 306: RESIDUOS</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-600">{totalWeight.toFixed(0)} kg</div>
                    <div className="text-xs text-gray-500">Total gestionado</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-600">100%</div>
                    <div className="text-xs text-gray-500">Tasa de reciclaje</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-600">0 kg</div>
                    <div className="text-xs text-gray-500">A relleno sanitario</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SASB */}
          {selectedStandard === 'sasb' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 mb-4">RT-CP-410a: CONTAINERS & PACKAGING</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3">RT-CP-410a.1 Gestión ambiental cadena de valor</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {company} utiliza exhibidores de Next Impulse Green bajo modelo de economía circular, 
                      eliminando residuos y reduciendo emisiones de Alcance 3 en su cadena de suministro 
                      de punto de venta.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-3">RT-CP-410a.2 % empaques circulares</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-emerald-600">100%</div>
                        <div className="text-xs text-gray-500">Reutilizables</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-emerald-600">60%+</div>
                        <div className="text-xs text-gray-500">Contenido reciclado</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-emerald-600">100%</div>
                        <div className="text-xs text-gray-500">Reciclabilidad</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-emerald-600">10+</div>
                        <div className="text-xs text-gray-500">Años vida útil</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs text-gray-500 mb-3">Métricas cuantitativas</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium">Métrica</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Valor</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Exhibidores en operación</td>
                        <td className="text-right font-medium">{totalExhibitors}</td>
                        <td className="text-right text-gray-400">unidades</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Ciclos de reciclaje</td>
                        <td className="text-right font-medium">{totalCycles}</td>
                        <td className="text-right text-gray-400">ciclos</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Material reciclado</td>
                        <td className="text-right font-medium">{materials.recycledKg}</td>
                        <td className="text-right text-gray-400">kg</td>
                      </tr>
                      <tr>
                        <td className="py-2">Emisiones evitadas</td>
                        <td className="text-right font-medium text-emerald-600">{emissions.avoided}</td>
                        <td className="text-right text-gray-400">kg CO₂e</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ISSB */}
          {selectedStandard === 'issb' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 mb-4">IFRS S2: CLIMATE-RELATED DISCLOSURES</h3>
                
                <div className="mb-6">
                  <h4 className="text-xs text-gray-500 mb-3">Párrafo 29 - Métricas climáticas (Alcance 3)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Cat. 1: Bienes adquiridos</div>
                      <div className="text-xl font-semibold text-gray-700">{emissions.generated}</div>
                      <div className="text-xs text-gray-400">kg CO₂e</div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Emisiones evitadas</div>
                      <div className="text-xl font-bold text-emerald-600">{emissions.avoided}</div>
                      <div className="text-xs text-gray-400">kg CO₂e</div>
                    </div>
                    <div className="p-4 bg-emerald-100 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Balance neto</div>
                      <div className="text-xl font-bold text-emerald-700">{emissions.netBalance}</div>
                      <div className="text-xs text-gray-400">kg CO₂e</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs text-gray-500 mb-3">Párrafo 22 - Análisis de escenarios</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="text-xs text-red-600 font-medium mb-2">ESCENARIO BASE (sin economía circular)</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Exhibidores tradicionales</span>
                          <span className="font-medium text-red-600">{comparison.traditionalEmissions.toLocaleString()} kg CO₂e</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Residuos a relleno</span>
                          <span className="font-medium text-red-600">{comparison.traditionalWaste} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Costo anual</span>
                          <span className="font-medium">${comparison.traditionalCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
                      <div className="text-xs text-emerald-600 font-medium mb-2">ESCENARIO ACTUAL (con Next Impulse Green)</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emisiones</span>
                          <span className="font-medium text-emerald-600">{comparison.circularEmissions} kg (-{reductionVsBaseline}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Residuos</span>
                          <span className="font-medium text-emerald-600">0 kg (100% reciclado)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Costo anual</span>
                          <span className="font-medium text-emerald-600">${comparison.circularCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CDP */}
          {selectedStandard === 'cdp' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 mb-4">CDP CLIMATE CHANGE QUESTIONNAIRE</h3>
                
                <div className="mb-6">
                  <h4 className="text-xs text-gray-500 mb-3">C6.5 - Emisiones de Alcance 3 por categoría</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500 font-medium">Categoría</th>
                          <th className="text-right py-2 text-gray-500 font-medium">Circular</th>
                          <th className="text-right py-2 text-gray-500 font-medium">Tradicional</th>
                          <th className="text-right py-2 text-gray-500 font-medium">Reducción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Cat. 1: Bienes adquiridos</td>
                          <td className="text-right font-medium text-emerald-600">{emissions.generated} kg</td>
                          <td className="text-right text-gray-400">{comparison.traditionalEmissions.toLocaleString()} kg</td>
                          <td className="text-right font-medium text-emerald-600">-{reductionVsBaseline}%</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Cat. 4: Transporte upstream</td>
                          <td className="text-right font-medium">18.4 kg</td>
                          <td className="text-right text-gray-400">45.2 kg</td>
                          <td className="text-right font-medium text-emerald-600">-59%</td>
                        </tr>
                        <tr>
                          <td className="py-2">Cat. 12: Fin de vida</td>
                          <td className="text-right font-medium text-emerald-600">-{emissions.avoided} kg (crédito)</td>
                          <td className="text-right text-gray-400">0 kg</td>
                          <td className="text-right font-medium text-emerald-600">N/A</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500 mb-3">C12.1 - Engagement con proveedores en cadena de valor</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">Next Impulse Green</div>
                        <div className="text-xs text-gray-400">Proveedor de exhibidores de economía circular</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">Verificado</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs bg-white border border-gray-200 rounded">✓ Trazabilidad por exhibidor</span>
                      <span className="px-2 py-1 text-xs bg-white border border-gray-200 rounded">✓ Emisiones por ciclo de vida</span>
                      <span className="px-2 py-1 text-xs bg-white border border-gray-200 rounded">✓ Certificación contenido reciclado</span>
                      <span className="px-2 py-1 text-xs bg-white border border-gray-200 rounded">✓ Cadena de custodia</span>
                      <span className="px-2 py-1 text-xs bg-white border border-gray-200 rounded">✓ Datos en tiempo real</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
