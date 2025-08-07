import { Leaf, Calendar, Building, Trees, Wind } from 'lucide-react';
import { Link } from 'wouter';

export const ClubHeader = () => {
  return (
    <div className="bg-white border-b border-gray-100 mb-6">
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          
        </div>
        
        <div className="flex items-center space-x-2">
          <Link href="/data-entry">
            <button className="bg-navy text-white text-sm px-3 py-1.5 rounded hover:bg-opacity-90">
              + Registrar
            </button>
          </Link>
          <Link href="/reports">
            <button className="border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded hover:bg-gray-50">
              Reportes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};