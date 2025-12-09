import { flowTypes } from '@/data/mockLots';
import { FlowTypeCard } from './FlowTypeCard';

export function FlowTypeSelector() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {flowTypes.map((flowType) => (
        <FlowTypeCard key={flowType.id} flowType={flowType} />
      ))}
    </div>
  );
}


