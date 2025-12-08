import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CURRENT_CLIENT, egoExhibitors, calculateExhibitorStats } from '@/data/mockExhibitors';
import { ESRCemefiReport, GRIReport, NISMexicoReport, GHGProtocolReport } from '@/components/reports';
import { FileText, Award, Leaf, BarChart3, Clock, Download, CheckCircle2, Eye } from 'lucide-react';

type ReportStandard = 'esr' | 'gri' | 'nis' | 'ghg';

const standards = [
  { id: 'esr', name: 'ESR', full: 'CEMEFI', icon: Award, color: '#2563EB' },
  { id: 'gri', name: 'GRI', full: 'Standards', icon: FileText, color: '#10B981' },
  { id: 'nis', name: 'NIS', full: 'México', icon: BarChart3, color: '#8B5CF6' },
  { id: 'ghg', name: 'Alcance 3', full: 'GHG Protocol', icon: Leaf, color: '#F59E0B' },
];

// Mock historial de reportes
const reportHistory = [
  { id: 1, standard: 'gri', date: '2024-12-01', status: 'completed', downloadCount: 3 },
  { id: 2, standard: 'ghg', date: '2024-11-15', status: 'completed', downloadCount: 5 },
  { id: 3, standard: 'esr', date: '2024-10-20', status: 'completed', downloadCount: 2 },
  { id: 4, standard: 'gri', date: '2024-09-01', status: 'completed', downloadCount: 7 },
  { id: 5, standard: 'nis', date: '2024-08-15', status: 'completed', downloadCount: 1 },
];

export default function Reportes() {
  const [selectedStandard, setSelectedStandard] = useState<ReportStandard>('esr');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showReport, setShowReport] = useState(false);

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

  const getStandardInfo = (id: string) => standards.find(s => s.id === id);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (showReport) {
    return (
      <AppLayout>
        <div className="mb-4">
          <button 
            onClick={() => setShowReport(false)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            ← Volver a reportes
          </button>
        </div>
        
        {selectedStandard === 'esr' && (
          <ESRCemefiReport company={company} period={selectedYear} data={reportData} />
        )}
        {selectedStandard === 'gri' && (
          <GRIReport company={company} period={selectedYear} data={reportData} />
        )}
        {selectedStandard === 'nis' && (
          <NISMexicoReport company={company} period={selectedYear} data={reportData} />
        )}
        {selectedStandard === 'ghg' && (
          <GHGProtocolReport company={company} period={selectedYear} data={reportData} />
        )}
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
          <p className="text-sm text-gray-500 mt-1">Genera y descarga reportes de sustentabilidad</p>
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

      {/* Selector de estándares */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {standards.map((standard) => {
          const Icon = standard.icon;
          const isSelected = selectedStandard === standard.id;
          return (
            <button
              key={standard.id}
              onClick={() => setSelectedStandard(standard.id as ReportStandard)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: standard.color }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">{standard.name}</h3>
              <p className="text-xs text-gray-500">{standard.full}</p>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Acción de generar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: getStandardInfo(selectedStandard)?.color }}
            >
              {(() => {
                const Icon = getStandardInfo(selectedStandard)?.icon || FileText;
                return <Icon className="w-7 h-7 text-white" />;
              })()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Reporte {getStandardInfo(selectedStandard)?.name} {selectedYear}
              </h2>
              <p className="text-sm text-gray-500">
                {getStandardInfo(selectedStandard)?.full} • {company}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Eye className="w-4 h-4" />
              Vista previa
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Historial de reportes */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-700">Historial de Reportes</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {reportHistory.map((report) => {
            const standardInfo = getStandardInfo(report.standard);
            const Icon = standardInfo?.icon || FileText;
            return (
              <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: standardInfo?.color }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {standardInfo?.name} {standardInfo?.full}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(report.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Download className="w-3 h-3" />
                    {report.downloadCount}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Generado
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
    </AppLayout>
  );
}
