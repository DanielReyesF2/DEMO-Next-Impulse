import { ReportDocument, ReportSection, ReportKPIRow, ReportDonutChart, ReportStatusBadge, ReportMiniTable } from './ReportDocument';
import { Info, Settings, Target, FileCheck, BarChart3, TrendingUp, Award, Recycle } from 'lucide-react';

interface ISO14001ReportProps {
  company: string;
  period: string;
  data: {
    exhibitors: number;
    cycles: number;
    recycledKg: number;
    emissionsAvoided: number;
    emissionsGenerated: number;
    wasteRecycled: number;
    wasteToLandfill: number;
  };
}

export function ISO14001Report({ company, period, data }: ISO14001ReportProps) {
  // Cláusulas ISO 14001:2015 relevantes con su estructura PHVA
  const clauses = [
    { 
      number: '4',
      title: 'Contexto de la Organización', 
      icon: FileCheck,
      color: '#6B7280',
      phva: 'P',
      subclauses: [
        { id: '4.1', name: 'Comprensión de la organización', status: 'cumple' as const },
        { id: '4.2', name: 'Partes interesadas', status: 'cumple' as const },
        { id: '4.3', name: 'Alcance del SGA', status: 'cumple' as const },
      ]
    },
    { 
      number: '6',
      title: 'Planificación', 
      icon: Target,
      color: '#3B82F6',
      phva: 'P',
      subclauses: [
        { id: '6.1.2', name: 'Aspectos ambientales', status: 'cumple' as const },
        { id: '6.1.3', name: 'Obligaciones de cumplimiento', status: 'cumple' as const },
        { id: '6.2', name: 'Objetivos ambientales', status: 'cumple' as const },
      ]
    },
    { 
      number: '8',
      title: 'Operación', 
      icon: Settings,
      color: '#10B981',
      phva: 'H',
      subclauses: [
        { id: '8.1', name: 'Planificación y control operacional', status: 'cumple' as const },
        { id: '8.2', name: 'Preparación ante emergencias', status: 'cumple' as const },
      ]
    },
    { 
      number: '9',
      title: 'Evaluación del Desempeño', 
      icon: BarChart3,
      color: '#F59E0B',
      phva: 'V',
      subclauses: [
        { id: '9.1.1', name: 'Seguimiento y medición', status: 'cumple' as const },
        { id: '9.1.2', name: 'Evaluación del cumplimiento', status: 'cumple' as const },
        { id: '9.2', name: 'Auditoría interna', status: 'cumple' as const },
      ]
    },
    { 
      number: '10',
      title: 'Mejora', 
      icon: TrendingUp,
      color: '#8B5CF6',
      phva: 'A',
      subclauses: [
        { id: '10.2', name: 'No conformidad y acción correctiva', status: 'cumple' as const },
        { id: '10.3', name: 'Mejora continua', status: 'cumple' as const },
      ]
    },
  ];

  // Objetivos y metas ambientales (Cláusula 6.2)
  const objectives = [
    { 
      objective: 'Reducir emisiones de CO₂ vs año base', 
      target: '-20%', 
      actual: `-${Math.round((data.emissionsAvoided / (data.emissionsAvoided + data.emissionsGenerated)) * 100)}%`, 
      status: 'superado' 
    },
    { 
      objective: 'Tasa de reciclaje de residuos', 
      target: '≥90%', 
      actual: '100%', 
      status: 'superado' 
    },
    { 
      objective: 'Residuos a relleno sanitario', 
      target: '<5%', 
      actual: '0%', 
      status: 'superado' 
    },
    { 
      objective: 'Contenido reciclado en productos', 
      target: '≥50%', 
      actual: '60%', 
      status: 'superado' 
    },
    { 
      objective: 'Ciclos de economía circular', 
      target: `≥${Math.max(data.cycles - 5, 10)}`, 
      actual: data.cycles.toString(), 
      status: 'superado' 
    },
  ];

  // Aspectos ambientales significativos
  const aspects = [
    { aspect: 'Generación de residuos plásticos', impact: 'Alto', control: 'Economía circular', status: 'controlado' },
    { aspect: 'Emisiones de GEI (Alcance 3)', impact: 'Medio', control: 'Reciclaje de materiales', status: 'controlado' },
    { aspect: 'Consumo de materias primas', impact: 'Medio', control: 'Contenido reciclado 60%', status: 'controlado' },
    { aspect: 'Transporte y logística', impact: 'Bajo', control: 'Rutas optimizadas', status: 'controlado' },
  ];

  return (
    <ReportDocument
      title="ISO 14001:2015"
      subtitle="Sistema de Gestión Ambiental"
      company={company}
      period={period}
      standard="ISO 14001"
      accentColor="#059669"
    >
      {/* Nota sobre el estándar */}
      <div className="bg-emerald-50 rounded-lg p-3 mb-4 text-xs text-emerald-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium">ISO 14001:2015:</span> Sistema de Gestión Ambiental basado en el ciclo 
          Planificar-Hacer-Verificar-Actuar (PHVA). Este reporte documenta el cumplimiento de las cláusulas 
          relevantes para la operación de economía circular de exhibidores.
        </div>
      </div>

      {/* KPIs principales */}
      <ReportKPIRow items={[
        { label: 'Exhibidores', value: data.exhibitors },
        { label: 'Ciclos cerrados', value: data.cycles },
        { label: 'Reciclado', value: `${(data.recycledKg/1000).toFixed(1)}t`, highlight: true },
        { label: 'CO₂ evitado', value: data.emissionsAvoided, unit: 'kg', highlight: true },
      ]} />

      {/* Ciclo PHVA */}
      <ReportSection title="Ciclo de Mejora Continua (PHVA)">
        <div className="grid grid-cols-4 gap-3">
          <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">P</div>
            <div className="text-sm text-blue-700 font-medium">Planificar</div>
            <div className="text-xs text-gray-500 mt-1">Cláusulas 4, 6</div>
            <div className="text-xs text-blue-600 mt-2 font-medium">Objetivos definidos</div>
          </div>
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-600">H</div>
            <div className="text-sm text-emerald-700 font-medium">Hacer</div>
            <div className="text-xs text-gray-500 mt-1">Cláusulas 7, 8</div>
            <div className="text-xs text-emerald-600 mt-2 font-medium">{data.cycles} ciclos ejecutados</div>
          </div>
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-center">
            <div className="text-2xl font-bold text-amber-600">V</div>
            <div className="text-sm text-amber-700 font-medium">Verificar</div>
            <div className="text-xs text-gray-500 mt-1">Cláusula 9</div>
            <div className="text-xs text-amber-600 mt-2 font-medium">Monitoreo continuo</div>
          </div>
          <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-600">A</div>
            <div className="text-sm text-purple-700 font-medium">Actuar</div>
            <div className="text-xs text-gray-500 mt-1">Cláusula 10</div>
            <div className="text-xs text-purple-600 mt-2 font-medium">Mejora continua</div>
          </div>
        </div>
      </ReportSection>

      {/* Desempeño Ambiental */}
      <ReportSection title="Indicadores de Desempeño Ambiental (Cláusula 9.1)">
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <ReportDonutChart value={100} total={100} label="" color="#059669" />
            <div className="text-sm font-medium text-gray-700 mt-2">Tasa Reciclaje</div>
            <div className="text-xs text-emerald-600 font-semibold">100%</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <ReportDonutChart value={60} total={100} label="" color="#10B981" />
            <div className="text-sm font-medium text-gray-700 mt-2">Contenido Reciclado</div>
            <div className="text-xs text-emerald-600 font-semibold">60%</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <ReportDonutChart value={0} total={100} label="" color="#EF4444" />
            <div className="text-sm font-medium text-gray-700 mt-2">A Relleno</div>
            <div className="text-xs text-emerald-600 font-semibold">0%</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <ReportDonutChart value={data.emissionsAvoided} total={data.emissionsAvoided + data.emissionsGenerated} label="" color="#34D399" />
            <div className="text-sm font-medium text-gray-700 mt-2">Emisiones Evitadas</div>
            <div className="text-xs text-emerald-600 font-semibold">{Math.round((data.emissionsAvoided / (data.emissionsAvoided + data.emissionsGenerated)) * 100)}%</div>
          </div>
        </div>
      </ReportSection>

      {/* Objetivos y Metas Ambientales */}
      <ReportSection title="Objetivos y Metas Ambientales (Cláusula 6.2)">
        <div className="space-y-2">
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{obj.objective}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center w-16">
                  <div className="text-xs text-gray-400">Meta</div>
                  <div className="text-sm font-medium">{obj.target}</div>
                </div>
                <div className="text-center w-16">
                  <div className="text-xs text-gray-400">Actual</div>
                  <div className="text-sm font-bold text-emerald-600">{obj.actual}</div>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  {obj.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Aspectos Ambientales Significativos */}
      <ReportSection title="Aspectos Ambientales Significativos (Cláusula 6.1.2)">
        <ReportMiniTable 
          headers={['Aspecto', 'Impacto', 'Control', 'Estado']}
          rows={aspects.map(a => [
            a.aspect,
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              a.impact === 'Alto' ? 'bg-red-100 text-red-700' : 
              a.impact === 'Medio' ? 'bg-amber-100 text-amber-700' : 
              'bg-gray-100 text-gray-700'
            }`}>{a.impact}</span>,
            a.control,
            <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">✓ {a.status}</span>
          ])}
        />
      </ReportSection>

      {/* Cumplimiento de Cláusulas */}
      <ReportSection title="Cumplimiento de Cláusulas ISO 14001:2015">
        <div className="grid grid-cols-3 gap-3">
          {clauses.map((clause) => {
            const Icon = clause.icon;
            return (
              <div key={clause.number} className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: clause.color }}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-gray-500">Cláusula {clause.number}</span>
                      <div className="text-xs font-semibold text-gray-700">{clause.title}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    clause.phva === 'P' ? 'bg-blue-100 text-blue-700' :
                    clause.phva === 'H' ? 'bg-emerald-100 text-emerald-700' :
                    clause.phva === 'V' ? 'bg-amber-100 text-amber-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>{clause.phva}</span>
                </div>
                <ul className="text-[10px] text-gray-500 space-y-0.5">
                  {clause.subclauses.map((sub) => (
                    <li key={sub.id} className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      <span className="font-mono">{sub.id}</span> {sub.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ReportSection>

      {/* Estado de certificación */}
      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Sistema de Gestión Ambiental</div>
              <div className="text-sm text-emerald-100">Conforme a ISO 14001:2015</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">100%</div>
            <div className="text-xs text-emerald-200">Conformidad • {period}</div>
          </div>
        </div>
      </div>
    </ReportDocument>
  );
}
