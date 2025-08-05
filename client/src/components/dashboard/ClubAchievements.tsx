import React from 'react';
import { Award, Droplets, Leaf, Recycle, Shell } from 'lucide-react';

const achievements = [
  {
    icon: <Recycle className="h-6 w-6" />,
    name: "Economía Circular",
    description: "Implementación de principios de economía circular para maximizar el aprovechamiento de recursos",
    progress: 85,
    color: "bg-blue-500"
  },
  {
    icon: <Shell className="h-6 w-6" />,
    name: "Carbono Neutral",
    description: "Programa de reducción de emisiones de carbono",
    progress: 65,
    color: "bg-teal-500"
  },
  {
    icon: <Leaf className="h-6 w-6" />,
    name: "Ecología Regenerativa",
    description: "Prácticas que contribuyen positivamente al medio ambiente",
    progress: 50,
    color: "bg-amber-500"
  },
  {
    icon: <Droplets className="h-6 w-6" />,
    name: "Ahorro Hídrico",
    description: "Iniciativas para reducir el consumo de agua en las instalaciones",
    progress: 75,
    color: "bg-cyan-500"
  }
];

export const ClubAchievements = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Logros de Sostenibilidad</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                {achievement.icon}
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">{achievement.name}</h3>
              <div className="w-full h-1 bg-gray-100 rounded-full mb-1">
                <div 
                  className={`h-1 rounded-full ${achievement.color}`}
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{achievement.progress}%</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <span className="text-sm text-gray-600">
            ISO 14001 en proceso · Estimado Dic 2025
          </span>
        </div>
      </div>
    </div>
  );
};