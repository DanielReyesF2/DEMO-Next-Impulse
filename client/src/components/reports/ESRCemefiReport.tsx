import { ReportDocument, ReportSection, ReportKPIRow, ReportDonutChart, ReportStatusBadge } from './ReportDocument';
import { Info, Users, Shield, Heart, Leaf, CheckCircle2 } from 'lucide-react';

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
  // Indicadores específicos del distintivo ESR por ámbito
  const ambitos = [
    { 
      id: 'CV',
      name: 'Calidad de Vida en la Empresa', 
      icon: Users,
      color: '#3B82F6',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      score: 95,
      indicators: [
        { name: 'Capacitación en sustentabilidad', status: 'cumple' as const },
        { name: 'Condiciones laborales seguras', status: 'cumple' as const },
        { name: 'Balance vida-trabajo', status: 'cumple' as const },
        { name: 'Desarrollo profesional', status: 'cumple' as const },
      ]
    },
    { 
      id: 'EE',
      name: 'Ética Empresarial', 
      icon: Shield,
      color: '#8B5CF6',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      score: 100,
      indicators: [
        { name: 'Código de ética documentado', status: 'cumple' as const },
        { name: 'Transparencia en cadena de suministro', status: 'cumple' as const },
        { name: 'Proveedores responsables', status: 'cumple' as const },
        { name: 'Anticorrupción', status: 'cumple' as const },
      ]
    },
    { 
      id: 'VC',
      name: 'Vinculación con la Comunidad', 
      icon: Heart,
      color: '#F59E0B',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      score: 90,
      indicators: [
        { name: 'Generación de empleo local', status: 'cumple' as const },
        { name: 'Proveedores locales de reciclaje', status: 'cumple' as const },
        { name: 'Programas comunitarios', status: 'cumple' as const },
        { name: 'Desarrollo de habilidades', status: 'cumple' as const },
      ]
    },
    { 
      id: 'MA',
      name: 'Cuidado y Preservación del Medio Ambiente', 
      icon: Leaf,
      color: '#10B981',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      score: 100,
      indicators: [
        { name: 'Economía circular implementada', status: 'cumple' as const },
        { name: 'Reducción de emisiones GEI', status: 'cumple' as const },
        { name: 'Gestión de residuos 100%', status: 'cumple' as const },
        { name: 'Trazabilidad ambiental', status: 'cumple' as const },
      ]
    },
  ];

  const avgScore = Math.round(ambitos.reduce((sum, a) => sum + a.score, 0) / ambitos.length);

  return (
    <ReportDocument
      title="Distintivo ESR"
      subtitle="Empresa Socialmente Responsable • CEMEFI"
      company={company}
      period={period}
      standard="ESR"
      accentColor="#2563EB"
    >
      {/* Nota sobre el distintivo */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 text-xs text-blue-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium">Distintivo ESR CEMEFI:</span> El Centro Mexicano para la Filantropía (CEMEFI) 
          otorga este distintivo a empresas que cumplen con los 4 ámbitos de Responsabilidad Social Empresarial. 
          Este reporte documenta el cumplimiento en el ámbito ambiental mediante economía circular.
        </div>
      </div>

      {/* KPIs principales */}
      <ReportKPIRow items={[
        { label: 'Exhibidores', value: data.exhibitors },
        { label: 'Ciclos cerrados', value: data.cycles },
        { label: 'Material reciclado', value: `${(data.recycledKg/1000).toFixed(1)}t`, highlight: true },
        { label: 'CO₂ evitado', value: data.emissionsAvoided, unit: 'kg', highlight: true },
      ]} />

      {/* Puntuación general */}
      <ReportSection title="Evaluación Global ESR">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">{avgScore}%</span>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">Cumplimiento General</div>
              <div className="text-sm text-gray-600">Promedio de los 4 ámbitos ESR</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Elegible para Distintivo</span>
          </div>
        </div>
      </ReportSection>

      {/* Cumplimiento por ámbito - Gráficas */}
      <ReportSection title="Cumplimiento por Ámbito">
        <div className="grid grid-cols-4 gap-4">
          {ambitos.map((ambito) => (
            <div key={ambito.id} className={`p-3 rounded-lg ${ambito.bgColor} border ${ambito.borderColor}`}>
              <div className="flex items-center justify-center mb-2">
                <ReportDonutChart 
                  value={ambito.score} 
                  total={100} 
                  label="" 
                  color={ambito.color} 
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-700">{ambito.id}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{ambito.name}</div>
              </div>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Indicadores detallados por ámbito */}
      <ReportSection title="Indicadores por Ámbito">
        <div className="grid grid-cols-2 gap-4">
          {ambitos.map((ambito) => {
            const Icon = ambito.icon;
            return (
              <div key={ambito.id} className={`p-4 rounded-lg ${ambito.bgColor} border ${ambito.borderColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: ambito.color }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">{ambito.name}</span>
                      <div className="text-xs text-gray-500">{ambito.score}% cumplimiento</div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {ambito.indicators.map((indicator, i) => (
                    <li key={i} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{indicator.name}</span>
                      <ReportStatusBadge status={indicator.status} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ReportSection>

      {/* Impacto ambiental destacado (Ámbito MA) */}
      <ReportSection title="Detalle: Cuidado del Medio Ambiente">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-600">{data.cycles}</div>
              <div className="text-xs text-gray-600">Ciclos cerrados</div>
              <div className="text-[10px] text-gray-400">Economía circular activa</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-600">100%</div>
              <div className="text-xs text-gray-600">Tasa de reciclaje</div>
              <div className="text-[10px] text-gray-400">0 kg a relleno sanitario</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()}</div>
              <div className="text-xs text-gray-600">kg CO₂ evitados</div>
              <div className="text-[10px] text-gray-400">vs modelo lineal</div>
            </div>
          </div>

          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Contribución a ODS (Objetivos de Desarrollo Sostenible)</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">ODS 12: Producción Responsable</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">ODS 13: Acción Climática</span>
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">ODS 8: Trabajo Decente</span>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Estado del distintivo */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">Distintivo ESR {period}</div>
            <div className="text-sm text-blue-100">Centro Mexicano para la Filantropía (CEMEFI)</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{avgScore}%</div>
            <div className="text-xs text-blue-200">Cumplimiento total</div>
          </div>
        </div>
      </div>
    </ReportDocument>
  );
}
