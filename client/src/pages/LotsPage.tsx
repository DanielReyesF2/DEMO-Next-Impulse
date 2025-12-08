import { useRoute } from 'wouter';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { LotList } from '@/components/lots/LotList';
import { flowTypes } from '@/data/mockLots';
import { useClientData } from '@/hooks/useClientData';
import type { FlowType } from '@shared/types';

export default function LotsPage() {
  const [, params] = useRoute<{ flowType: FlowType }>('/lots/:flowType');
  const flowType = params?.flowType;
  const { lots: clientLots, currentClient } = useClientData();

  if (!flowType) {
    return <div>Error: Tipo de flujo no válido</div>;
  }

  // Filtrar lotes del cliente por tipo de flujo
  const lots = clientLots.filter(lot => lot.flowType === flowType);
  const flowTypeInfo = flowTypes.find(ft => ft.id === flowType);

  return (
    <AppLayout>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </Link>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{flowTypeInfo?.name}</h1>
            <p className="text-muted-foreground mt-1">{flowTypeInfo?.description}</p>
              <p className="text-sm text-gray-500 mt-2">Lotes de {currentClient.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{lots.length}</p>
              <p className="text-sm text-muted-foreground">mis lotes</p>
          </div>
        </div>

        <LotList lots={lots} />
      </div>
    </div>
    </AppLayout>
  );
}
