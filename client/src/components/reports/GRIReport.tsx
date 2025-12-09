import { ReportDocument, ReportSection, ReportKPIRow, ReportMiniTable, ReportComparisonBar, ReportDonutChart } from './ReportDocument';
import { Info, ExternalLink } from 'lucide-react';

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

  // Cálculos GRI específicos
  const gri301_1_renewable = data.recycledMaterialsKg;
  const gri301_1_nonRenewable = data.virginMaterialsKg;
  const gri301_2_inputRecycled = recycledPercent;
  const gri305_1_direct = 0; // Alcance 1 - no aplica
  const gri305_2_indirect = 0; // Alcance 2 - no aplica
  const gri305_3_other = data.emissionsGenerated; // Alcance 3
  const gri306_3_generated = data.wasteRecycled;
  const gri306_4_diverted = data.wasteRecycled;
  const gri306_5_directed = 0;

  return (
    <ReportDocument
      title="GRI Standards"
      subtitle="Global Reporting Initiative 2021"
      company={company}
      period={period}
      standard="GRI"
      accentColor="#10B981"
    >
      {/* Nota sobre estándares aplicados */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium">Estándares aplicados:</span> GRI 301 (Materiales), GRI 305 (Emisiones), GRI 306 (Residuos 2020).
          Este reporte sigue la metodología GRI "con referencia" para la economía circular de exhibidores.
        </div>
      </div>

      {/* KPIs principales con códigos GRI */}
      <ReportKPIRow items={[
        { label: 'GRI 301-1', value: `${(data.totalMaterialsKg/1000).toFixed(1)}t`, unit: 'materiales' },
        { label: 'GRI 305-3', value: data.netBalance, unit: 'kg CO₂e', highlight: true },
        { label: 'GRI 306-5', value: '0', unit: 'kg a relleno', highlight: true },
      ]} />

      {/* GRI 301: Materiales */}
      <ReportSection title="GRI 301: Materiales">
        <div className="space-y-4">
          {/* 301-1: Materiales utilizados */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-600">301-1</span>
              <span className="text-xs text-gray-500">Materiales utilizados por peso</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Renovables (reciclados)</div>
                <div className="text-lg font-bold text-emerald-600">{gri301_1_renewable.toLocaleString()} kg</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">No renovables (vírgenes)</div>
                <div className="text-lg font-bold text-gray-700">{gri301_1_nonRenewable.toLocaleString()} kg</div>
              </div>
            </div>
          </div>

          {/* 301-2: Insumos reciclados */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-600">301-2</span>
              <span className="text-xs text-gray-500">Insumos reciclados</span>
            </div>
            <div className="flex items-center gap-4">
              <ReportDonutChart 
                value={data.recycledMaterialsKg} 
                total={data.totalMaterialsKg} 
                label="" 
                color="#10B981" 
              />
              <div>
                <div className="text-2xl font-bold text-emerald-600">{gri301_2_inputRecycled}%</div>
                <div className="text-sm text-gray-600">contenido reciclado post-consumo</div>
                <div className="text-xs text-gray-400 mt-1">Material: HDPE reciclado de gráficos</div>
              </div>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* GRI 305: Emisiones */}
      <ReportSection title="GRI 305: Emisiones">
        <div className="space-y-4">
          {/* Tabla de alcances */}
          <ReportMiniTable 
            headers={['Indicador', 'Alcance', 'kg CO₂e', 'Notas']}
            rows={[
              [<span className="font-mono text-xs">305-1</span>, 'Alcance 1', '0', 'Sin combustión directa'],
              [<span className="font-mono text-xs">305-2</span>, 'Alcance 2', '0', 'Energía no aplica'],
              [<span className="font-mono text-xs">305-3</span>, 'Alcance 3', gri305_3_other.toString(), 'Cadena de valor'],
            ]}
          />

          {/* Desglose Alcance 3 */}
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-600">305-3</span>
              <span className="text-xs text-gray-500">Otras emisiones indirectas (Alcance 3)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-white rounded">
                <div className="text-lg font-bold text-red-500">{data.emissionsGenerated}</div>
                <div className="text-xs text-gray-500">Generadas</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="text-lg font-bold text-emerald-600">-{data.emissionsAvoided}</div>
                <div className="text-xs text-gray-500">Evitadas</div>
              </div>
              <div className="text-center p-2 bg-emerald-100 rounded">
                <div className="text-lg font-bold text-emerald-700">{data.netBalance}</div>
                <div className="text-xs text-gray-500">Neto</div>
              </div>
            </div>
          </div>

          <ReportComparisonBar 
            label="Comparación vs modelo lineal (kg CO₂e)"
            traditional={data.emissionsGenerated + data.emissionsAvoided}
            circular={data.emissionsGenerated}
            unit="kg"
          />
        </div>
      </ReportSection>

      {/* GRI 306: Residuos (2020) */}
      <ReportSection title="GRI 306: Residuos (Estándar 2020)">
        <div className="space-y-4">
          {/* 306-1: Generación de residuos */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-600">306-1</span>
              <span className="text-xs text-gray-500">Generación de residuos e impactos significativos</span>
            </div>
            <p className="text-sm text-gray-600">
              Los gráficos de exhibidores al final de su vida útil son recolectados y procesados para reincorporarse 
              al ciclo productivo, eliminando la disposición en rellenos sanitarios.
            </p>
          </div>

          {/* 306-2: Gestión de residuos */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-600">306-2</span>
              <span className="text-xs text-gray-500">Gestión de impactos significativos</span>
            </div>
            <p className="text-sm text-gray-600">
              Sistema de economía circular con trazabilidad lote por lote. El material se transforma en nuevos 
              gráficos o en materia prima para exhibidores, cerrando el ciclo.
            </p>
          </div>

          {/* 306-3, 306-4, 306-5: Métricas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-200">
              <span className="text-xs font-mono text-blue-600 block mb-1">306-3</span>
              <div className="text-xl font-bold text-blue-600">{gri306_3_generated.toLocaleString()}</div>
              <div className="text-xs text-gray-500">kg generados</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-200">
              <span className="text-xs font-mono text-emerald-600 block mb-1">306-4</span>
              <div className="text-xl font-bold text-emerald-600">{gri306_4_diverted.toLocaleString()}</div>
              <div className="text-xs text-gray-500">kg desviados</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center border border-red-200">
              <span className="text-xs font-mono text-red-600 block mb-1">306-5</span>
              <div className="text-xl font-bold text-red-600">{gri306_5_directed}</div>
              <div className="text-xs text-gray-500">kg a disposición</div>
            </div>
          </div>

          {/* Tasa de circularidad */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-4">
              <ReportDonutChart value={100} total={100} label="" color="#10B981" />
              <div>
                <div className="text-xl font-bold text-emerald-600">100% Tasa de circularidad</div>
                <div className="text-sm text-gray-600">{data.wasteRecycled.toLocaleString()} kg reincorporados al ciclo</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">{data.cycles}</div>
              <div className="text-xs text-gray-500">ciclos cerrados</div>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Metodología */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-500">
        <div className="flex items-center gap-1 mb-1">
          <ExternalLink className="w-3 h-3" />
          <span className="font-medium">Metodología</span>
        </div>
        <p>
          Emisiones calculadas con factores de IPCC AR6 y EPA WARM v15. Contenido reciclado verificado con 
          trazabilidad lote por lote. Período: {period}.
        </p>
      </div>
    </ReportDocument>
  );
}
