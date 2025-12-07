import { Lot } from '@shared/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { RotateCcw } from 'lucide-react';

interface ReportTimelineProps {
  lot: Lot;
}

export function ReportTimeline({ lot }: ReportTimelineProps) {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'd MMM yyyy', { locale: es });
  };

  // Ordenar ciclos del más reciente al más antiguo
  const sortedCycles = [...lot.cycles].sort((a, b) => b.number - a.number);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Historial de Ciclos</h2>
      <div className="space-y-4">
        {sortedCycles.map((cycle) => (
          <div key={cycle.number} className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Ciclo {cycle.number}</span>
              {cycle.returnedToOrigin && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  Regresó al origen
                </span>
              )}
            </div>
            <p className="text-sm font-medium mb-1">
              {cycle.client} - {cycle.brand}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {cycle.campaign}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {cycle.location.store}, {cycle.location.city}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {formatDate(cycle.startDate)}
              {cycle.endDate ? ` - ${formatDate(cycle.endDate)}` : ' - Actual'}
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t">
              <div>
                <p className="text-muted-foreground">Distancia</p>
                <p className="font-medium">{cycle.distance} km</p>
              </div>
              <div>
                <p className="text-muted-foreground">Emisiones</p>
                <p className="font-medium">{cycle.emissions.total.toFixed(1)} kg CO₂</p>
              </div>
              <div>
                <p className="text-muted-foreground">Peso</p>
                <p className="font-medium">{lot.weight} kg</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
