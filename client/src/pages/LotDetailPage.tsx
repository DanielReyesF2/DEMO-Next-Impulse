import AppLayout from "@/components/layout/AppLayout";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLotById, flowTypes } from "@/data/mockLots";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CleanStatCard } from "@/components/ui/CleanStatCard";
import { CycleTimeline } from "@/components/detail/CycleTimeline";
import { TraceabilityQR } from "@/components/detail/TraceabilityQR";

export default function LotDetailPage() {
  const [, params] = useRoute<{ lotId: string }>("/lot/:lotId");
  const lotId = params?.lotId;

  if (!lotId) return <div>Error: ID de lote no válido</div>;

  const lot = getLotById(lotId);
  if (!lot) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lote no encontrado</h1>
            <p className="text-gray-500 mb-4">El lote {lotId} no existe</p>
          <Link href="/">
              <button className="text-green-600 hover:underline">Volver al inicio</button>
          </Link>
        </div>
      </div>
      </AppLayout>
    );
  }

  const flowTypeInfo = flowTypes.find((ft) => ft.id === lot.flowType);
  const latestCycle = lot.cycles[lot.cycles.length - 1];
  const totalEmitted = lot.cycles.reduce((sum, c) => sum + c.emissions.total, 0);
  const totalDistance = lot.cycles.reduce((sum, c) => sum + c.distance, 0);
  const transportTotal = lot.cycles.reduce((sum, c) => sum + c.emissions.transport, 0);
  const processingTotal = lot.cycles.reduce((sum, c) => sum + c.emissions.processing, 0);
  const netBalance = totalEmitted - lot.totalEmissionsAvoided;

  const durationText = (() => {
    if (latestCycle?.startDate && latestCycle?.endDate) return "Duración estimada";
    return "En curso";
  })();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
        <Link href={`/lots/${lot.flowType}`}>
              <button className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </Link>
            <Breadcrumbs
              items={[
                { label: "Trazabilidad", href: "/trazabilidad" },
                { label: "Lotes", href: `/lots/${lot.flowType}` },
                { label: lot.id },
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Exportar CSV
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-sm">
              Generar Reporte
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Lote</p>
                  <h1 className="text-3xl font-bold text-gray-900 mt-1">{lot.id}</h1>
                  <p className="text-sm text-gray-500 mt-1">{flowTypeInfo?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Producto</p>
                  <p className="text-sm font-medium text-gray-800">{lot.productType}</p>
                </div>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CleanStatCard title="Emisiones Totales" value={`${totalEmitted.toFixed(1)} kg CO₂e`} helper="Este ciclo completo" />
              <CleanStatCard
                title="Emisiones Evitadas"
                value={`${lot.totalEmissionsAvoided.toFixed(1)} kg CO₂e`}
                helper="vs. producción virgen"
                emphasis="positive"
              />
              <CleanStatCard
                title="Balance Neto"
                value={`${netBalance >= 0 ? "" : "-"}${Math.abs(netBalance).toFixed(1)} kg CO₂e`}
                helper="Reducción estimada"
                emphasis="positive"
              />
              <CleanStatCard title="Distancia Total" value={`${totalDistance} km`} helper={`${lot.cycles.length} trayectos`} />
            </div>

            {/* Desglose simple */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">Desglose</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CleanStatCard title="Transporte" value={`+${transportTotal.toFixed(1)} kg CO₂e`} helper="Emisiones transporte" />
                <CleanStatCard title="Procesamiento" value={`+${processingTotal.toFixed(1)} kg CO₂e`} helper="Emisiones procesamiento" />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">Historial de ciclos</p>
            <CycleTimeline lot={lot} />
            </div>
          </div>
          
          {/* Right panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-500">Información del lote</p>
                  <p className="text-sm font-medium text-gray-900">{lot.id}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <InfoRow label="Estado" value={lot.status === "active" ? "Ciclo en curso" : "Completado"} />
                <InfoRow label="Fabricante" value="Next Impulse Green" />
                <InfoRow label="Cliente" value={`${latestCycle?.client ?? "Cliente"} — ${latestCycle?.brand ?? ""}`} />
                <InfoRow label="Período" value={latestCycle?.startDate ?? ""} />
                <InfoRow label="Duración" value={durationText} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-center space-y-2">
              <p className="text-xs uppercase text-gray-500">Ciclo de vida</p>
              <div className="text-4xl font-extrabold text-green-600">{lot.currentCycle}</div>
              <p className="text-sm text-gray-600">Ciclo actual</p>
              <p className="text-xs text-gray-500">
                Este material ha sido reciclado y transformado {lot.currentCycle} veces, extendiendo su vida útil.
              </p>
            </div>

            <TraceabilityQR lotId={lot.id} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}
