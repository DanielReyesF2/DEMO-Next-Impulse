import { ReportDocument, ReportSection, ReportKPIRow, ReportMiniTable, ReportComparisonBar, ReportDonutChart } from './ReportDocument';

interface GRIReportProps {
  company: string;
  period: string;
  data: {
    totalMaterialsKg: number;
    recycledMaterialsKg: number;
    virginMaterialsKg: number;
    recycledContentPercent: number;
    emissionsGenerated: number;
    emissionsAvoided: number;
    netBalance: number;
    wasteRecycled: number;
    exhibitors: number;
    cycles: number;
  };
}

export function GRIReport({ company, period, data }: GRIReportProps) {
  const recycledPercent = Math.round((data.recycledMaterialsKg / data.totalMaterialsKg) * 100);

  return (
    <ReportDocument
      title="GRI Standards"
      subtitle="Global Reporting Initiative 2021"
      company={company}
      period={period}
      standard="GRI"
      accentColor="#10B981"
    >
      {/* KPIs principales */}
      <ReportKPIRow items={[
        { label: 'GRI 301', value: `${(data.totalMaterialsKg/1000).toFixed(1)}t`, unit: 'materiales' },
        { label: 'GRI 305', value: data.netBalance, unit: 'kg CO₂e', highlight: true },
        { label: 'GRI 306', value: '0', unit: 'a relleno', highlight: true },
      ]} />

      {/* GRI 301: Materiales */}
      <ReportSection title="GRI 301: Materiales">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <ReportDonutChart 
            value={data.recycledMaterialsKg} 
            total={data.totalMaterialsKg} 
            label="Contenido reciclado" 
            color="#10B981" 
          />
          <div className="col-span-2">
            <ReportMiniTable 
              headers={['Material', 'Cantidad', '%']}
              rows={[
                ['HDPE reciclado', `${data.recycledMaterialsKg.toLocaleString()} kg`, <span className="text-emerald-600 font-semibold">{recycledPercent}%</span>],
                ['HDPE virgen', `${data.virginMaterialsKg.toLocaleString()} kg`, `${100-recycledPercent}%`],
                ['Total', <strong>{data.totalMaterialsKg.toLocaleString()} kg</strong>, '100%'],
              ]}
            />
          </div>
        </div>
      </ReportSection>

      {/* GRI 305: Emisiones */}
      <ReportSection title="GRI 305: Emisiones">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-lg font-bold text-red-600">{data.emissionsGenerated}</div>
            <div className="text-xs text-gray-500">Generadas</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-center">
            <div className="text-lg font-bold text-emerald-600">-{data.emissionsAvoided}</div>
            <div className="text-xs text-gray-500">Evitadas</div>
          </div>
          <div className="p-3 bg-emerald-100 rounded-lg text-center">
            <div className="text-lg font-bold text-emerald-700">{data.netBalance}</div>
            <div className="text-xs text-gray-500">Balance neto</div>
          </div>
        </div>
        <ReportComparisonBar 
          label="Emisiones Alcance 3 (kg CO₂e)"
          traditional={data.emissionsGenerated + data.emissionsAvoided}
          circular={data.emissionsGenerated}
          unit="kg"
        />
      </ReportSection>

      {/* GRI 306: Residuos */}
      <ReportSection title="GRI 306: Residuos">
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-4">
            <ReportDonutChart value={100} total={100} label="" color="#10B981" />
            <div>
              <div className="text-xl font-bold text-emerald-600">{data.wasteRecycled.toLocaleString()} kg</div>
              <div className="text-sm text-gray-600">100% reciclado • 0 kg a relleno sanitario</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{data.cycles}</div>
            <div className="text-xs text-gray-500">ciclos cerrados</div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}
