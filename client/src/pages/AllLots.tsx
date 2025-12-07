import { useState } from 'react';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { useClientData } from '@/hooks/useClientData';
import { flowTypes } from '@/data/mockLots';
import {
  Package,
  Search,
  Filter,
  Download,
  Eye
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

export default function AllLots() {
  const { lots: clientLots, currentClient } = useClientData();
  const [selectedFlowType, setSelectedFlowType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLots = clientLots.filter(lot => {
    const matchesFlowType = selectedFlowType === 'all' || lot.flowType === selectedFlowType;
    const matchesStatus = selectedStatus === 'all' || lot.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      lot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.productType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFlowType && matchesStatus && matchesSearch;
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

  const activeLots = clientLots.filter(l => l.status === 'active').length;
  const totalCycles = clientLots.reduce((sum, lot) => sum + lot.totalCycles, 0);
  const totalEmissions = clientLots.reduce((sum, lot) => sum + lot.totalEmissionsAvoided, 0);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Mis Lotes
            </h1>
            <p className="text-gray-600 text-lg">
              Gestión completa de {clientLots.length} lotes de {currentClient.name} en el sistema circular
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="text-3xl font-black text-gray-900 mb-1">{clientLots.length}</div>
              <div className="text-sm text-gray-600">Total de Lotes</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="text-3xl font-black text-green-600 mb-1">{activeLots}</div>
              <div className="text-sm text-gray-600">Activos</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="text-3xl font-black text-blue-600 mb-1">{totalCycles}</div>
              <div className="text-sm text-gray-600">Ciclos Totales</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="text-3xl font-black text-orange-600 mb-1">{totalEmissions.toFixed(0)} kg</div>
              <div className="text-sm text-gray-600">CO₂ Evitado</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Registro de Mis Lotes</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por ID o producto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedFlowType} onValueChange={setSelectedFlowType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tipo de flujo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los flujos</SelectItem>
                      {flowTypes.map(ft => (
                        <SelectItem key={ft.id} value={ft.id}>{ft.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="collected">Recolectados</SelectItem>
                      <SelectItem value="processing">Procesando</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">ID Lote</TableHead>
                    <TableHead className="font-bold">Tipo de Flujo</TableHead>
                    <TableHead className="font-bold">Producto</TableHead>
                    <TableHead className="font-bold">Peso</TableHead>
                    <TableHead className="font-bold">Ciclos</TableHead>
                    <TableHead className="font-bold">Reciclado</TableHead>
                    <TableHead className="font-bold">CO₂ Evitado</TableHead>
                    <TableHead className="font-bold">Estado</TableHead>
                    <TableHead className="font-bold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLots.map((lot) => (
                    <TableRow key={lot.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono font-semibold text-blue-600">
                        {lot.id}
                      </TableCell>
                      <TableCell className="text-sm">{getFlowTypeName(lot.flowType)}</TableCell>
                      <TableCell className="max-w-xs truncate">{lot.productType}</TableCell>
                      <TableCell>{lot.weight} kg</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold">{lot.currentCycle}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-600">{lot.totalCycles}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold">
                          {lot.recycledContent}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        {lot.totalEmissionsAvoided.toFixed(1)} kg
                      </TableCell>
                      <TableCell>{getStatusBadge(lot.status)}</TableCell>
                      <TableCell>
                        <Link href={`/lot/${lot.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
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
        </div>
      </div>
    </AppLayout>
  );
}
