import { Lot } from '@shared/types';

interface ReportMetricsProps {
  lot: Lot;
}

export function ReportMetrics({ lot }: ReportMetricsProps) {
  const metrics = [
    {
      label: 'Ciclos',
      value: `${lot.currentCycle}/${lot.totalCycles}`,
      color: 'bg-primary/10 text-primary'
    },
    {
      label: 'Reciclado',
      value: `${lot.recycledContent}%`,
      color: 'bg-green-100 text-green-700'
    },
    {
      label: 'CO₂ Evitado',
      value: `${lot.totalEmissionsAvoided.toFixed(1)} kg`,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      label: 'Plástico Reciclado',
      value: `${lot.totalPlasticRecycled.toFixed(1)} kg`,
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`p-4 rounded-lg ${metric.color}`}
        >
          <p className="text-xs font-medium mb-1">{metric.label}</p>
          <p className="text-xl font-bold">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}

