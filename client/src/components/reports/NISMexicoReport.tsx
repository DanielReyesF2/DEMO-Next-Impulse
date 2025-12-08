import { ReportDocument, ReportSection, ReportSubsection, ReportTable, ReportMetricCard, ReportIndicator } from './ReportDocument';

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
  return (
    <ReportDocument
      title="Reporte NIS México"
      subtitle="Norma de Información de Sostenibilidad"
      company={company}
      period={period}
      standard="NIS México 2024"
      logoUrl="/images/logo-nis-mexico.png"
    >
      {/* Índice */}
      <ReportSection title="Índice de Contenidos">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>1. Gobernanza</span>
              <span className="text-gray-400">3</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>2. Estrategia</span>
              <span className="text-gray-400">4</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>3. Gestión de Riesgos</span>
              <span className="text-gray-400">5</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>4. Métricas y Metas</span>
              <span className="text-gray-400">6</span>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Resumen Ejecutivo */}
      <ReportSection title="Resumen Ejecutivo">
        <p className="text-gray-600 mb-6 leading-relaxed">
          De conformidad con la Norma de Información de Sostenibilidad (NIS) México, {company} 
          presenta la información sobre su gestión de riesgos y oportunidades relacionados con 
          el cambio climático y la economía circular en sus operaciones de punto de venta.
        </p>
        <div className="grid grid-cols-4 gap-4">
          <ReportMetricCard label="Exhibidores" value={data.exhibitors} unit="unidades" />
          <ReportMetricCard label="Ciclos" value={data.cycles} />
          <ReportMetricCard label="Material Reciclado" value={data.recycledKg.toLocaleString()} unit="kg" highlight />
          <ReportMetricCard label="Balance CO₂" value={data.netBalance.toLocaleString()} unit="kg" highlight />
        </div>
      </ReportSection>

      {/* Pilar 1: Gobernanza */}
      <ReportSection title="1. Gobernanza">
        <ReportSubsection title="1.1 Supervisión de la Junta Directiva">
          <p className="text-sm text-gray-600 mb-4">
            La gestión de sostenibilidad de los activos de punto de venta está integrada en la 
            estrategia corporativa de {company}, con supervisión a nivel de dirección.
          </p>
          <ReportIndicator 
            code="NIS-G1"
            name="Responsable de sostenibilidad"
            value="Director de Operaciones / Director de Sustentabilidad"
            status="cumple"
          />
          <ReportIndicator 
            code="NIS-G2"
            name="Frecuencia de revisión"
            value="Trimestral - Revisión de métricas de economía circular y emisiones"
            status="cumple"
          />
        </ReportSubsection>

        <ReportSubsection title="1.2 Rol de la Administración">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Proceso de supervisión</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Monitoreo en tiempo real mediante plataforma Econova</li>
              <li>• Reportes trimestrales de ciclos de reciclaje completados</li>
              <li>• KPIs de sostenibilidad integrados en evaluación de proveedores</li>
              <li>• Revisión anual de impacto ambiental en cadena de suministro</li>
            </ul>
          </div>
        </ReportSubsection>
      </ReportSection>

      {/* Pilar 2: Estrategia */}
      <ReportSection title="2. Estrategia">
        <ReportSubsection title="2.1 Riesgos y Oportunidades Climáticos">
          <ReportTable 
            headers={['Tipo', 'Descripción', 'Horizonte', 'Impacto']}
            rows={[
              [<span className="text-red-600">Riesgo</span>, 'Regulación sobre plásticos de un solo uso', 'Corto plazo', 'Bajo (mitigado)'],
              [<span className="text-red-600">Riesgo</span>, 'Aumento de costos de materiales vírgenes', 'Mediano plazo', 'Bajo (mitigado)'],
              [<span className="text-emerald-600">Oportunidad</span>, 'Diferenciación por economía circular', 'Actual', 'Alto'],
              [<span className="text-emerald-600">Oportunidad</span>, 'Reducción de Alcance 3 para clientes', 'Actual', 'Alto'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="2.2 Impacto en el Modelo de Negocio">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="text-sm font-semibold text-red-700 mb-2">Escenario BAU (sin economía circular)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Exhibidores tradicionales de un solo uso</li>
                <li>• Residuos a relleno sanitario</li>
                <li>• Mayor huella de carbono en Alcance 3</li>
                <li>• Exposición a regulaciones futuras</li>
              </ul>
            </div>
            <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
              <h4 className="text-sm font-semibold text-emerald-700 mb-2">Escenario Actual (con Next Impulse)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {data.exhibitors} exhibidores en sistema circular</li>
                <li>• 0% residuos a relleno sanitario</li>
                <li>• Reducción verificable de Alcance 3</li>
                <li>• Cumplimiento anticipado de regulaciones</li>
              </ul>
            </div>
          </div>
        </ReportSubsection>

        <ReportSubsection title="2.3 Resiliencia de la Estrategia">
          <p className="text-sm text-gray-600 mb-4">
            El modelo de economía circular adoptado proporciona resiliencia ante escenarios de 
            transición climática, incluyendo aumento de precios de carbono y regulaciones más estrictas.
          </p>
          <ReportIndicator 
            code="NIS-E1"
            name="Análisis de escenarios"
            value="Escenarios 1.5°C y 2°C evaluados - La estrategia de economía circular mantiene viabilidad en ambos"
            status="cumple"
          />
        </ReportSubsection>
      </ReportSection>

      {/* Pilar 3: Gestión de Riesgos */}
      <ReportSection title="3. Gestión de Riesgos">
        <ReportSubsection title="3.1 Identificación y Evaluación">
          <p className="text-sm text-gray-600 mb-4">
            Los riesgos relacionados con la sostenibilidad en la cadena de suministro de punto 
            de venta son identificados y evaluados como parte del proceso de gestión de riesgos empresariales.
          </p>
          <ReportTable 
            headers={['Riesgo', 'Probabilidad', 'Impacto', 'Mitigación']}
            rows={[
              ['Interrupción de suministro de materiales reciclados', 'Baja', 'Medio', 'Diversificación de fuentes + inventario'],
              ['Incumplimiento de metas de reciclaje', 'Muy baja', 'Alto', 'Trazabilidad en tiempo real'],
              ['Cambios regulatorios sobre plásticos', 'Media', 'Bajo', 'Ya cumple con economía circular'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="3.2 Integración en Gestión de Riesgos Empresariales">
          <ReportIndicator 
            code="NIS-R1"
            name="Integración en ERM"
            value="Riesgos de sostenibilidad incorporados en matriz de riesgos corporativa con revisión trimestral"
            status="cumple"
          />
          <ReportIndicator 
            code="NIS-R2"
            name="Monitoreo continuo"
            value="Plataforma Econova proporciona alertas en tiempo real sobre desviaciones en ciclos de reciclaje"
            status="cumple"
          />
        </ReportSubsection>
      </ReportSection>

      {/* Pilar 4: Métricas y Metas */}
      <ReportSection title="4. Métricas y Metas">
        <ReportSubsection title="4.1 Métricas de Cambio Climático">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1">Alcance 3 - Generado</div>
              <div className="text-2xl font-bold text-gray-700">{data.emissionsGenerated.toLocaleString()}</div>
              <div className="text-xs text-gray-400">kg CO₂e</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1">Emisiones Evitadas</div>
              <div className="text-2xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()}</div>
              <div className="text-xs text-gray-400">kg CO₂e</div>
            </div>
            <div className="p-4 bg-emerald-100 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1">Balance Neto</div>
              <div className="text-2xl font-bold text-emerald-700">{data.netBalance.toLocaleString()}</div>
              <div className="text-xs text-gray-400">kg CO₂e</div>
            </div>
          </div>
        </ReportSubsection>

        <ReportSubsection title="4.2 Métricas de Economía Circular">
          <ReportTable 
            headers={['Métrica', 'Valor', 'Unidad', 'Meta']}
            rows={[
              ['Exhibidores en sistema circular', data.exhibitors.toString(), 'unidades', '100%'],
              ['Contenido reciclado promedio', `${data.recycledContentPercent}%`, '—', '≥60%'],
              ['Tasa de recuperación de gráficos', '100%', '—', '100%'],
              ['Ciclos completados', data.cycles.toString(), 'ciclos', 'N/A'],
              ['Material procesado', data.recycledKg.toLocaleString(), 'kg', 'N/A'],
              ['Residuos a relleno sanitario', '0', 'kg', '0'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="4.3 Metas y Progreso">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">100% de exhibidores en economía circular</span>
                <span className="text-sm font-bold text-emerald-600">✓ Logrado</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">0% residuos a relleno sanitario</span>
                <span className="text-sm font-bold text-emerald-600">✓ Logrado</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">≥60% contenido reciclado</span>
                <span className="text-sm font-bold text-emerald-600">✓ {data.recycledContentPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </ReportSubsection>
      </ReportSection>

      {/* Declaración */}
      <ReportSection title="Declaración de Conformidad">
        <div className="bg-gray-100 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            Este reporte ha sido preparado de conformidad con los lineamientos de la Norma de 
            Información de Sostenibilidad (NIS) México, cubriendo los pilares de Gobernanza, 
            Estrategia, Gestión de Riesgos y Métricas relacionados con la gestión de exhibidores 
            de punto de venta bajo modelo de economía circular.
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-300">
            <div>
              <div className="text-xs text-gray-400">Fecha de emisión</div>
              <div className="font-medium">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Plataforma de verificación</div>
              <div className="font-medium text-emerald-600">Econova</div>
            </div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}

