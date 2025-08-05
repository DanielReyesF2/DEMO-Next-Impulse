import { Leaf, Calendar, Building, Trees, Wind } from 'lucide-react';
import { Link } from 'wouter';
import cccmLogo from '@assets/CCCM_1754423231662.png';

export const ClubHeader = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl mb-8 overflow-hidden shadow-sm">
      {/* Header principal minimalista */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center space-x-4">
          <img 
            src={cccmLogo} 
            alt="Club Campestre Ciudad de México" 
            className="h-12 w-12 rounded-lg"
          />
          <div>
            <h1 className="font-anton text-xl text-navy tracking-wide">
              Club Campestre CDMX
            </h1>
            <p className="text-sm text-gray-500">
              Centro de Gestión Ambiental
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link href="/data-entry">
            <button className="bg-navy text-white text-sm px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              Registrar datos
            </button>
          </Link>
          <button className="border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Ver informes
          </button>
        </div>
      </div>
      
      {/* Indicadores compactos */}
      <div className="px-6 py-4 bg-gray-50/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-lime rounded-full"></div>
            <span className="text-sm text-gray-600">Activo desde Ene 2024</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">5 Instalaciones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">498 Árboles salvados</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-navy rounded-full"></div>
            <span className="text-sm text-gray-600">TRUE Certification</span>
          </div>
        </div>
      </div>
    </div>
  );
};