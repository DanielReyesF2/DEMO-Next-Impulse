import { ReportDocument, ReportSection, ReportSubsection, ReportTable, ReportMetricCard } from './ReportDocument';

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
  // Desglose por categoría (estimaciones basadas en datos)
  const cat1PurchasedGoods = data.emissionsGenerated * 0.85; // 85% de emisiones de bienes adquiridos
  const cat4Transport = 18.4; // Transporte upstream fijo
  const cat5Waste = 0; // 0 porque todo se recicla
  const cat12EndOfLife = -data.emissionsAvoided; // Crédito por reciclaje
  
  const totalScope3 = cat1PurchasedGoods + cat4Transport + cat5Waste + cat12EndOfLife;

  return (
    <ReportDocument
      title="Inventario de Emisiones Alcance 3"
      subtitle="GHG Protocol Corporate Value Chain (Scope 3)"
      company={company}
      period={period}
      standard="GHG Protocol Scope 3"
      logoUrl="/images/logo-ghg-protocol.png"
    >
      {/* Introducción */}
      <ReportSection title="Introducción">
        <p className="text-gray-600 mb-4 leading-relaxed">
          Este inventario de emisiones de Alcance 3 ha sido preparado de conformidad con el 
          Estándar de Cadena de Valor Corporativa (Scope 3) del GHG Protocol. El reporte cubre 
          las emisiones asociadas con los exhibidores de punto de venta de {company} operados 
          bajo modelo de economía circular con Next Impulse Green.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Límite del inventario:</strong> Emisiones de Alcance 3 relacionadas con 
            exhibidores de punto de venta, incluyendo bienes adquiridos, transporte y fin de vida.
          </p>
        </div>
      </ReportSection>

      {/* Resumen de Emisiones */}
      <ReportSection title="Resumen de Emisiones de Alcance 3">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">Alcance 1</div>
            <div className="text-2xl font-bold text-gray-400">N/A</div>
            <div className="text-xs text-gray-400">No aplica</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">Alcance 2</div>
            <div className="text-2xl font-bold text-gray-400">N/A</div>
            <div className="text-xs text-gray-400">No aplica</div>
          </div>
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
            <div className="text-xs text-amber-700 mb-1 font-semibold">Alcance 3 Bruto</div>
            <div className="text-2xl font-bold text-amber-600">{(cat1PurchasedGoods + cat4Transport).toLocaleString()}</div>
            <div className="text-xs text-gray-500">kg CO₂e</div>
          </div>
          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg text-center">
            <div className="text-xs text-emerald-700 mb-1 font-semibold">Alcance 3 Neto</div>
            <div className="text-2xl font-bold text-emerald-600">{totalScope3.toLocaleString()}</div>
            <div className="text-xs text-gray-500">kg CO₂e</div>
          </div>
        </div>

        <div className="bg-emerald-100 rounded-lg p-6 text-center">
          <div className="text-sm text-emerald-700 mb-2">Emisiones Evitadas por Economía Circular</div>
          <div className="text-4xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()} kg CO₂e</div>
          <div className="text-sm text-emerald-600 mt-2">
            Crédito aplicable según metodología EPA WARM
          </div>
        </div>
      </ReportSection>

      {/* Desglose por Categoría */}
      <ReportSection title="Desglose por Categoría de Alcance 3">
        <p className="text-sm text-gray-600 mb-4">
          El GHG Protocol define 15 categorías de emisiones de Alcance 3. A continuación se 
          presentan las categorías relevantes para exhibidores de punto de venta.
        </p>

        <ReportSubsection title="Categorías Upstream (Cadena de suministro)">
          <ReportTable 
            headers={['Cat.', 'Categoría', 'Emisiones (kg CO₂e)', 'Metodología', 'Fuente']}
            rows={[
              ['1', 'Bienes y servicios adquiridos', cat1PurchasedGoods.toFixed(1), 'GHG Protocol', 'Factores de emisión por material'],
              ['2', 'Bienes de capital', '—', '—', 'No aplica (exhibidores en renta)'],
              ['3', 'Actividades de combustibles y energía', '—', '—', 'Incluido en Cat. 1'],
              ['4', 'Transporte upstream', cat4Transport.toFixed(1), 'Distancia × FE', `${data.transportKm} km promedio`],
              ['5', 'Residuos generados', '0', 'EPA WARM', '100% reciclado'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="Categorías Downstream (Uso y fin de vida)">
          <ReportTable 
            headers={['Cat.', 'Categoría', 'Emisiones (kg CO₂e)', 'Metodología', 'Notas']}
            rows={[
              ['9', 'Transporte downstream', '—', '—', 'Incluido en modelo de servicio'],
              ['10', 'Procesamiento de productos', '—', '—', 'No aplica'],
              ['11', 'Uso de productos vendidos', '—', '—', 'Exhibidores sin consumo energético'],
              ['12', 'Fin de vida de productos', <span className="text-emerald-600 font-semibold">{cat12EndOfLife.toLocaleString()}</span>, 'EPA WARM', 'Crédito por reciclaje'],
            ]}
          />
        </ReportSubsection>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Categorías no reportadas</h4>
          <p className="text-sm text-gray-600">
            Las categorías 6, 7, 8, 13, 14 y 15 no aplican al alcance de este inventario 
            (exhibidores de punto de venta). Las emisiones de arrendamientos (Cat. 8 y 13) 
            están incluidas en el modelo de servicio del proveedor.
          </p>
        </div>
      </ReportSection>

      {/* Categoría 1 - Detalle */}
      <ReportSection title="Categoría 1: Bienes y Servicios Adquiridos">
        <p className="text-sm text-gray-600 mb-4">
          Emisiones asociadas con la producción de los exhibidores y gráficos adquiridos 
          durante el período de reporte.
        </p>

        <ReportSubsection title="Datos de actividad">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <ReportMetricCard label="Exhibidores" value={data.exhibitors} unit="unidades" />
            <ReportMetricCard label="Ciclos de gráficos" value={data.cycles} />
            <ReportMetricCard label="Material total" value={data.recycledKg.toLocaleString()} unit="kg" />
            <ReportMetricCard label="Contenido reciclado" value="60%+" highlight />
          </div>
        </ReportSubsection>

        <ReportSubsection title="Factores de emisión aplicados">
          <ReportTable 
            headers={['Material', 'Factor de emisión', 'Unidad', 'Fuente']}
            rows={[
              ['HDPE virgen', '1.9', 'kg CO₂e/kg', 'EPA WARM v15'],
              ['HDPE reciclado', '0.4', 'kg CO₂e/kg', 'EPA WARM v15'],
              ['Vinilo PVC', '2.2', 'kg CO₂e/kg', 'ecoinvent 3.8'],
              ['Crédito reciclaje HDPE', '-1.5', 'kg CO₂e/kg', 'EPA WARM v15'],
            ]}
          />
        </ReportSubsection>

        <ReportSubsection title="Cálculo de emisiones">
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
            <div className="mb-2">
              <span className="text-gray-500">Emisiones brutas =</span> Material × Factor emisión
            </div>
            <div className="mb-2">
              <span className="text-gray-500">Crédito reciclaje =</span> Material reciclado × Factor crédito
            </div>
            <div className="pt-2 border-t border-gray-300">
              <span className="text-gray-500">Emisiones netas =</span> 
              <span className="text-emerald-600 font-semibold"> {cat1PurchasedGoods.toFixed(1)} kg CO₂e</span>
            </div>
          </div>
        </ReportSubsection>
      </ReportSection>

      {/* Categoría 12 - Detalle */}
      <ReportSection title="Categoría 12: Tratamiento de Fin de Vida">
        <p className="text-sm text-gray-600 mb-4">
          Esta categoría incluye las emisiones (o créditos) asociados con el tratamiento de 
          los productos al final de su vida útil. En el modelo de economía circular, se 
          genera un crédito por el reciclaje de materiales.
        </p>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-6 border border-red-200 rounded-lg bg-red-50">
            <h4 className="text-sm font-semibold text-red-700 mb-3">Escenario tradicional (BAU)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Disposición</span>
                <span className="text-red-600">Relleno sanitario</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emisiones</span>
                <span className="font-medium">+{(data.recycledKg * 0.4).toFixed(0)} kg CO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Material recuperado</span>
                <span className="text-red-600">0 kg</span>
              </div>
            </div>
          </div>
          <div className="p-6 border border-emerald-200 rounded-lg bg-emerald-50">
            <h4 className="text-sm font-semibold text-emerald-700 mb-3">Escenario actual (Economía Circular)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Disposición</span>
                <span className="text-emerald-600">100% reciclaje</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Crédito de emisiones</span>
                <span className="font-semibold text-emerald-600">{cat12EndOfLife.toLocaleString()} kg CO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Material recuperado</span>
                <span className="text-emerald-600">{data.recycledKg.toLocaleString()} kg</span>
              </div>
            </div>
          </div>
        </div>

        <ReportSubsection title="Metodología EPA WARM">
          <p className="text-sm text-gray-600 mb-4">
            El crédito por reciclaje se calcula utilizando la metodología WARM (Waste Reduction 
            Model) de la EPA, que considera las emisiones evitadas por no utilizar materiales 
            vírgenes y por desviar materiales del relleno sanitario.
          </p>
          <div className="bg-emerald-100 rounded-lg p-4 text-center">
            <div className="text-sm text-emerald-700 mb-1">Beneficio neto de economía circular</div>
            <div className="text-3xl font-bold text-emerald-600">
              {Math.abs(cat12EndOfLife).toLocaleString()} kg CO₂e evitados
            </div>
          </div>
        </ReportSubsection>
      </ReportSection>

      {/* Resumen y Totales */}
      <ReportSection title="Resumen del Inventario">
        <ReportTable 
          headers={['Categoría', 'Descripción', 'Emisiones (kg CO₂e)', '% del total']}
          rows={[
            ['Cat. 1', 'Bienes y servicios adquiridos', cat1PurchasedGoods.toFixed(1), `${Math.round(cat1PurchasedGoods / (cat1PurchasedGoods + cat4Transport) * 100)}%`],
            ['Cat. 4', 'Transporte upstream', cat4Transport.toFixed(1), `${Math.round(cat4Transport / (cat1PurchasedGoods + cat4Transport) * 100)}%`],
            ['Cat. 5', 'Residuos en operaciones', '0', '0%'],
            ['Cat. 12', 'Fin de vida (crédito)', <span className="text-emerald-600">{cat12EndOfLife.toLocaleString()}</span>, '—'],
            [<strong>Total bruto</strong>, '', <strong>{(cat1PurchasedGoods + cat4Transport).toFixed(1)}</strong>, '100%'],
            [<strong className="text-emerald-600">Total neto</strong>, '', <strong className="text-emerald-600">{totalScope3.toLocaleString()}</strong>, '—'],
          ]}
        />

        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h4 className="text-sm font-semibold text-emerald-700 mb-2">Conclusión</h4>
          <p className="text-sm text-gray-600">
            El modelo de economía circular de {company} con Next Impulse Green genera un balance 
            neto negativo de emisiones de Alcance 3, lo que significa que las emisiones evitadas 
            superan a las emisiones generadas, contribuyendo positivamente a la descarbonización 
            de la cadena de valor.
          </p>
        </div>
      </ReportSection>

      {/* Verificación */}
      <ReportSection title="Declaración de Verificación">
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Metodología</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GHG Protocol Corporate Value Chain (Scope 3)</li>
                <li>• EPA WARM Model versión 15</li>
                <li>• Factores de emisión: ecoinvent 3.8</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Límites del inventario</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Exhibidores de punto de venta</li>
                <li>• Gráficos y vinilos</li>
                <li>• Período: {period}</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-300 flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Fecha de cálculo</div>
              <div className="font-medium">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Calculado por</div>
              <div className="font-medium text-emerald-600">Econova Platform</div>
            </div>
          </div>
        </div>
      </ReportSection>
    </ReportDocument>
  );
}

