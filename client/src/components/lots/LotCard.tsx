import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CycleIndicator } from './CycleIndicator';
import { Lot } from '@shared/types';

interface LotCardProps {
  lot: Lot;
}

export function LotCard({ lot }: LotCardProps) {
  const activeCycle = lot.cycles.find(c => c.endDate === null);
  
  return (
    <Link href={`/lot/${lot.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary">
        <CardHeader>
          <CardTitle className="text-lg">{lot.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium">{activeCycle?.client} - {activeCycle?.brand}</p>
            <p className="text-sm text-muted-foreground">{activeCycle?.location.store}</p>
          </div>
          <CycleIndicator current={lot.currentCycle} total={lot.totalCycles} />
          <div className="flex items-center gap-4 text-sm">
            <span className="text-primary font-semibold">
              -{lot.totalEmissionsAvoided.toFixed(1)} kg CO₂
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
