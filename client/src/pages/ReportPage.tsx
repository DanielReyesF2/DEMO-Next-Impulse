import { useRoute } from 'wouter';
import { getLotById } from '@/data/mockLots';
import { ReportHeader } from '@/components/report/ReportHeader';
import { ReportMetrics } from '@/components/report/ReportMetrics';
import { ReportTimeline } from '@/components/report/ReportTimeline';

export default function ReportPage() {
  const [, params] = useRoute<{ lotId: string }>('/report/:lotId');
  const lotId = params?.lotId;

  if (!lotId) {
    return <div>Error: ID de lote no válido</div>;
  }

  const lot = getLotById(lotId);

  if (!lot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lote no encontrado</h1>
          <p className="text-muted-foreground">El lote {lotId} no existe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      <ReportHeader lot={lot} />
      <ReportMetrics lot={lot} />
      <ReportTimeline lot={lot} />
      
      <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
        <p>Reporte de Trazabilidad Circular</p>
        <p className="mt-1">NEXT IMPULSE GREEN</p>
      </div>
    </div>
  );
}


