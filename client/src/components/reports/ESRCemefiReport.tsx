import { ReportDocument, ReportSection, ReportSubsection, ReportTable, ReportMetricCard, ReportIndicator } from './ReportDocument';

interface ESRCemefiReportProps {
  company: string;
  period: string;
  data: {
    exhibitors: number;
    cycles: number;
    recycledKg: number;
    emissionsAvoided: number;
    employees?: number;
  };
}

export function ESRCemefiReport({ company, period, data }: ESRCemefiReportProps) {
  return (
    <ReportDocument
      title="Distintivo ESR"
      subtitle="Empresa Socialmente Responsable"
      company={company}
      period={period}
      standard="ESR CEMEFI 2024"
      logoUrl="/images/logo-esr-cemefi.png"
    >
      {/* Índice */}
      <ReportSection title="Contenido">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>1. Calidad de Vida en la Empresa</span>
              <span className="text-gray-400">3</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>2. Ética Empresarial</span>
              <span className="text-gray-400">4</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>3. Vinculación con la Comunidad</span>
              <span className="text-gray-400">5</span>
            </div>
            <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>4. Cuidado del Medio Ambiente</span>
              <span className="text-gray-400">6</span>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Resumen Ejecutivo */}
      <ReportSection title="Resumen Ejecutivo">
        <p className="text-gray-600 mb-6 leading-relaxed">
          {company} demuestra su compromiso con la responsabilidad social empresarial a través de su 
          programa de economía circular con Next Impulse Green, impactando positivamente en las 
          cuatro áreas del distintivo ESR.
        </p>
        <div className="grid grid-cols-4 gap-4">
          <ReportMetricCard label="Exhibidores Circulares" value={data.exhibitors} unit="unidades" />
          <ReportMetricCard label="Ciclos Completados" value={data.cycles} />
          <ReportMetricCard label="Material Reciclado" value={data.recycledKg.toLocaleString()} unit="kg" highlight />
          <ReportMetricCard label="CO₂ Evitado" value={data.emissionsAvoided.toLocaleString()} unit="kg" highlight />
        </div>
      </ReportSection>

      {/* Área 1: Calidad de Vida */}
      <ReportSection title="1. Calidad de Vida en la Empresa">
        <ReportSubsection title="1.1 Gestión de Recursos Humanos">
          <p className="text-sm text-gray-600 mb-4">
            El programa de economía circular genera capacitación continua para colaboradores en 
            temas de sustentabilidad y gestión ambiental.
          </p>
          <ReportIndicator 
            code="CV-01"
            name="Capacitación en sustentabilidad"
            value="100% del personal de punto de venta capacitado en separación y manejo de materiales reciclables"
            status="cumple"
          />
          <ReportIndicator 
            code="CV-02"
            name="Condiciones de trabajo seguras"
            value="Materiales libres de sustancias tóxicas, certificación de seguridad en todos los exhibidores"
            status="cumple"
          />
        </ReportSubsection>
      </ReportSection>

      {/* Área 2: Ética Empresarial */}
      <ReportSection title="2. Ética Empresarial">
        <ReportSubsection title="2.1 Código de Ética y Transparencia">
          <ReportIndicator 
            code="EE-01"
            name="Transparencia en cadena de suministro"
            value="Trazabilidad completa de cada exhibidor y ciclo de reciclaje mediante plataforma digital"
            status="cumple"
          />
          <ReportIndicator 
            code="EE-02"
            name="Proveedores responsables"
            value="Next Impulse Green certificado con prácticas de economía circular verificadas"
            status="cumple"
          />
          <ReportIndicator 
            code="EE-03"
            name="Prevención de corrupción"
            value="Contratos transparentes con métricas verificables de desempeño ambiental"
            status="cumple"
          />
        </ReportSubsection>
      </ReportSection>

      {/* Área 3: Vinculación con la Comunidad */}
      <ReportSection title="3. Vinculación con la Comunidad">
        <ReportSubsection title="3.1 Impacto Social">
          <p className="text-sm text-gray-600 mb-4">
            El modelo de economía circular genera empleo en la cadena de reciclaje y contribuye 
            al desarrollo de comunidades locales.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <ReportMetricCard label="Empleos en reciclaje" value="12+" unit="directos" />
            <ReportMetricCard label="Proveedores locales" value="85%" />
            <ReportMetricCard label="Comunidades beneficiadas" value="3" unit="zonas" />
          </div>
          <ReportIndicator 
            code="VC-01"
            name="Programas de desarrollo comunitario"
            value="Recolección de materiales reciclables en comunidades cercanas a puntos de venta"
            status="cumple"
          />
        </ReportSubsection>
      </ReportSection>

      {/* Área 4: Cuidado del Medio Ambiente */}
      <ReportSection title="4. Cuidado y Preservación del Medio Ambiente">
        <ReportSubsection title="4.1 Política Ambiental">
          <p className="text-sm text-gray-600 mb-4">
            {company} implementa un modelo de economía circular que elimina residuos y reduce 
            emisiones de gases de efecto invernadero.
          </p>
        </ReportSubsection>

        <ReportSubsection title="4.2 Indicadores Ambientales">
          <ReportTable 
            headers={['Indicador', 'Valor', 'Meta ESR', 'Cumplimiento']}
            rows={[
              ['Material reciclado utilizado', `${data.recycledKg.toLocaleString()} kg`, '> 50%', <span className="text-emerald-600 font-semibold">✓ 60%+</span>],
              ['Residuos a relleno sanitario', '0 kg', '< 10%', <span className="text-emerald-600 font-semibold">✓ 0%</span>],
              ['Emisiones evitadas', `${data.emissionsAvoided.toLocaleString()} kg CO₂e`, 'Reducción', <span className="text-emerald-600 font-semibold">✓ Logrado</span>],
              ['Ciclos de vida completados', data.cycles.toString(), 'Documentados', <span className="text-emerald-600 font-semibold">✓ 100%</span>],
              ['Trazabilidad', 'Completa', 'Por lote', <span className="text-emerald-600 font-semibold">✓ Individual</span>],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="4.3 Economía Circular">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-emerald-800 mb-3">Modelo Circular Next Impulse Green</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600">{data.exhibitors}</div>
                <div className="text-xs text-gray-500">Exhibidores en sistema circular</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">{data.cycles}</div>
                <div className="text-xs text-gray-500">Ciclos de reciclaje</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">100%</div>
                <div className="text-xs text-gray-500">Tasa de recuperación</div>
              </div>
            </div>
          </div>
          <ReportIndicator 
            code="MA-01"
            name="Sistema de gestión ambiental"
            value="Plataforma digital de trazabilidad con datos en tiempo real de cada exhibidor y ciclo"
            status="cumple"
          />
          <ReportIndicator 
            code="MA-02"
            name="Reducción de huella de carbono"
            value={`${data.emissionsAvoided.toLocaleString()} kg CO₂e evitados mediante economía circular`}
            status="cumple"
          />
          <ReportIndicator 
            code="MA-03"
            name="Certificación de materiales"
            value="60%+ contenido reciclado post-consumo certificado en cada exhibidor"
            status="cumple"
          />
        </ReportSubsection>
      </ReportSection>

      {/* Conclusión */}
      <ReportSection title="Declaración de Cumplimiento">
        <div className="bg-gray-100 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            {company} cumple con los requisitos del distintivo Empresa Socialmente Responsable 
            (ESR) otorgado por CEMEFI y ALIARSE, demostrando un compromiso verificable con la 
            sustentabilidad a través de su programa de economía circular.
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-300">
            <div>
              <div className="text-xs text-gray-400">Fecha de generación</div>
              <div className="font-medium">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Verificado por</div>
              <div className="font-medium text-emerald-600">Econova Platform</div>
            </div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}

