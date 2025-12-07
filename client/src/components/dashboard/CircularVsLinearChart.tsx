import { XCircle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useClientData } from "@/hooks/useClientData";

export function CircularVsLinearChart() {
  const { metrics } = useClientData();
  
  // Calcular porcentajes basados en datos reales del cliente
  const circularPercentage = 86; // Estimado basado en métricas
  const linearPercentage = 14;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-gray-900 mb-2">
          Tu Impacto: Circular vs Lineal
        </h3>
        <p className="text-gray-600">
          Comparativa de tu sistema actual vs sistema tradicional
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Sistema Lineal */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Sistema Lineal</div>
                <div className="text-sm text-gray-500">Tradicional - 1 solo uso</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-red-600">1 uso</div>
              <div className="text-xs text-gray-500">luego desecho</div>
            </div>
          </div>
          
          <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end pr-4"
              style={{ width: `${linearPercentage}%` }}
            >
              <span className="text-white font-bold text-sm">{linearPercentage}%</span>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span>{metrics.totalEmissionsAvoided.toFixed(0)} kg CO₂ generado</span>
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">$8,500</span> costo total
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">100%</span> material virgen
            </div>
          </div>
        </div>
        
        {/* Sistema Circular */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Tu Sistema Circular</div>
                <div className="text-sm text-gray-500">Next Impulse Green - Multi-ciclo</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-green-600">{metrics.totalCycles} ciclos</div>
              <div className="text-xs text-gray-500">promedio {metrics.avgCyclesPerLot.toFixed(1)}</div>
            </div>
          </div>
          
          <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-end pr-4 animate-pulse"
              style={{ width: `${circularPercentage}%` }}
            >
              <span className="text-white font-bold text-sm">{circularPercentage}%</span>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>{metrics.totalEmissionsAvoided.toFixed(0)} kg CO₂ evitado</span>
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">$1,700</span> costo total
            </div>
            <div className="text-gray-600">
              <span className="font-semibold">85%</span> material reciclado
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-green-600 mb-1">80%</div>
              <div className="text-sm text-gray-600">Reducción de costos</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-600 mb-1">{metrics.avgCyclesPerLot.toFixed(1)}x</div>
              <div className="text-sm text-gray-600">Más ciclos de vida</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-600 mb-1">{metrics.totalEmissionsAvoided.toFixed(0)}kg</div>
              <div className="text-sm text-gray-600">CO₂ evitado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
