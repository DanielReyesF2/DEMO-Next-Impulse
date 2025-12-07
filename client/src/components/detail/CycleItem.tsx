import { useState } from 'react';
import { Cycle } from '@shared/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

interface CycleItemProps {
  cycle: Cycle;
  isActive: boolean;
}

export function CycleItem({ cycle, isActive }: CycleItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'd MMM yyyy', { locale: es });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-l-2 border-gray-200 pl-4 pb-4">
      <CollapsibleTrigger className="w-full text-left">
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Ciclo {cycle.number}</span>
              {isActive && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">ACTIVO</span>
              )}
              {cycle.returnedToOrigin && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  Regresó al origen
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {cycle.client} - {cycle.brand} / {cycle.location.store}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(cycle.startDate)}
              {cycle.endDate ? ` - ${formatDate(cycle.endDate)}` : ' - Actual'}
            </p>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-3">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div>
            <p className="text-sm font-medium">Campaña</p>
            <p className="text-sm text-muted-foreground">{cycle.campaign}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Ubicación</p>
            <p className="text-sm text-muted-foreground">
              {cycle.location.store}
              <br />
              {cycle.location.address}, {cycle.location.city}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Distancia</p>
              <p className="text-sm font-medium">{cycle.distance} km</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Emisiones Total</p>
              <p className="text-sm font-medium">{cycle.emissions.total.toFixed(1)} kg CO₂</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Transporte</p>
              <p className="text-sm font-medium">{cycle.emissions.transport.toFixed(1)} kg CO₂</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Procesamiento</p>
              <p className="text-sm font-medium">{cycle.emissions.processing.toFixed(1)} kg CO₂</p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
