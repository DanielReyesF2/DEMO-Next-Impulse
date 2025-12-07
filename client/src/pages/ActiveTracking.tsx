import AppLayout from '@/components/layout/AppLayout';
import { useClientData } from '@/hooks/useClientData';
import { MapPin, Navigation, Package, Clock, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function ActiveTracking() {
  const { lots: clientLots, currentClient } = useClientData();
  const activeLots = clientLots.filter(lot => lot.status === 'active');
  
  // Get current cycle for each active lot
  const activeLotsWithLocation = activeLots.map(lot => {
    const currentCycleData = lot.cycles[lot.currentCycle - 1];
    return {
      ...lot,
      currentLocation: currentCycleData?.location,
      currentClient: currentCycleData?.client,
      currentBrand: currentCycleData?.brand
    };
  });

  const totalEmissions = activeLots.reduce((sum, lot) => sum + lot.totalEmissionsAvoided, 0);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Mi Tracking Activo
            </h1>
            <p className="text-gray-600 text-lg">
              Seguimiento en tiempo real de {activeLots.length} lotes de {currentClient.name} circulando
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-3xl font-black mb-1">{activeLots.length}</div>
              <div className="text-sm text-green-100">Lotes en Movimiento</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="text-3xl font-black text-blue-600 mb-1">
                {activeLots.reduce((sum, lot) => sum + lot.currentCycle, 0)}
              </div>
              <div className="text-sm text-gray-600">Ciclos en Curso</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="text-3xl font-black text-purple-600 mb-1">{currentClient.name}</div>
              <div className="text-sm text-gray-600">Cliente Activo</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="text-3xl font-black text-orange-600 mb-1">
                {totalEmissions.toFixed(0)} kg
              </div>
              <div className="text-sm text-gray-600">CO₂ Evitado Total</div>
            </div>
          </div>

          {/* Map Placeholder and Tracking List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span>Mis Ubicaciones Activas</span>
                  </h3>
                </div>
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 h-[600px] flex items-center justify-center">
                  {/* Map placeholder */}
                  <div className="text-center p-8">
                    <MapPin className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-500 text-lg font-medium mb-2">
                      Mapa Interactivo
                    </div>
                    <div className="text-gray-400 text-sm">
                      Visualización de mis ubicaciones en tiempo real
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                        <div className="text-xs text-gray-600">Activos</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                        <div className="text-xs text-gray-600">En Tránsito</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                        <div className="text-xs text-gray-600">Recolección</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Lots List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Navigation className="w-5 h-5 text-blue-400" />
                    <span>Mis Lotes Activos</span>
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                  <div className="divide-y divide-gray-100">
                    {activeLotsWithLocation.map((lot) => (
                      <div 
                        key={lot.id}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-mono text-sm font-bold text-blue-600">
                            {lot.id}
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            Ciclo {lot.currentCycle}/{lot.totalCycles}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Package className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600 truncate">{lot.productType}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            <span className="text-gray-900 font-medium truncate">
                              {lot.currentLocation?.store}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="font-medium">{currentClient.name}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="truncate">{lot.currentLocation?.city}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>Actualizado hace 2 horas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
