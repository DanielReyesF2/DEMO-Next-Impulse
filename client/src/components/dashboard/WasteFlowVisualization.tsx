import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowDown,
  Recycle, 
  Leaf, 
  Trash2, 
  Factory,
  TreePine,
  Droplets,
  Zap,
  Package,
  Coffee,
  Utensils,
  Newspaper,
  Wine,
  Battery,
  Building2,
  ChefHat,
  Users,
  MapPin,
  MoveRight
} from 'lucide-react';

interface WasteFlow {
  id: string;
  name: string;
  category: 'organico' | 'inorganico' | 'reciclable';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  destination: string;
  partner: string;
  volume: number; // toneladas mensuales promedio
  description: string;
  origins: string[]; // puntos de origen específicos
}

const wasteFlows: WasteFlow[] = [
  // ORGÁNICOS - Basado en la imagen detallada del Club
  {
    id: 'aceite-residual',
    name: 'Aceite Residual',
    category: 'organico',
    icon: <Droplets className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    destination: 'Revalorización (Insumo para biodiesel)',
    partner: 'Reoil',
    volume: 0.8,
    description: 'Aceite usado de cocinas convertido a biodiesel sostenible',
    origins: ['Acuarima, Restaurante Jose', 'Casa Club', 'Cocinas de eventos', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'grasa-cascaras',
    name: 'Grasa y Cáscaras de Fruta',
    category: 'organico',
    icon: <Utensils className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    destination: 'Recolección y disposición de grasa cocinas',
    partner: 'TEDISD Innovative Group',
    volume: 3.2,
    description: 'Grasas de cocina y cáscaras de frutas procesadas sustainably',
    origins: ['Acuarima, Restaurante Jose', 'Cocina Casa Club', 'Área de preparación', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'organicos-complejos',
    name: 'Orgánicos Diversos',
    category: 'organico',
    icon: <TreePine className="w-5 h-5" />,
    color: 'text-green-700',
    bgColor: 'bg-green-200',
    destination: 'Biodegradación mediante biodigestor ORKA',
    partner: 'ORKA',
    volume: 17.6,
    description: 'Pan, pescados, carne, huevo, queso, pollo, pasta, arroz, frutas, azúcar, salsas, papa, caña, conchas, aceites, café',
    origins: ['Acuarima, Restaurante Jose', 'Casa Club', 'Eventos especiales', 'Cocinas auxiliares', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },

  // RECICLABLES - Clasificación profesional detallada
  {
    id: 'papel-carton-periodico',
    name: 'Papel y Cartón',
    category: 'reciclable',
    icon: <Newspaper className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    destination: 'Revalorización Reciclado Refabricación',
    partner: 'Recupera (Centros de Reciclaje)',
    volume: 2.1,
    description: 'Papel, periódico, revistas, cartón - proceso completo de refabricación',
    origins: ['Oficinas administrativas', 'Casa Club', 'Recepción', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'vidrio-sat-timbrado',
    name: 'Vidrio (Timbrado SAT)',
    category: 'reciclable',
    icon: <Wine className="w-5 h-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-200',
    destination: 'Revalorización Proceso Refabricación',
    partner: 'Cerrando el Ciclo',
    volume: 1.2,
    description: 'Vidrio certificado SAT para proceso de refabricación industrial',
    origins: ['Bar y Acuarima, Restaurante Jose', 'Eventos especiales', 'Áreas VIP', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'plasticos-polipropileno',
    name: 'Plásticos PET/HDPE',
    category: 'reciclable',
    icon: <Package className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    destination: 'Donación para revalorización',
    partner: 'Verde Ciudad',
    volume: 1.9,
    description: 'Vidrio PET HDPE, plástico duro, aluminio, tapas de polipropileno',
    origins: ['Casa Club', 'Acuarima, Restaurante Jose', 'Áreas comunes', 'Eventos', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },

  // INORGÁNICOS - Sistema completo de manejo
  {
    id: 'residuos-electronicos-complejos',
    name: 'Residuos Electrónicos',
    category: 'inorganico',
    icon: <Battery className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    destination: 'Recuperación Revalorización Reciclaje',
    partner: 'eWaste Group',
    volume: 0.3,
    description: 'Blancos, losa, objetos perdidos, mobiliario, equipos electrónicos',
    origins: ['Oficinas administrativas', 'Sistemas Casa Club', 'Mantenimiento', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'cartuchos-nikken-especializados',
    name: 'Cartuchos Nikken',
    category: 'inorganico',
    icon: <Factory className="w-5 h-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    destination: 'Donación para revalorización',
    partner: 'NIKKEN',
    volume: 0.1,
    description: 'Cartuchos de tinta y tóner para remanufactura especializada',
    origins: ['Oficinas', 'Centros de impresión', 'Administración', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'residuos-generales-controlados',
    name: 'Residuos Generales',
    category: 'inorganico',
    icon: <Trash2 className="w-5 h-5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    destination: 'Donaciones o Defensa SGA',
    partner: 'Amistad Cristiano / KREY',
    volume: 5.8,
    description: 'Reprocesamiento y Compostaje cuando es iniciado - disposición controlada',
    origins: ['Casa Club general', 'Mantenimiento', 'Áreas comunes', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  }
];

interface WasteFlowVisualizationProps {
  totalWasteDiverted: number;
}

export function WasteFlowVisualization({ totalWasteDiverted }: WasteFlowVisualizationProps) {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [animatingParticles, setAnimatingParticles] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingParticles(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const organicFlows = wasteFlows.filter(flow => flow.category === 'organico');
  const recyclableFlows = wasteFlows.filter(flow => flow.category === 'reciclable');
  const inorganicFlows = wasteFlows.filter(flow => flow.category === 'inorganico');

  const totalVolume = wasteFlows.reduce((sum, flow) => sum + flow.volume, 0);
  const diversionRate = ((totalVolume - inorganicFlows.reduce((sum, flow) => sum + flow.volume, 0)) / totalVolume * 100);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-xl border border-gray-200">
      {/* Header Simplificado */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-anton uppercase tracking-wide mb-3 text-[#b5e951]">Flujos de Materiales</h2>
        <p className="text-lg text-gray-600">
          Visualización interactiva del sistema integral de gestión de residuos
        </p>
      </div>

      {/* Flujo Visual Simplificado */}
      <div className="relative max-w-4xl mx-auto">
        
        {/* Puntos de Origen - Diseño más limpio */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Puntos de Origen</span>
        </div>

        <div className="flex justify-center items-center space-x-4 mb-10">
          <div className="group text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-700">Casa Club</div>
          </div>

          <div className="group text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-700">Acuarima</div>
            <div className="text-xs text-gray-500">Restaurante Jose</div>
          </div>

          <div className="group text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-700">Eventos</div>
          </div>

          <div className="group text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <TreePine className="w-7 h-7 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-700">Campo</div>
          </div>

          <div className="group text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-700">Canchas Tennis</div>
          </div>

          <div className="group text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-700">Canchas Padel</div>
          </div>
        </div>

        {/* Líneas de Flujo Animadas */}
        <div className="relative flex justify-center mb-8">
          <div className="flex flex-col items-center space-y-2">
            {/* Partículas animadas */}
            <div className={`flex items-center space-x-3 transition-all duration-1000 ${
              animatingParticles ? 'opacity-100' : 'opacity-60'
            }`}>
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Flecha central elegante */}
            <div className={`transition-all duration-700 ${
              animatingParticles ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-70'
            }`}>
              <ArrowDown className="w-8 h-8 text-[#b5e951] animate-bounce" />
            </div>
          </div>
        </div>

        {/* Categorías de Destino - Diseño más impactante */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="group text-center bg-white rounded-3xl p-8 shadow-xl border-2 border-green-200 hover:border-green-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <div className="text-2xl font-black text-green-700 mb-2">{organicFlows.reduce((sum, flow) => sum + flow.volume, 0).toFixed(1)}%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">ORGÁNICOS</div>
            <div className="text-sm text-gray-600">TRUE Zero Waste</div>
          </div>

          <div className="group text-center bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-700 rounded-3xl flex items-center justify-center shadow-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Recycle className="w-10 h-10 text-white" />
            </div>
            <div className="text-2xl font-black text-blue-700 mb-2">{recyclableFlows.reduce((sum, flow) => sum + flow.volume, 0).toFixed(1)}%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">RECICLABLES</div>
            <div className="text-sm text-gray-600">Economía Circular</div>
          </div>

          <div className="group text-center bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-500 via-gray-600 to-slate-700 rounded-3xl flex items-center justify-center shadow-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Trash2 className="w-10 h-10 text-white" />
            </div>
            <div className="text-2xl font-black text-gray-700 mb-2">{inorganicFlows.reduce((sum, flow) => sum + flow.volume, 0).toFixed(1)}%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">INORGÁNICOS</div>
            <div className="text-sm text-gray-600">Disposición Controlada</div>
          </div>
        </div>
        
      </div>
      {/* Detalles de Flujos - Minimalista */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Orgánicos */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Orgánicos</span>
          </div>
          {organicFlows.slice(0, 3).map((flow, index) => (
            <div
              key={flow.id}
              className="group cursor-pointer bg-white rounded-2xl p-4 shadow-md hover:shadow-xl border border-green-100 hover:border-green-200 transition-all duration-300"
              onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${flow.bgColor} rounded-xl flex items-center justify-center`}>
                    <span className={flow.color}>{flow.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{flow.name}</div>
                    <div className="text-xs text-green-600 font-medium">{flow.volume} ton/mes</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {selectedFlow === flow.id && (
                <div className="pt-3 border-t border-green-100">
                  <div className="text-xs text-gray-600 mb-2">{flow.description}</div>
                  <div className="text-xs text-green-600 font-medium">{flow.partner}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reciclables */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">Reciclables</span>
          </div>
          {recyclableFlows.slice(0, 3).map((flow, index) => (
            <div
              key={flow.id}
              className="group cursor-pointer bg-white rounded-2xl p-4 shadow-md hover:shadow-xl border border-blue-100 hover:border-blue-200 transition-all duration-300"
              onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${flow.bgColor} rounded-xl flex items-center justify-center`}>
                    <span className={flow.color}>{flow.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{flow.name}</div>
                    <div className="text-xs text-blue-600 font-medium">{flow.volume} ton/mes</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {selectedFlow === flow.id && (
                <div className="pt-3 border-t border-blue-100">
                  <div className="text-xs text-gray-600 mb-2">{flow.description}</div>
                  <div className="text-xs text-blue-600 font-medium">{flow.partner}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Inorgánicos */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Inorgánicos</span>
          </div>
          {inorganicFlows.slice(0, 3).map((flow, index) => (
            <div
              key={flow.id}
              className="group cursor-pointer bg-white rounded-2xl p-4 shadow-md hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${flow.bgColor} rounded-xl flex items-center justify-center`}>
                    <span className={flow.color}>{flow.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{flow.name}</div>
                    <div className="text-xs text-gray-600 font-medium">{flow.volume} ton/mes</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {selectedFlow === flow.id && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-600 mb-2">{flow.description}</div>
                  <div className="text-xs text-gray-600 font-medium">{flow.partner}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}