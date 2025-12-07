import { useState } from 'react';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { ExecutiveKPICard } from '@/components/dashboard/ExecutiveKPICard';
import { allLots, flowTypes, getLotsByFlowType } from '@/data/mockLots';
import { Lot } from '@shared/types';
import {
  GitBranch,
  Package,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Filter,
  Search,
  Calendar,
  MapPin,
  Leaf
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Trazabilidad() {
  const [selectedFlowType, setSelectedFlowType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calcular métricas
  const traceabilityMetrics = {
    totalLots: allLots.length,
    activeLots: allLots.filter(l => l.status === 'active').length,
    totalCycles: allLots.reduce((sum, lot) => sum + lot.totalCycles, 0),
    totalEmissionsAvoided: allLots.reduce((sum, lot) => sum + lot.totalEmissionsAvoided, 0),
    totalPlasticRecycled: allLots.reduce((sum, lot) => sum + lot.totalPlasticRecycled, 0),
    averageCycles: allLots.length > 0 
      ? (allLots.reduce((sum, lot) => sum + lot.totalCycles, 0) / allLots.length).toFixed(1)
      : '0'
  };

  // Filtrar lotes
  const filteredLots = allLots.filter(lot => {
    const matchesFlowType = selectedFlowType === 'all' || lot.flowType === selectedFlowType;
    const matchesSearch = searchQuery === '' || 
      lot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.productType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFlowType && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>;
      case 'collected':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Recolectado</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Procesando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFlowTypeName = (flowTypeId: string) => {
    return flowTypes.find(ft => ft.id === flowTypeId)?.name || flowTypeId;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'En curso';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trazabilidad de Ciclo de Vida</h1>
            <p className="text-gray-600">Seguimiento completo de lotes y flujos circulares</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ExecutiveKPICard
              title="Total de Lotes"
              value={traceabilityMetrics.totalLots}
              subtitle={`${traceabilityMetrics.activeLots} activos`}
              icon={<Package className="w-5 h-5" />}
              variant="primary"
            />
            <ExecutiveKPICard
              title="Ciclos Totales"
              value={traceabilityMetrics.totalCycles}
              subtitle={`Promedio: ${traceabilityMetrics.averageCycles} por lote`}
              icon={<GitBranch className="w-5 h-5" />}
              variant="success"
            />
            <ExecutiveKPICard
              title="Emisiones Evitadas"
              value={`${traceabilityMetrics.totalEmissionsAvoided.toFixed(1)} kg`}
              subtitle="CO₂ equivalente"
              icon={<Leaf className="w-5 h-5" />}
              variant="success"
            />
            <ExecutiveKPICard
              title="Material Reciclado"
              value={`${traceabilityMetrics.totalPlasticRecycled.toFixed(1)} kg`}
              subtitle="Plástico reciclado"
              icon={<TrendingUp className="w-5 h-5" />}
              variant="primary"
            />
          </div>

          {/* Flujos Circulares - Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Flujos Circulares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flowTypes.map((flowType) => {
                const lots = getLotsByFlowType(flowType.id);
                const totalCycles = lots.reduce((sum, lot) => sum + lot.totalCycles, 0);
                const totalEmissions = lots.reduce((sum, lot) => sum + lot.totalEmissionsAvoided, 0);
                
                return (
                  <Link key={flowType.id} href={`/lots/${flowType.id}`}>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {flowType.name}
                          </h3>
                          <p className="text-sm text-gray-600">{flowType.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{lots.length}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Lotes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{totalCycles}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Ciclos</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{totalEmissions.toFixed(1)} kg</span> CO₂ evitado
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Tabla de Lotes */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Lotes Registrados</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar lote..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedFlowType} onValueChange={setSelectedFlowType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por flujo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los flujos</SelectItem>
                      {flowTypes.map(ft => (
                        <SelectItem key={ft.id} value={ft.id}>{ft.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID Lote</TableHead>
                    <TableHead className="font-semibold">Tipo de Flujo</TableHead>
                    <TableHead className="font-semibold">Producto</TableHead>
                    <TableHead className="font-semibold">Peso (kg)</TableHead>
                    <TableHead className="font-semibold">Ciclos</TableHead>
                    <TableHead className="font-semibold">Contenido Reciclado</TableHead>
                    <TableHead className="font-semibold">CO₂ Evitado</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLots.map((lot) => (
                    <TableRow key={lot.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{lot.id}</TableCell>
                      <TableCell>{getFlowTypeName(lot.flowType)}</TableCell>
                      <TableCell className="max-w-xs truncate">{lot.productType}</TableCell>
                      <TableCell>{lot.weight} kg</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{lot.currentCycle}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-600">{lot.totalCycles}</span>
                        </div>
                      </TableCell>
                      <TableCell>{lot.recycledContent}%</TableCell>
                      <TableCell>{lot.totalEmissionsAvoided.toFixed(1)} kg</TableCell>
                      <TableCell>{getStatusBadge(lot.status)}</TableCell>
                      <TableCell>
                        <Link href={`/lot/${lot.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver Detalle
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredLots.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No se encontraron lotes con los filtros seleccionados</p>
              </div>
            )}
          </div>

          {/* Resumen de Ciclos */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Flujo</h3>
              <div className="space-y-3">
                {flowTypes.map(flowType => {
                  const lots = getLotsByFlowType(flowType.id);
                  const percentage = (lots.length / allLots.length) * 100;
                  return (
                    <div key={flowType.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{flowType.name}</span>
                        <span className="font-medium text-gray-900">{lots.length} lotes ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Impacto</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de Emisiones Evitadas</span>
                  <span className="text-lg font-bold text-green-600">
                    {traceabilityMetrics.totalEmissionsAvoided.toFixed(1)} kg CO₂
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Material Reciclado Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {traceabilityMetrics.totalPlasticRecycled.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ciclos Promedio por Lote</span>
                  <span className="text-lg font-bold text-gray-900">
                    {traceabilityMetrics.averageCycles}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Link href="/">
                    <Button className="w-full" variant="outline">
                      Ver Visualización de Flujos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

