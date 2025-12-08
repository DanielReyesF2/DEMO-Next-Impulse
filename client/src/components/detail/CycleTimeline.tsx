import { Lot } from '@shared/types';
import { CycleItem } from './CycleItem';

interface CycleTimelineProps {
  lot: Lot;
}

export function CycleTimeline({ lot }: CycleTimelineProps) {
  // Ordenar ciclos del más reciente al más antiguo
  const sortedCycles = [...lot.cycles].sort((a, b) => b.number - a.number);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">Historial de Ciclos</h2>
      <div className="space-y-0">
        {sortedCycles.map((cycle) => (
          <CycleItem
            key={cycle.number}
            cycle={cycle}
            isActive={cycle.endDate === null}
          />
        ))}
      </div>
    </div>
  );
}

