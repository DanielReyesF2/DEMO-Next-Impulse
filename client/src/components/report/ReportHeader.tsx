import { Lot } from '@shared/types';
import { flowTypes } from '@/data/mockLots';
import { Badge } from '@/components/ui/badge';

interface ReportHeaderProps {
  lot: Lot;
}

export function ReportHeader({ lot }: ReportHeaderProps) {
  const flowTypeInfo = flowTypes.find(ft => ft.id === lot.flowType);
  
  return (
    <div className="bg-white border-b pb-4 mb-4">
      <h1 className="text-2xl font-bold mb-2">{lot.id}</h1>
      <Badge variant="outline" className="text-xs">
        {flowTypeInfo?.name}
      </Badge>
      <p className="text-sm text-muted-foreground mt-2">{lot.productType}</p>
    </div>
  );
}

