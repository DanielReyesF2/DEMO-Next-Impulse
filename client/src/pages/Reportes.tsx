import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CURRENT_CLIENT, egoExhibitors, calculateExhibitorStats } from '@/data/mockExhibitors';
import { ESRCemefiReport, GRIReport, NISMexicoReport, GHGProtocolReport } from '@/components/reports';
import { FileText, Award, Leaf, BarChart3 } from 'lucide-react';

type ReportStandard = 'esr' | 'gri' | 'nis' | 'ghg';

const standards = [
  { id: 'esr', name: 'ESR CEMEFI', full: 'Empresa Socialmente Responsable', icon: Award, color: 'bg-blue-500' },
  { id: 'gri', name: 'GRI', full: 'Global Reporting Initiative', icon: FileText, color: 'bg-emerald-500' },
  { id: 'nis', name: 'NIS México', full: 'Norma de Información Sostenibilidad', icon: BarChart3, color: 'bg-purple-500' },
  { id: 'ghg', name: 'Alcance 3', full: 'GHG Protocol Scope 3', icon: Leaf, color: 'bg-amber-500' },
];

export default function Reportes() {
  const [selectedStandard, setSelectedStandard] = useState<ReportStandard>('esr');
  const [selectedYear, setSelectedYear] = useState('2024');

  const { company, emissions, materials, totalExhibitors } = CURRENT_CLIENT;

  // Cálculos
  const totalCycles = egoExhibitors.reduce((sum, e) => sum + e.graphicChanges, 0);
  const totalWeight = egoExhibitors.reduce((sum, e) => {
    const stats = calculateExhibitorStats(e);
    return sum + stats.totalWeight;
  }, 0);
  const totalDistance = egoExhibitors.reduce((sum, e) => {
    const stats = calculateExhibitorStats(e);
    return sum + stats.totalDistance;
  }, 0);

  // Datos para los reportes
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
    transportKm: Math.round(totalDistance / totalCycles),
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reportes de Sustentabilidad</h1>
          <p className="text-sm text-gray-500 mt-1">Genera reportes en diferentes estándares internacionales</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {/* Selector de estándares - Tarjetas grandes */}
      <div data-tour="reportes-selector" className="grid grid-cols-4 gap-4 mb-8">
        {standards.map((standard) => {
          const Icon = standard.icon;
          const isSelected = selectedStandard === standard.id;
          return (
            <button
              key={standard.id}
              onClick={() => setSelectedStandard(standard.id as ReportStandard)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${standard.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-bold text-lg ${isSelected ? 'text-emerald-700' : 'text-gray-800'}`}>
                {standard.name}
              </h3>
              <p className={`text-sm ${isSelected ? 'text-emerald-600' : 'text-gray-500'}`}>
                {standard.full}
              </p>
              {isSelected && (
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-emerald-500"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Vista del reporte tipo PDF */}
      <div data-tour="reportes-preview" className="bg-gray-200 rounded-xl overflow-hidden">
        {selectedStandard === 'esr' && (
          <ESRCemefiReport 
            company={company} 
            period={selectedYear}
            data={reportData}
          />
        )}
        {selectedStandard === 'gri' && (
          <GRIReport 
            company={company} 
            period={selectedYear}
            data={reportData}
          />
        )}
        {selectedStandard === 'nis' && (
          <NISMexicoReport 
            company={company} 
            period={selectedYear}
            data={reportData}
          />
        )}
        {selectedStandard === 'ghg' && (
          <GHGProtocolReport 
            company={company} 
            period={selectedYear}
            data={reportData}
          />
        )}
      </div>
    </AppLayout>
  );
}
