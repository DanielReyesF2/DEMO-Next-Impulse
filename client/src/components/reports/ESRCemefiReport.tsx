import { ReportDocument, ReportSection, ReportKPIRow, ReportDonutChart, ReportStatusBadge } from './ReportDocument';

interface ESRCemefiReportProps {
  company: string;
  period: string;
  data: {
    exhibitors: number;
    cycles: number;
    recycledKg: number;
    emissionsAvoided: number;
  };
}

export function ESRCemefiReport({ company, period, data }: ESRCemefiReportProps) {
  const indicators = [
    { area: 'Calidad de Vida', code: 'CV', items: ['Capacitación sustentabilidad', 'Condiciones seguras'], status: 'cumple' as const },
    { area: 'Ética Empresarial', code: 'EE', items: ['Transparencia cadena', 'Proveedores responsables'], status: 'cumple' as const },
    { area: 'Comunidad', code: 'VC', items: ['Empleos en reciclaje', 'Proveedores locales'], status: 'cumple' as const },
    { area: 'Medio Ambiente', code: 'MA', items: ['Economía circular', 'Reducción emisiones'], status: 'cumple' as const },
  ];

  return (
    <ReportDocument
      title="ESR CEMEFI"
      subtitle="Empresa Socialmente Responsable"
      company={company}
      period={period}
      standard="ESR"
      accentColor="#2563EB"
    >
      {/* KPIs principales */}
      <ReportKPIRow items={[
        { label: 'Exhibidores', value: data.exhibitors },
        { label: 'Ciclos', value: data.cycles },
        { label: 'Reciclado', value: `${(data.recycledKg/1000).toFixed(1)}t`, highlight: true },
        { label: 'CO₂ evitado', value: data.emissionsAvoided, unit: 'kg', highlight: true },
      ]} />

      {/* Gráficas de cumplimiento */}
      <ReportSection title="Cumplimiento por Área">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <ReportDonutChart value={100} total={100} label="Calidad de Vida" color="#3B82F6" />
          <ReportDonutChart value={100} total={100} label="Ética" color="#8B5CF6" />
          <ReportDonutChart value={100} total={100} label="Comunidad" color="#F59E0B" />
          <ReportDonutChart value={100} total={100} label="Medio Ambiente" color="#10B981" />
        </div>
      </ReportSection>

      {/* Indicadores por área */}
      <ReportSection title="Indicadores">
        <div className="grid grid-cols-2 gap-4">
          {indicators.map((area) => (
            <div key={area.code} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{area.area}</span>
                <ReportStatusBadge status={area.status} />
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                {area.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="text-emerald-500">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Impacto ambiental destacado */}
      <ReportSection title="Impacto Ambiental">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()} kg CO₂</div>
            <div className="text-sm text-emerald-700">Emisiones evitadas con economía circular</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">100%</div>
            <div className="text-xs text-gray-500">Tasa de reciclaje</div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}
