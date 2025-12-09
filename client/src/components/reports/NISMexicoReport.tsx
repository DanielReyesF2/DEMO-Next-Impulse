import { ReportDocument, ReportSection, ReportKPIRow, ReportComparisonBar, ReportStatusBadge, ReportDonutChart } from './ReportDocument';
import { Shield, Target, AlertTriangle, BarChart3, Info, TrendingUp, Leaf } from 'lucide-react';

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
  // Los 4 pilares de la NIS México (basada en TCFD/ISSB)
  const pillars = [
    { 
      id: 'G',
      icon: Shield, 
      name: 'Gobernanza', 
      desc: 'Supervisión de riesgos climáticos',
      status: 'cumple' as const,
      color: '#3B82F6',
      details: [
        'Comité de sustentabilidad activo',
        'Revisión trimestral de métricas',
        'Responsabilidades definidas',
      ]
    },
    { 
      id: 'E',
      icon: Target, 
      name: 'Estrategia', 
      desc: 'Modelo de economía circular',
      status: 'cumple' as const,
      color: '#10B981',
      details: [
        'Economía circular como estrategia core',
        'Análisis de escenarios climáticos',
        'Transición a carbono neutral',
      ]
    },
    { 
      id: 'R',
      icon: AlertTriangle, 
      name: 'Gestión de Riesgos', 
      desc: 'Identificación y mitigación',
      status: 'cumple' as const,
      color: '#F59E0B',
      details: [
        'Riesgos físicos identificados',
        'Riesgos de transición mapeados',
        'Plan de mitigación activo',
      ]
    },
    { 
      id: 'M',
      icon: BarChart3, 
      name: 'Métricas y Metas', 
      desc: 'KPIs de sustentabilidad',
      status: 'cumple' as const,
      color: '#8B5CF6',
      details: [
        'Emisiones GEI Alcance 3',
        'Trazabilidad lote por lote',
        'Metas de reducción definidas',
      ]
    },
  ];

  // Métricas clave NIS
  const metrics = [
    { 
      name: 'Exhibidores en economía circular', 
      target: '100%', 
      actual: '100%', 
      status: 'cumple' as const,
      trend: 'up'
    },
    { 
      name: 'Contenido reciclado en productos', 
      target: '≥60%', 
      actual: `${data.recycledContentPercent}%`, 
      status: 'cumple' as const,
      trend: 'up'
    },
    { 
      name: 'Residuos a disposición final', 
      target: '<5%', 
      actual: '0%', 
      status: 'cumple' as const,
      trend: 'down'
    },
    { 
      name: 'Reducción emisiones vs base', 
      target: '-20%', 
      actual: `-${Math.round((data.emissionsAvoided / (data.emissionsAvoided + data.emissionsGenerated)) * 100)}%`, 
      status: 'cumple' as const,
      trend: 'down'
    },
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
      {/* Nota sobre el estándar */}
      <div className="bg-purple-50 rounded-lg p-3 mb-4 text-xs text-purple-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium">NIS México:</span> Norma de Información de Sostenibilidad basada en 
          estándares internacionales (TCFD, ISSB, SASB). Requiere divulgación de información ESG 
          (Ambiental, Social, Gobernanza) con enfoque en materialidad financiera.
        </div>
      </div>

      {/* KPIs principales */}
      <ReportKPIRow items={[
        { label: 'Exhibidores', value: data.exhibitors },
        { label: 'Contenido reciclado', value: `${data.recycledContentPercent}%`, highlight: true },
        { label: 'Balance CO₂', value: data.netBalance, unit: 'kg', highlight: true },
      ]} />

      {/* Los 4 Pilares TCFD */}
      <ReportSection title="Divulgaciones por Pilar (Framework TCFD)">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: pillar.color }}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500">{pillar.id}</span>
                    <div className="text-sm font-semibold text-gray-700">{pillar.name}</div>
                  </div>
                </div>
                <ReportStatusBadge status={pillar.status} />
                <div className="text-xs text-gray-500 mt-2">{pillar.desc}</div>
              </div>
            );
          })}
        </div>
      </ReportSection>

      {/* Detalle de cada pilar */}
      <ReportSection title="Detalle de Divulgaciones">
        <div className="grid grid-cols-2 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: pillar.color }}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{pillar.name}</span>
                </div>
                <ul className="space-y-1">
                  {pillar.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-emerald-500">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ReportSection>

      {/* Análisis de escenarios (Estrategia) */}
      <ReportSection title="Análisis de Escenarios Climáticos">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-700">Escenario BAU (Business as Usual)</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Exhibidores de un solo uso</li>
              <li>• {(data.emissionsGenerated + data.emissionsAvoided).toLocaleString()} kg CO₂e/período</li>
              <li>• Residuos a relleno sanitario</li>
              <li>• Riesgo regulatorio alto</li>
            </ul>
          </div>
          <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">Escenario Actual (Economía Circular)</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• {data.exhibitors} exhibidores circulares</li>
              <li>• {data.emissionsGenerated.toLocaleString()} kg CO₂e/período</li>
              <li>• 0% a disposición final</li>
              <li>• Riesgo regulatorio bajo</li>
            </ul>
          </div>
        </div>
        <ReportComparisonBar 
          label="Emisiones por escenario (kg CO₂e)"
          traditional={data.emissionsGenerated + data.emissionsAvoided}
          circular={data.emissionsGenerated}
          unit="kg"
        />
      </ReportSection>

      {/* Métricas y Metas */}
      <ReportSection title="Métricas y Metas de Sostenibilidad">
        <div className="space-y-2">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 flex-1">
                <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-emerald-500' : 'text-emerald-500 rotate-180'}`} />
                <span className="text-sm text-gray-700">{metric.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Meta</div>
                  <div className="text-sm font-medium text-gray-600">{metric.target}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Actual</div>
                  <div className="text-sm font-bold text-emerald-600">{metric.actual}</div>
                </div>
                <div className="w-28 bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                </div>
                <ReportStatusBadge status={metric.status} />
              </div>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Materialidad */}
      <ReportSection title="Temas Materiales Identificados">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <ReportDonutChart value={95} total={100} label="" color="#10B981" />
            <div className="text-sm font-medium text-gray-700 mt-2">Economía Circular</div>
            <div className="text-xs text-gray-500">Alta materialidad</div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <ReportDonutChart value={90} total={100} label="" color="#3B82F6" />
            <div className="text-sm font-medium text-gray-700 mt-2">Emisiones GEI</div>
            <div className="text-xs text-gray-500">Alta materialidad</div>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <ReportDonutChart value={85} total={100} label="" color="#8B5CF6" />
            <div className="text-sm font-medium text-gray-700 mt-2">Gestión de Residuos</div>
            <div className="text-xs text-gray-500">Alta materialidad</div>
          </div>
        </div>
      </ReportSection>

      {/* Estado de cumplimiento */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">Cumplimiento NIS México {period}</div>
            <div className="text-sm text-purple-200">Norma de Información de Sostenibilidad</div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-200" />
            <div className="text-right">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-purple-200">Pilares cumplidos</div>
            </div>
          </div>
        </div>
      </div>
    </ReportDocument>
  );
}
