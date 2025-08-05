import React from 'react';
import { Shield, ClipboardCheck, AlertTriangle, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateAndDownloadTrueCertificationReport } from '@/lib/trueCertificationReport';

interface TrueCertificationProps {
  currentDeviation: number;
}

export const TrueCertification: React.FC<TrueCertificationProps> = ({ currentDeviation }) => {
  // Objetivo para certificación TRUE Zero Waste
  const targetDeviation = 90;
  
  // Calcular el porcentaje de progreso hacia la meta
  const progressPercentage = Math.min(100, (currentDeviation / targetDeviation) * 100);
  
  // Determinar si estamos en nivel crítico, alertante o bueno
  const getStatusColor = () => {
    if (currentDeviation < 50) return 'bg-red-500';
    if (currentDeviation < 75) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  // Acciones pendientes para alcanzar la certificación
  const pendingActions = [
    {
      id: 1,
      title: 'Priorización Directiva',
      description: 'Lograr que la alta dirección priorice el programa de gestión de residuos.',
      status: 'pending', // pending, in-progress, completed
    },
    {
      id: 2,
      title: 'Compostaje en Sitio',
      description: 'Implementar compostero para el 100% de los residuos de poda y comedor.',
      status: 'in-progress',
    },
    {
      id: 3,
      title: 'Proveedor Privado',
      description: 'Invertir en un proveedor privado en lugar del municipal para asegurar destino final y trazabilidad.',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Brigada de Gestión',
      description: 'Conformar una brigada de mínimo 3 personas dedicadas a la gestión interna de residuos.',
      status: 'pending',
    },
  ];
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-navy" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">TRUE Zero Waste</h2>
              <p className="text-sm text-gray-500">Certificación GBCI</p>
            </div>
          </div>
          
          <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg font-medium">
            En proceso
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress section - simplified */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Progreso hacia 90%</span>
              <span className="text-lg font-semibold text-gray-900">{currentDeviation.toFixed(1)}%</span>
            </div>
            
            <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
              <div 
                className={`h-2 rounded-full transition-all ${getStatusColor()}`} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span className="font-medium">Meta: 90%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Download button */}
          <div className="flex items-center justify-end">
            <Button 
              onClick={() => generateAndDownloadTrueCertificationReport('Club Campestre CDMX', currentDeviation, pendingActions)}
              className="bg-navy hover:bg-navy/90 text-white px-4 py-2 text-sm"
              size="sm"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Descargar reporte TRUE
            </Button>
          </div>
        </div>
        
        {/* Actions list - minimalist */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Acciones prioritarias</h3>
          <div className="space-y-2">
            {pendingActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    action.status === 'completed' ? 'bg-green-500' :
                    action.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </div>
                {action.status === 'completed' && (
                  <ClipboardCheck className="h-4 w-4 text-green-500" />
                )}
                {action.status === 'pending' && (
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};