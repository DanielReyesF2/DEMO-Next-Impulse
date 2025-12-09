import { Lot } from '@shared/types';
import { LotCard } from './LotCard';

interface LotListProps {
  lots: Lot[];
}

export function LotList({ lots }: LotListProps) {
  if (lots.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay lotes disponibles en esta categoría
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lots.map((lot) => (
        <LotCard key={lot.id} lot={lot} />
      ))}
    </div>
  );
}


