import { ReportDocument, ReportSection, ReportKPIRow, ReportComparisonBar, ReportStatusBadge } from './ReportDocument';
import { Shield, Target, AlertTriangle, BarChart3 } from 'lucide-react';

interface NISMexicoReportProps {
  company: string;
  period: string;
  data: {
    exhibitors: number;
    cycles: number;
    recycledKg: number;
    emissionsAvoided: number;
    emissionsGenerated: number;
    netBalance: number;
    recycledContentPercent: number;
  };
}

export function NISMexicoReport({ company, period, data }: NISMexicoReportProps) {
  const pillars = [
    { icon: Shield, name: 'Gobernanza', status: 'cumple' as const, desc: 'Supervisión trimestral' },
    { icon: Target, name: 'Estrategia', status: 'cumple' as const, desc: 'Economía circular' },
    { icon: AlertTriangle, name: 'Riesgos', status: 'cumple' as const, desc: 'Monitoreo en tiempo real' },
    { icon: BarChart3, name: 'Métricas', status: 'cumple' as const, desc: 'Trazabilidad completa' },
  ];

  return (
    <ReportDocument
      title="NIS México"
      subtitle="Norma de Información de Sostenibilidad"
      company={company}
      period={period}
      standard="NIS"
      accentColor="#8B5CF6"
    >
      {/* KPIs principales */}
      <ReportKPIRow items={[
        { label: 'Exhibidores', value: data.exhibitors },
        { label: 'Contenido reciclado', value: `${data.recycledContentPercent}%`, highlight: true },
        { label: 'Balance CO₂', value: data.netBalance, unit: 'kg', highlight: true },
      ]} />

      {/* 4 Pilares */}
      <ReportSection title="Cumplimiento por Pilar">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.name} className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">{pillar.name}</span>
                </div>
                <ReportStatusBadge status={pillar.status} />
                <div className="text-xs text-gray-500 mt-1">{pillar.desc}</div>
              </div>
            );
          })}
        </div>
      </ReportSection>

      {/* Análisis de escenarios */}
      <ReportSection title="Análisis de Escenarios (Estrategia)">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
            <div className="text-xs font-semibold text-red-700 mb-2">BAU (sin economía circular)</div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Exhibidores de un solo uso</li>
              <li>• Residuos a relleno sanitario</li>
              <li>• Mayor huella de carbono</li>
            </ul>
          </div>
          <div className="p-3 border border-emerald-200 bg-emerald-50 rounded-lg">
            <div className="text-xs font-semibold text-emerald-700 mb-2">Actual (Next Impulse)</div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• {data.exhibitors} exhibidores circulares</li>
              <li>• 0% a relleno sanitario</li>
              <li>• -{data.emissionsAvoided} kg CO₂</li>
            </ul>
          </div>
        </div>
      </ReportSection>

      {/* Métricas y Metas */}
      <ReportSection title="Métricas y Metas">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">100% exhibidores en economía circular</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">✓</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">≥60% contenido reciclado</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">{data.recycledContentPercent}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">0% residuos a relleno</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">✓</span>
            </div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}
