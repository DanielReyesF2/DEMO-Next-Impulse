import { ReportDocument, ReportSection, ReportKPIRow, ReportMiniTable, ReportComparisonBar, ReportDonutChart } from './ReportDocument';
import { Info, ArrowRight, Factory, Truck, Recycle, Package } from 'lucide-react';

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
  // Cálculos por categoría del Alcance 3
  const cat1_purchasedGoods = data.emissionsGenerated * 0.70; // Bienes comprados
  const cat4_upstreamTransport = data.emissionsGenerated * 0.15; // Transporte upstream
  const cat5_wasteOperations = 0; // Residuos en operaciones (0 por economía circular)
  const cat9_downstreamTransport = data.emissionsGenerated * 0.15; // Transporte downstream
  const cat12_endOfLife = -data.emissionsAvoided; // Crédito por fin de vida

  const totalUpstream = cat1_purchasedGoods + cat4_upstreamTransport + cat5_wasteOperations;
  const totalDownstream = cat9_downstreamTransport + cat12_endOfLife;
  const totalBruto = cat1_purchasedGoods + cat4_upstreamTransport + cat9_downstreamTransport;
  const totalNeto = totalBruto + cat12_endOfLife;

  // Factor de emisión del reciclaje (EPA WARM)
  const emissionFactor = 2.53; // kg CO₂e por kg HDPE reciclado evitado

  return (
    <ReportDocument
      title="Alcance 3"
      subtitle="GHG Protocol Corporate Value Chain"
      company={company}
      period={period}
      standard="GHG"
      accentColor="#F59E0B"
    >
      {/* Nota metodológica */}
      <div className="bg-amber-50 rounded-lg p-3 mb-4 text-xs text-amber-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium">Metodología:</span> Este inventario sigue el GHG Protocol Corporate Value Chain 
          (Scope 3) Standard. Emisiones evitadas por reciclaje calculadas con EPA WARM v15 
          (factor: {emissionFactor} kg CO₂e/kg HDPE).
        </div>
      </div>

      {/* Resumen visual de los 3 alcances */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          <div className="text-xs text-gray-500 mb-1">Alcance 1</div>
          <div className="text-lg font-bold text-gray-400">—</div>
          <div className="text-[10px] text-gray-400">Emisiones directas</div>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          <div className="text-xs text-gray-500 mb-1">Alcance 2</div>
          <div className="text-lg font-bold text-gray-400">—</div>
          <div className="text-[10px] text-gray-400">Energía indirecta</div>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <div className="text-xs text-amber-600 mb-1 font-medium">Alcance 3 Bruto</div>
          <div className="text-lg font-bold text-amber-600">{totalBruto.toFixed(0)}</div>
          <div className="text-[10px] text-gray-500">kg CO₂e</div>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
          <div className="text-xs text-emerald-600 mb-1 font-medium">Alcance 3 Neto</div>
          <div className="text-lg font-bold text-emerald-600">{totalNeto.toFixed(0)}</div>
          <div className="text-[10px] text-gray-500">kg CO₂e</div>
        </div>
      </div>

      {/* Desglose por categoría */}
      <ReportSection title="Desglose por Categoría (15 categorías GHG Protocol)">
        <div className="space-y-4">
          {/* Upstream */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">Upstream (Categorías 1-8)</span>
              <span className="text-xs text-gray-500 ml-auto">{totalUpstream.toFixed(0)} kg CO₂e</span>
            </div>
            <ReportMiniTable 
              headers={['Cat.', 'Descripción', 'kg CO₂e', 'Relevancia']}
              rows={[
                [
                  <span className="font-mono text-xs bg-blue-100 px-1 rounded">1</span>, 
                  'Bienes y servicios adquiridos', 
                  cat1_purchasedGoods.toFixed(1), 
                  <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Alta</span>
                ],
                [
                  <span className="font-mono text-xs bg-blue-100 px-1 rounded">4</span>, 
                  'Transporte y distribución upstream', 
                  cat4_upstreamTransport.toFixed(1), 
                  <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Alta</span>
                ],
                [
                  <span className="font-mono text-xs bg-blue-100 px-1 rounded">5</span>, 
                  'Residuos generados en operaciones', 
                  <span className="text-emerald-600 font-semibold">0</span>, 
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">Circular</span>
                ],
              ]}
            />
          </div>

          {/* Downstream */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">Downstream (Categorías 9-15)</span>
              <span className="text-xs text-gray-500 ml-auto">{totalDownstream.toFixed(0)} kg CO₂e</span>
            </div>
            <ReportMiniTable 
              headers={['Cat.', 'Descripción', 'kg CO₂e', 'Relevancia']}
              rows={[
                [
                  <span className="font-mono text-xs bg-purple-100 px-1 rounded">9</span>, 
                  'Transporte y distribución downstream', 
                  cat9_downstreamTransport.toFixed(1), 
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Media</span>
                ],
                [
                  <span className="font-mono text-xs bg-purple-100 px-1 rounded">12</span>, 
                  'Tratamiento de productos vendidos (fin de vida)', 
                  <span className="text-emerald-600 font-semibold">{cat12_endOfLife.toFixed(0)}</span>, 
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">Crédito</span>
                ],
              ]}
            />
          </div>
        </div>
      </ReportSection>

      {/* Flujo visual de emisiones */}
      <ReportSection title="Flujo de Emisiones de Carbono">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Factory className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700">Producción</div>
              <div className="text-xs text-gray-500">Cat. 1</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700">Transporte</div>
              <div className="text-xs text-gray-500">Cat. 4, 9</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700">Uso</div>
              <div className="text-xs text-gray-500">{data.cycles} ciclos</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Recycle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-emerald-700">Reciclaje</div>
              <div className="text-xs text-emerald-600">Cat. 12 ✓</div>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Comparación visual */}
      <ReportSection title="Impacto de la Economía Circular">
        <ReportComparisonBar 
          label="Huella de carbono del modelo"
          traditional={totalBruto}
          circular={Math.abs(totalNeto)}
          unit="kg CO₂e"
        />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-center">
            <div className="text-xs text-red-600 font-medium mb-1">Modelo lineal (sin reciclaje)</div>
            <div className="text-2xl font-bold text-red-600">+{totalBruto.toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg CO₂e al ambiente</div>
          </div>
          <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg text-center">
            <div className="text-xs text-emerald-600 font-medium mb-1">Modelo circular (Next Impulse)</div>
            <div className="text-2xl font-bold text-emerald-600">{totalNeto.toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg CO₂e (balance negativo)</div>
          </div>
        </div>
      </ReportSection>

      {/* Crédito de reciclaje detallado */}
      <ReportSection title="Crédito por Reciclaje (Categoría 12)">
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <ReportDonutChart value={data.recycledKg} total={data.recycledKg} label="" color="#10B981" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()} kg CO₂e</div>
              <div className="text-sm text-gray-600">emisiones evitadas por reciclar {data.recycledKg.toLocaleString()} kg de HDPE</div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Material reciclado:</span>
              <span className="font-medium">{data.recycledKg.toLocaleString()} kg HDPE</span>
            </div>
            <div className="flex justify-between">
              <span>Factor de emisión (EPA WARM v15):</span>
              <span className="font-medium">{emissionFactor} kg CO₂e/kg</span>
            </div>
            <div className="flex justify-between border-t pt-1 mt-1">
              <span className="font-medium">Total evitado:</span>
              <span className="font-bold text-emerald-600">{data.emissionsAvoided.toLocaleString()} kg CO₂e</span>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Resumen ejecutivo */}
      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg border border-emerald-200">
        <div className="text-sm font-semibold text-gray-700 mb-2">Resumen Ejecutivo</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-gray-700">{data.exhibitors}</div>
            <div className="text-xs text-gray-500">Exhibidores en operación</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-600">{totalBruto.toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg CO₂e generados</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-600">{Math.abs(cat12_endOfLife).toFixed(0)}</div>
            <div className="text-xs text-gray-500">kg CO₂e compensados</div>
          </div>
        </div>
      </div>
    </ReportDocument>
  );
}
