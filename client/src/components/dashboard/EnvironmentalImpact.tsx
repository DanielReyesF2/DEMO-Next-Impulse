import React from 'react';
import { WasteData } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Droplets, Zap, TreePine, GlassWater, PiggyBank, Recycle } from 'lucide-react';

interface EnvironmentalImpactProps {
  wasteData: WasteData[];
}

interface ImpactMetric {
  title: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  description: string;
  colorClass: string;
  importance: number; // 1-3, donde 3 es lo más importante
}

export default function EnvironmentalImpact({ wasteData }: EnvironmentalImpactProps) {
  // Acumular los datos de impacto ambiental de todos los registros
  const totalTreesSaved = wasteData.reduce((sum, data) => sum + (data.treesSaved || 0), 0);
  const totalWaterSaved = wasteData.reduce((sum, data) => sum + (data.waterSaved || 0), 0);
  const totalEnergySaved = wasteData.reduce((sum, data) => sum + (data.energySaved || 0), 0);
  const totalFuelSaved = wasteData.reduce((sum, data) => sum + (data.fuelSaved || 0), 0);
  const totalWasteDiverted = wasteData.reduce((sum, data) => sum + (data.wasteDiverted || 0), 0);
  const totalRedMudAvoided = wasteData.reduce((sum, data) => sum + (data.redMudAvoided || 0), 0);
  
  // Métricas de impacto ambiental para mostrar
  const impactMetrics: ImpactMetric[] = [
    {
      title: 'Árboles Salvados',
      icon: <TreePine className="h-8 w-8" />,
      value: totalTreesSaved,
      unit: 'árboles',
      description: 'Árboles que no fueron talados para fabricar papel nuevo',
      colorClass: 'bg-green-100 text-green-800 border-green-300',
      importance: 3
    },
    {
      title: 'Agua Ahorrada',
      icon: <Droplets className="h-8 w-8" />,
      value: totalWaterSaved,
      unit: 'litros',
      description: 'Agua que no se utilizó en la fabricación de papel nuevo',
      colorClass: 'bg-blue-100 text-blue-800 border-blue-300',
      importance: 3
    },
    {
      title: 'Energía Conservada',
      icon: <Zap className="h-8 w-8" />,
      value: totalEnergySaved,
      unit: 'kW',
      description: 'Energía eléctrica ahorrada en los procesos de fabricación',
      colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      importance: 3
    },
    {
      title: 'Combustible Ahorrado',
      icon: <PiggyBank className="h-7 w-7" />,
      value: totalFuelSaved,
      unit: 'litros',
      description: 'Litros de combustible que no fueron utilizados',
      colorClass: 'bg-orange-100 text-orange-800 border-orange-300',
      importance: 2
    },
    {
      title: 'Basura Desviada',
      icon: <Recycle className="h-7 w-7" />,
      value: Number(totalWasteDiverted.toFixed(2)),
      unit: 'm³',
      description: 'Metros cúbicos de basura que no terminaron en rellenos sanitarios',
      colorClass: 'bg-lime-100 text-lime-800 border-lime-300',
      importance: 2
    },
    {
      title: 'Contaminantes Evitados',
      icon: <GlassWater className="h-7 w-7" />,
      value: totalRedMudAvoided,
      unit: 'kg',
      description: 'Kg de fango rojo contaminante que no se produjeron',
      colorClass: 'bg-red-100 text-red-800 border-red-300',
      importance: 1
    }
  ];

  // Filtrar métricas por su importancia
  const primaryMetrics = impactMetrics.filter(m => m.importance === 3);
  const secondaryMetrics = impactMetrics.filter(m => m.importance === 2);
  const tertiaryMetrics = impactMetrics.filter(m => m.importance === 1);

  // Si no hay datos, mostrar mensaje
  if (wasteData.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-anton">Impacto Ambiental</CardTitle>
          <CardDescription>Sin datos disponibles</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center bg-gradient-to-r from-green-600 to-lime p-3 rounded-lg text-white shadow-md">
        <Leaf className="h-8 w-8 mr-3" />
        <h2 className="text-3xl font-anton">IMPACTO AMBIENTAL</h2>
        <div className="ml-auto px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
          Certificado Econova
        </div>
      </div>
      
      {/* Métricas principales - Fila destacada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {primaryMetrics.map((metric, idx) => (
          <Card 
            key={idx} 
            className={`overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${metric.colorClass}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-anton">{metric.title}</CardTitle>
                <div className="p-2 rounded-full bg-white/90 shadow-sm">
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-end">
                  <span className="text-4xl font-bold">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-sm ml-1 mb-1">{metric.unit}</span>
                </div>
                <Progress 
                  value={100} 
                  className="h-3 bg-white/50" 
                />
                <p className="text-sm mt-2">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Métricas secundarias - Fila con menos énfasis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secondaryMetrics.map((metric, idx) => (
          <Card 
            key={idx} 
            className={`overflow-hidden border transition-all duration-300 hover:shadow-lg ${metric.colorClass}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-white/90 shadow-sm mr-3">
                  {metric.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{metric.title}</h3>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">
                      {metric.value.toLocaleString()}
                    </span>
                    <span className="text-xs ml-1 opacity-75">{metric.unit}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-75">{metric.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Métricas terciarias - Fila con menos énfasis aún */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {tertiaryMetrics.map((metric, idx) => (
          <Card 
            key={idx} 
            className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${metric.colorClass}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-white/90 shadow-sm mr-3">
                  {metric.icon}
                </div>
                <div>
                  <h3 className="font-bold">{metric.title}</h3>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">
                      {metric.value.toLocaleString()}
                    </span>
                    <span className="text-xs ml-1 opacity-75">{metric.unit}</span>
                  </div>
                </div>
                <p className="text-xs ml-4 opacity-75">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
        <p className="text-base text-green-700">
          <span className="font-bold">¿Sabías que?</span> El reciclaje de 1 tonelada de papel salva aproximadamente 17 árboles y ahorra 26,000 litros de agua.
        </p>
        <p className="text-sm text-green-600 mt-2 italic">
          Estos beneficios ambientales reflejan el impacto positivo tangible de las actividades de reciclaje 
          y manejo responsable de residuos en Club Campestre.
        </p>
      </div>
    </div>
  );
}