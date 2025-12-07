import { Lot } from '@shared/types';
import { flowTypes } from '@/data/mockLots';
import { Badge } from '@/components/ui/badge';

interface LotHeaderProps {
  lot: Lot;
}

export function LotHeader({ lot }: LotHeaderProps) {
  const flowTypeInfo = flowTypes.find(ft => ft.id === lot.flowType);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{lot.id}</h1>
        <Badge variant="outline" className="text-sm">
          {flowTypeInfo?.name}
        </Badge>
      </div>
      <p className="text-muted-foreground">{lot.productType}</p>
    </div>
  );
}
