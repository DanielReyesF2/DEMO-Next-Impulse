import { ReportDocument, ReportSection, ReportKPIRow, ReportMiniTable, ReportComparisonBar, ReportDonutChart } from './ReportDocument';

interface GHGProtocolReportProps {
  company: string;
  period: string;
  data: {
    exhibitors: number;
    cycles: number;
    recycledKg: number;
    emissionsGenerated: number;
    emissionsAvoided: number;
    netBalance: number;
    transportKm: number;
  };
}

export function GHGProtocolReport({ company, period, data }: GHGProtocolReportProps) {
  const cat1 = data.emissionsGenerated * 0.85;
  const cat4 = 18.4;
  const cat12 = -data.emissionsAvoided;
  const totalBruto = cat1 + cat4;
  const totalNeto = totalBruto + cat12;

  return (
    <ReportDocument
      title="Alcance 3"
      subtitle="GHG Protocol Scope 3"
      company={company}
      period={period}
      standard="GHG"
      accentColor="#F59E0B"
    >
      {/* Resumen visual de alcances */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          <div className="text-lg font-bold text-gray-400">—</div>
          <div className="text-xs text-gray-500">Alcance 1</div>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          <div className="text-lg font-bold text-gray-400">—</div>
          <div className="text-xs text-gray-500">Alcance 2</div>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <div className="text-lg font-bold text-amber-600">{totalBruto.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Alcance 3 Bruto</div>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
          <div className="text-lg font-bold text-emerald-600">{totalNeto.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Alcance 3 Neto</div>
        </div>
      </div>

      {/* Desglose por categoría */}
      <ReportSection title="Desglose por Categoría">
        <ReportMiniTable 
          headers={['Cat.', 'Descripción', 'kg CO₂e', '%']}
          rows={[
            ['1', 'Bienes adquiridos', cat1.toFixed(1), `${Math.round(cat1/totalBruto*100)}%`],
            ['4', 'Transporte upstream', cat4.toFixed(1), `${Math.round(cat4/totalBruto*100)}%`],
            ['5', 'Residuos operaciones', '0', '0%'],
            ['12', 'Fin de vida (crédito)', <span className="text-emerald-600 font-semibold">{cat12.toFixed(0)}</span>, '—'],
          ]}
        />
      </ReportSection>

      {/* Comparación visual */}
      <ReportSection title="Impacto de Economía Circular">
        <ReportComparisonBar 
          label="Emisiones totales"
          traditional={totalBruto}
          circular={Math.abs(totalNeto)}
          unit="kg CO₂e"
        />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg text-center">
            <div className="text-xs text-red-600 mb-1">Sin economía circular</div>
            <div className="text-xl font-bold text-red-600">+{totalBruto.toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg CO₂e</div>
          </div>
          <div className="p-3 border border-emerald-200 bg-emerald-50 rounded-lg text-center">
            <div className="text-xs text-emerald-600 mb-1">Con Next Impulse Green</div>
            <div className="text-xl font-bold text-emerald-600">{totalNeto.toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg CO₂e (balance negativo)</div>
          </div>
        </div>
      </ReportSection>

      {/* Crédito de reciclaje */}
      <ReportSection title="Crédito por Reciclaje (Cat. 12)">
        <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <ReportDonutChart value={data.recycledKg} total={data.recycledKg} label="" color="#10B981" />
          <div>
            <div className="text-2xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()} kg CO₂e</div>
            <div className="text-sm text-gray-600">evitados por reciclar {data.recycledKg.toLocaleString()} kg de material</div>
            <div className="text-xs text-gray-400 mt-1">Metodología: EPA WARM v15</div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}
