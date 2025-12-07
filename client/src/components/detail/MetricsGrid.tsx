import { Lot } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricsGridProps {
  lot: Lot;
}

export function MetricsGrid({ lot }: MetricsGridProps) {
  const metrics = [
    {
      label: 'Ciclos',
      value: lot.currentCycle,
      unit: `/${lot.totalCycles}`,
      color: 'text-primary'
    },
    {
      label: 'Reciclado',
      value: lot.recycledContent,
      unit: '%',
      color: 'text-green-600'
    },
    {
      label: 'CO₂ Evitado',
      value: lot.totalEmissionsAvoided.toFixed(1),
      unit: ' kg',
      color: 'text-blue-600'
    },
    {
      label: 'Plástico Reciclado',
      value: lot.totalPlasticRecycled.toFixed(1),
      unit: ' kg',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
              <span className="text-lg text-muted-foreground">{metric.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
