import React from 'react';
import { WasteData } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Droplets, Zap, TreePine } from 'lucide-react';

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
}

export default function EnvironmentalImpact({ wasteData }: EnvironmentalImpactProps) {
  // Acumular los datos de impacto ambiental de todos los registros
  const totalTreesSaved = wasteData.reduce((sum, data) => sum + (data.treesSaved || 0), 0);
  const totalWaterSaved = wasteData.reduce((sum, data) => sum + (data.waterSaved || 0), 0);
  const totalEnergySaved = wasteData.reduce((sum, data) => sum + (data.energySaved || 0), 0);
  
  // Métricas de impacto ambiental para mostrar (solo las 3 principales)
  const impactMetrics: ImpactMetric[] = [
    {
      title: 'Árboles Salvados',
      icon: <TreePine className="h-8 w-8" />,
      value: totalTreesSaved,
      unit: 'árboles',
      description: 'Árboles que no fueron talados para fabricar papel nuevo',
      colorClass: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      title: 'Agua Ahorrada',
      icon: <Droplets className="h-8 w-8" />,
      value: totalWaterSaved,
      unit: 'litros',
      description: 'Agua que no se utilizó en la fabricación de papel nuevo',
      colorClass: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      title: 'Energía Conservada',
      icon: <Zap className="h-8 w-8" />,
      value: totalEnergySaved,
      unit: 'kW',
      description: 'Energía eléctrica ahorrada en los procesos de fabricación',
      colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  ];

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
      
      {/* Solo las 3 métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {impactMetrics.map((metric, idx) => (
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
      
      <div className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-md">
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