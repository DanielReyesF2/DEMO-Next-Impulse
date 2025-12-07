import { useState, useEffect } from "react";
import { RefreshCw, Package, ArrowRight } from "lucide-react";
import { useClientData } from "@/hooks/useClientData";

interface FlowData {
  id: string;
  name: string;
  count: number;
  color: string;
  icon: string;
}

export function AnimatedCircularFlow() {
  const { lots: clientLots } = useClientData();
  const [activeFlow, setActiveFlow] = useState(0);
  
  // Calcular flujos del cliente
  const flows: FlowData[] = [
    {
      id: "graficos-exhibidores",
      name: "Gráficos → Exhibidores",
      count: clientLots.filter(l => l.flowType === "graficos-exhibidores").length,
      color: "#8B5CF6",
      icon: "🎨→📦"
    },
    {
      id: "exhibidores-exhibidores",
      name: "Exhibidores → Exhibidores",
      count: clientLots.filter(l => l.flowType === "exhibidores-exhibidores").length,
      color: "#3B82F6",
      icon: "📦→📦"
    },
    {
      id: "graficos-graficos",
      name: "Gráficos → Gráficos",
      count: clientLots.filter(l => l.flowType === "graficos-graficos").length,
      color: "#6366F1",
      icon: "🎨→🎨"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlow((prev) => (prev + 1) % flows.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [flows.length]);
  
  const totalLots = clientLots.length;
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl animate-pulse">
            <RefreshCw className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3">
            Tus Flujos Circulares Activos
          </h2>
          <p className="text-gray-400 text-lg">
            {totalLots} lotes de materiales circulando en el sistema
          </p>
        </div>
        
        {/* Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {flows.map((flow, index) => (
            <div
              key={flow.id}
              className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 ${
                activeFlow === index 
                  ? 'border-green-400 shadow-2xl shadow-green-500/30 scale-105' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{
                transform: activeFlow === index ? 'translateY(-8px)' : 'translateY(0)'
              }}
            >
              {/* Active indicator */}
              {activeFlow === index && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
              )}
              
              <div className="text-center">
                <div className="text-4xl mb-4">{flow.icon}</div>
                <div className="text-3xl font-black text-white mb-2">
                  {flow.count}
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  {flow.name}
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  lotes en circulación
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cycle Animation Visual */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <Package className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-gray-300">Origen</div>
            </div>
            
            <div className="flex-1 relative">
              <div className="border-t-2 border-dashed border-green-400 relative">
                <div 
                  className="absolute top-0 left-0 w-4 h-4 bg-green-400 rounded-full -mt-2 animate-ping"
                  style={{
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-400 mx-auto mb-2 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="text-sm text-gray-300">Ciclos</div>
              <div className="text-2xl font-bold text-white">Múltiples</div>
            </div>
            
            <div className="flex-1 relative">
              <div className="border-t-2 border-dashed border-blue-400"></div>
            </div>
            
            <div className="text-center">
              <ArrowRight className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <div className="text-sm text-gray-300">Reciclaje</div>
            </div>
          </div>
        </div>
        
        {/* Navigation Dots */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          {flows.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFlow(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeFlow === index 
                  ? 'bg-green-500 w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
