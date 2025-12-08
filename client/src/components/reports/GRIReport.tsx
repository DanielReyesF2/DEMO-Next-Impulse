import { ReportDocument, ReportSection, ReportSubsection, ReportTable, ReportMetricCard, ReportIndicator } from './ReportDocument';

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
    wasteToLandfill: number;
    exhibitors: number;
    cycles: number;
  };
}

export function GRIReport({ company, period, data }: GRIReportProps) {
  const reductionPercent = Math.round((data.emissionsAvoided / (data.emissionsGenerated + data.emissionsAvoided)) * 100);
  
  return (
    <ReportDocument
      title="Reporte GRI Standards"
      subtitle="Global Reporting Initiative 2021"
      company={company}
      period={period}
      standard="GRI Standards 2021"
      logoUrl="/images/logo-gri.png"
    >
      {/* Índice de contenidos GRI */}
      <ReportSection title="Índice de Contenidos GRI">
        <p className="text-sm text-gray-600 mb-4">
          Este reporte ha sido preparado de conformidad con los Estándares GRI 2021, 
          cubriendo los tópicos materiales relacionados con economía circular y gestión ambiental.
        </p>
        <ReportTable 
          headers={['Estándar GRI', 'Descripción', 'Página']}
          rows={[
            ['GRI 301', 'Materiales', '3'],
            ['GRI 305', 'Emisiones', '4'],
            ['GRI 306', 'Residuos', '5'],
          ]}
        />
      </ReportSection>

      {/* GRI 301: Materiales */}
      <ReportSection title="GRI 301: Materiales" id="gri-301">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Enfoque de gestión:</strong> {company} utiliza exhibidores de economía circular 
            fabricados con 60%+ de material reciclado post-consumo, reduciendo la dependencia de 
            materiales vírgenes.
          </p>
        </div>

        <ReportSubsection title="301-1 Materiales utilizados por peso o volumen">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <ReportMetricCard 
              label="Materiales totales" 
              value={data.totalMaterialsKg.toLocaleString()} 
              unit="kg" 
            />
            <ReportMetricCard 
              label="Materiales reciclados" 
              value={data.recycledMaterialsKg.toLocaleString()} 
              unit="kg" 
              highlight 
            />
            <ReportMetricCard 
              label="Materiales vírgenes" 
              value={data.virginMaterialsKg.toLocaleString()} 
              unit="kg" 
            />
          </div>
          <ReportTable 
            headers={['Tipo de material', 'Cantidad (kg)', 'Porcentaje', 'Origen']}
            rows={[
              ['HDPE reciclado post-consumo', data.recycledMaterialsKg.toLocaleString(), `${Math.round(data.recycledMaterialsKg/data.totalMaterialsKg*100)}%`, 'Gráficos y exhibidores reciclados'],
              ['HDPE virgen', data.virginMaterialsKg.toLocaleString(), `${Math.round(data.virginMaterialsKg/data.totalMaterialsKg*100)}%`, 'Proveedores certificados'],
              ['Vinilos y gráficos', (data.cycles * 95).toLocaleString(), '—', 'Campañas de marketing'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="301-2 Insumos reciclados utilizados">
          <ReportIndicator 
            code="301-2a"
            name="Porcentaje de insumos reciclados"
            value={
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-emerald-600">{data.recycledContentPercent}%</span>
                <span className="text-gray-500">del contenido total de exhibidores</span>
              </div>
            }
          />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Detalle por tipo de producto</h4>
            <ReportTable 
              headers={['Producto', 'Contenido reciclado', 'Certificación']}
              rows={[
                ['Cuerpo del exhibidor', '60%+', 'Verificado por Next Impulse Green'],
                ['Gráficos/vinilos', '100% reciclables', 'Ciclo cerrado'],
                ['Componentes metálicos', '30%', 'Acero reciclado'],
              ]}
            />
          </div>
        </ReportSubsection>

        <ReportSubsection title="301-3 Productos y materiales recuperados">
          <div className="grid grid-cols-2 gap-4">
            <ReportMetricCard label="Exhibidores en sistema circular" value={data.exhibitors} unit="unidades" />
            <ReportMetricCard label="Ciclos de recuperación" value={data.cycles} unit="ciclos" highlight />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Todos los exhibidores operan bajo un modelo de economía circular donde los gráficos 
            son recolectados al finalizar cada campaña y reciclados en nuevos productos.
          </p>
        </ReportSubsection>
      </ReportSection>

      {/* GRI 305: Emisiones */}
      <ReportSection title="GRI 305: Emisiones" id="gri-305">
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
          <p className="text-sm text-emerald-800">
            <strong>Enfoque de gestión:</strong> Metodología de cálculo basada en GHG Protocol y 
            EPA WARM Model para contabilizar emisiones de Alcance 3 y beneficios de economía circular.
          </p>
        </div>

        <ReportSubsection title="305-3 Otras emisiones indirectas de GEI (Alcance 3)">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-xs text-red-600 mb-1">Emisiones generadas</div>
              <div className="text-2xl font-bold text-red-600">{data.emissionsGenerated.toLocaleString()}</div>
              <div className="text-xs text-gray-500">kg CO₂e</div>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <div className="text-xs text-emerald-600 mb-1">Emisiones evitadas</div>
              <div className="text-2xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()}</div>
              <div className="text-xs text-gray-500">kg CO₂e</div>
            </div>
            <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-lg text-center">
              <div className="text-xs text-emerald-700 mb-1">Balance neto</div>
              <div className="text-2xl font-bold text-emerald-700">{data.netBalance.toLocaleString()}</div>
              <div className="text-xs text-gray-500">kg CO₂e</div>
            </div>
          </div>
          <ReportTable 
            headers={['Categoría Alcance 3', 'Emisiones (kg CO₂e)', 'Metodología']}
            rows={[
              ['Cat. 1: Bienes y servicios adquiridos', data.emissionsGenerated.toLocaleString(), 'GHG Protocol'],
              ['Cat. 4: Transporte upstream', '18.4', 'Distancia × factor emisión'],
              ['Cat. 12: Fin de vida (crédito)', <span className="text-emerald-600">-{data.emissionsAvoided.toLocaleString()}</span>, 'EPA WARM Model'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="305-5 Reducción de emisiones de GEI">
          <ReportIndicator 
            code="305-5a"
            name="Reducción total de emisiones"
            value={
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()} kg CO₂e</span>
                </div>
                <div className="text-sm text-gray-500">
                  Reducción del {reductionPercent}% vs. sistema tradicional de exhibidores
                </div>
              </div>
            }
          />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Iniciativas de reducción</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Uso de 60%+ material reciclado post-consumo</li>
              <li>• Eliminación de residuos a relleno sanitario</li>
              <li>• Ciclo cerrado de gráficos y vinilos</li>
              <li>• Extensión de vida útil a 10+ años por exhibidor</li>
            </ul>
          </div>
        </ReportSubsection>
      </ReportSection>

      {/* GRI 306: Residuos */}
      <ReportSection title="GRI 306: Residuos" id="gri-306">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Enfoque de gestión:</strong> Modelo de cero residuos a relleno sanitario 
            mediante economía circular. 100% de los materiales son recuperados y reciclados.
          </p>
        </div>

        <ReportSubsection title="306-3 Residuos generados">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <ReportMetricCard 
              label="Total gestionado" 
              value={data.wasteRecycled.toLocaleString()} 
              unit="kg" 
            />
            <ReportMetricCard 
              label="Tasa de reciclaje" 
              value="100" 
              unit="%" 
              highlight 
            />
            <ReportMetricCard 
              label="A relleno sanitario" 
              value={data.wasteToLandfill} 
              unit="kg" 
              highlight 
            />
          </div>
        </ReportSubsection>

        <ReportSubsection title="306-4 Residuos no destinados a eliminación">
          <ReportTable 
            headers={['Tipo de residuo', 'Cantidad (kg)', 'Destino', 'Método']}
            rows={[
              ['Gráficos/vinilos usados', (data.cycles * 90).toLocaleString(), 'Nuevos gráficos o exhibidores', 'Reciclaje cerrado'],
              ['Recortes de producción', (data.cycles * 5).toLocaleString(), 'Reincorporación a proceso', 'Reciclaje interno'],
              ['Exhibidores al fin de vida', '0', 'N/A (vida útil 10+ años)', '—'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="306-5 Residuos destinados a eliminación">
          <div className="bg-emerald-100 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">0 kg</div>
            <div className="text-sm text-emerald-700">
              Cero residuos enviados a relleno sanitario o incineración
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Modelo de economía circular con 100% de recuperación de materiales
            </div>
          </div>
        </ReportSubsection>
      </ReportSection>

      {/* Verificación */}
      <ReportSection title="Verificación y Aseguramiento">
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Fuente de datos</h4>
              <p className="text-sm text-gray-600">
                Plataforma Econova con trazabilidad por exhibidor y ciclo de vida
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Metodología</h4>
              <p className="text-sm text-gray-600">
                GHG Protocol Corporate Standard, EPA WARM Model v15
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Fecha de generación: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-sm font-medium text-emerald-600">
              Verificado por Econova Platform
            </div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}

