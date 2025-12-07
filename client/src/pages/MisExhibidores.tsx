import { useState } from 'react';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { egoExhibitors, CURRENT_CLIENT, exhibitorModels, calculateExhibitorStats } from '@/data/mockExhibitors';
import { MapPin, Calendar, Palette, RefreshCw, ChevronRight, Search, Leaf, Scale, TrendingUp } from 'lucide-react';

export default function MisExhibidores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModel, setFilterModel] = useState('all');
  const [sortBy, setSortBy] = useState<'cycles' | 'age' | 'emissions'>('cycles');

  const exhibitors = egoExhibitors.filter(e => e.clientOwner === CURRENT_CLIENT.company);

  // Calcular totales
  const totalCycles = exhibitors.reduce((sum, e) => sum + e.graphicChanges, 0);
  const totalEmissionsAvoided = exhibitors.reduce((sum, e) => {
    const stats = calculateExhibitorStats(e);
    return sum + stats.emissionsAvoided;
  }, 0);
  const avgAge = (exhibitors.reduce((sum, e) => sum + e.yearsInOperation, 0) / exhibitors.length).toFixed(1);

  let filteredExhibitors = exhibitors.filter(e => {
    const matchesSearch = e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.location.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = filterModel === 'all' || e.model.includes(filterModel);
    return matchesSearch && matchesModel;
  });

  // Ordenar
  filteredExhibitors = [...filteredExhibitors].sort((a, b) => {
    if (sortBy === 'cycles') return b.graphicChanges - a.graphicChanges;
    if (sortBy === 'age') return b.yearsInOperation - a.yearsInOperation;
    const statsA = calculateExhibitorStats(a);
    const statsB = calculateExhibitorStats(b);
    return statsB.emissionsAvoided - statsA.emissionsAvoided;
  });

  return (
    <AppLayout>
      {/* Header con stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Exhibidores</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span><strong className="text-gray-900">{exhibitors.length}</strong> activos</span>
            <span>•</span>
            <span><strong className="text-emerald-600">{totalCycles}</strong> ciclos totales</span>
            <span>•</span>
            <span><strong className="text-blue-600">{avgAge}</strong> años promedio</span>
            <span>•</span>
            <span><strong className="text-emerald-600">-{totalEmissionsAvoided.toFixed(0)}</strong> kg CO₂</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-40"
            />
          </div>
          
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">Modelo</option>
            {exhibitorModels.map(model => (
              <option key={model.id} value={model.name}>{model.name.replace('4R PLANET ', '')}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'cycles' | 'age' | 'emissions')}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="cycles">Por ciclos</option>
            <option value="age">Por antigüedad</option>
            <option value="emissions">Por impacto CO₂</option>
          </select>
        </div>
      </div>

      {/* Lista de exhibidores - más detalle */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase">
          <div className="col-span-3">Exhibidor</div>
          <div className="col-span-2">Ubicación</div>
          <div className="col-span-2">Campaña Actual</div>
          <div className="col-span-1 text-center">Años</div>
          <div className="col-span-1 text-center">Ciclos</div>
          <div className="col-span-1 text-center">kg CO₂</div>
          <div className="col-span-1 text-center">kg Mat.</div>
          <div className="col-span-1"></div>
        </div>
        
        {filteredExhibitors.map((exhibitor) => {
          const stats = calculateExhibitorStats(exhibitor);
          return (
            <Link key={exhibitor.id} href={`/trazabilidad/${exhibitor.id}`}>
              <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer items-center">
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      exhibitor.condition === 'excellent' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}></span>
                    <div>
                      <div className="font-medium text-gray-900">{exhibitor.id}</div>
                      <div className="text-xs text-gray-400">{exhibitor.model.replace('4R PLANET ', '')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 text-sm text-gray-600 truncate">
                  {exhibitor.location.store}
                </div>
                
                <div className="col-span-2 text-sm text-gray-600 truncate">
                  {exhibitor.currentGraphic.campaign}
                </div>
                
                <div className="col-span-1 text-center">
                  <div className="text-sm font-medium text-gray-900">{exhibitor.yearsInOperation.toFixed(1)}</div>
                </div>
                
                <div className="col-span-1 text-center">
                  <div className="text-sm font-bold text-emerald-600">{exhibitor.graphicChanges}</div>
                </div>
                
                <div className="col-span-1 text-center">
                  <div className="text-sm text-emerald-600">-{stats.netBalance.toFixed(0)}</div>
                </div>
                
                <div className="col-span-1 text-center">
                  <div className="text-sm text-gray-600">{stats.totalWeight.toFixed(0)}</div>
                </div>
                
                <div className="col-span-1 text-right">
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredExhibitors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No se encontraron exhibidores</p>
        </div>
      )}
    </AppLayout>
  );
}
