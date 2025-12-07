import { CheckCircle2, Package, TruckIcon, ArrowRight } from "lucide-react";
import { useClientData } from "@/hooks/useClientData";
import { useMemo } from "react";

interface Activity {
  id: string;
  type: "cycle_completed" | "in_transit" | "collected";
  lotId: string;
  time: string;
  from: string;
  to: string;
  client: string;
  cycle?: number;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "cycle_completed":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "in_transit":
      return <TruckIcon className="w-5 h-5 text-blue-500" />;
    case "collected":
      return <Package className="w-5 h-5 text-purple-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-500" />;
  }
};

const getActivityLabel = (type: string) => {
  switch (type) {
    case "cycle_completed":
      return "Ciclo Completado";
    case "in_transit":
      return "En Tránsito";
    case "collected":
      return "Recolectado";
    default:
      return "Actividad";
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "cycle_completed":
      return "bg-green-50 border-green-200";
    case "in_transit":
      return "bg-blue-50 border-blue-200";
    case "collected":
      return "bg-purple-50 border-purple-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export function RealtimeActivityFeed() {
  const { lots: clientLots, currentClient } = useClientData();

  // Generar actividades mock basadas en los lotes del cliente
  const activities = useMemo((): Activity[] => {
    const acts: Activity[] = [];
    
    clientLots.forEach((lot, idx) => {
      const currentCycle = lot.cycles[lot.currentCycle - 1];
      if (!currentCycle) return;
      
      // Actividad de ciclo completado si el lote ya tiene varios ciclos
      if (lot.currentCycle > 1) {
        const prevCycle = lot.cycles[lot.currentCycle - 2];
        if (prevCycle) {
          acts.push({
            id: `act-${lot.id}-completed`,
            type: "cycle_completed",
            lotId: lot.id,
            time: idx === 0 ? "Hace 2 horas" : idx === 1 ? "Hace 1 día" : "Hace 2 días",
            from: prevCycle.location.store,
            to: "Planta de Reciclaje",
            client: currentClient.name,
            cycle: prevCycle.number
          });
        }
      }
      
      // Actividad en tránsito para lotes activos
      if (lot.status === 'active' && idx < 2) {
        acts.push({
          id: `act-${lot.id}-transit`,
          type: "in_transit",
          lotId: lot.id,
          time: idx === 0 ? "Hace 5 horas" : "Hace 8 horas",
          from: currentCycle.location.store,
          to: "Centro de Distribución",
          client: currentClient.name
        });
      }
    });
    
    return acts.slice(0, 4); // Mostrar solo las últimas 4 actividades
  }, [clientLots, currentClient]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Mi Actividad Reciente</span>
          </h3>
          <span className="text-xs text-gray-400">Últimos movimientos</span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${getActivityColor(activity.type)} border-l-4`}
            >
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {getActivityLabel(activity.type)}
                      </span>
                      {activity.cycle && (
                        <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">
                          Ciclo {activity.cycle}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  
                  <div className="font-mono text-sm font-semibold text-gray-900 mb-2">
                    {activity.lotId}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">{activity.client}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{activity.from}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{activity.to}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay actividad reciente</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <button className="text-sm text-gray-600 hover:text-gray-900 font-medium w-full text-center">
          Ver todas mis actividades →
        </button>
      </div>
    </div>
  );
}
