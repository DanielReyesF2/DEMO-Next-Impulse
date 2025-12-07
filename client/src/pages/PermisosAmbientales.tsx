import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { ExecutiveKPICard } from '@/components/dashboard/ExecutiveKPICard';
import {
  FileCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Filter,
  Search,
  Download,
  FileText
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data interface (until API is fully connected)
interface PermisoAmbiental {
  id: number;
  tipo: string;
  numero: string;
  descripcion: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: 'vigente' | 'por_vencer' | 'vencido';
  diasRestantes: number;
  documentos?: Array<{ nombre: string; url: string; fecha: string }>;
  notas?: string;
}

const mockPermisos: PermisoAmbiental[] = [
  {
    id: 1,
    tipo: 'SEMARNAT',
    numero: 'SEM-2024-001',
    descripcion: 'Permiso de Generación de Residuos Peligrosos',
    fechaEmision: '2024-01-15',
    fechaVencimiento: '2025-07-15',
    estado: 'vigente',
    diasRestantes: 165
  },
  {
    id: 2,
    tipo: 'PROFEPA',
    numero: 'PROF-2023-089',
    descripcion: 'Autorización de Manejo de Residuos No Peligrosos',
    fechaEmision: '2023-06-01',
    fechaVencimiento: '2025-05-30',
    estado: 'vigente',
    diasRestantes: 120
  },
  {
    id: 3,
    tipo: 'TRUE Zero Waste',
    numero: 'TRUE-2024-AVANDARO',
    descripcion: 'Certificación TRUE Zero Waste',
    fechaEmision: '2024-08-01',
    fechaVencimiento: '2025-07-31',
    estado: 'vigente',
    diasRestantes: 180
  },
  {
    id: 4,
    tipo: 'SEMARNAT',
    numero: 'SEM-2023-045',
    descripcion: 'Permiso de Descarga de Aguas Residuales',
    fechaEmision: '2023-03-20',
    fechaVencimiento: '2025-03-20',
    estado: 'por_vencer',
    diasRestantes: 45
  },
  {
    id: 5,
    tipo: 'PROFEPA',
    numero: 'PROF-2022-156',
    descripcion: 'Autorización de Operación PTAR',
    fechaEmision: '2022-11-10',
    fechaVencimiento: '2024-11-10',
    estado: 'vencido',
    diasRestantes: -30
  }
];

export default function PermisosAmbientales() {
  const [selectedEstado, setSelectedEstado] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Replace with actual API call when backend is ready
  // const { data: permisos = [] } = useQuery<PermisoAmbiental[]>({
  //   queryKey: ['/api/permisos-ambientales'],
  //   refetchOnWindowFocus: false,
  // });
  
  const permisos = mockPermisos;

  // Calcular métricas
  const metrics = {
    total: permisos.length,
    vigentes: permisos.filter(p => p.estado === 'vigente').length,
    porVencer: permisos.filter(p => p.estado === 'por_vencer').length,
    vencidos: permisos.filter(p => p.estado === 'vencido').length,
    cumplimiento: permisos.length > 0 
      ? ((permisos.filter(p => p.estado === 'vigente').length / permisos.length) * 100).toFixed(0)
      : '0',
    proximosVencimientos: permisos
      .filter(p => p.estado === 'vigente' || p.estado === 'por_vencer')
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
      .slice(0, 5)
  };

  // Filtrar permisos
  const filteredPermisos = permisos.filter(permiso => {
    const matchesEstado = selectedEstado === 'all' || permiso.estado === selectedEstado;
    const matchesSearch = searchQuery === '' || 
      permiso.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permiso.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permiso.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEstado && matchesSearch;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'vigente':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Vigente</Badge>;
      case 'por_vencer':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Por Vencer</Badge>;
      case 'vencido':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Vencido</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDiasRestantesColor = (dias: number) => {
    if (dias < 0) return 'text-red-600 font-semibold';
    if (dias < 30) return 'text-red-600 font-semibold';
    if (dias < 60) return 'text-yellow-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Permisos Ambientales</h1>
              <p className="text-gray-600">Control de vencimientos y cumplimiento normativo</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Permiso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Permiso Ambiental</DialogTitle>
                  <DialogDescription>
                    Esta funcionalidad estará disponible próximamente
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ExecutiveKPICard
              title="Permisos Vigentes"
              value={metrics.vigentes}
              subtitle={`de ${metrics.total} totales`}
              icon={<CheckCircle2 className="w-5 h-5" />}
              variant="success"
            />
            <ExecutiveKPICard
              title="Por Vencer"
              value={metrics.porVencer}
              subtitle="Requieren atención"
              icon={<Clock className="w-5 h-5" />}
              variant="warning"
            />
            <ExecutiveKPICard
              title="Vencidos"
              value={metrics.vencidos}
              subtitle="Acción inmediata"
              icon={<XCircle className="w-5 h-5" />}
              variant="danger"
            />
            <ExecutiveKPICard
              title="Cumplimiento"
              value={`${metrics.cumplimiento}%`}
              subtitle="Tasa de vigencia"
              icon={<FileCheck className="w-5 h-5" />}
              variant="primary"
            />
          </div>

          {/* Alertas de Vencimientos Próximos */}
          {metrics.proximosVencimientos.length > 0 && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-yellow-900">Próximos Vencimientos</h2>
              </div>
              <div className="space-y-2">
                {metrics.proximosVencimientos.map(permiso => (
                  <div key={permiso.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-100">
                    <div>
                      <div className="font-medium text-gray-900">{permiso.tipo} - {permiso.numero}</div>
                      <div className="text-sm text-gray-600">{permiso.descripcion}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getDiasRestantesColor(permiso.diasRestantes)}`}>
                        {permiso.diasRestantes > 0 ? `${permiso.diasRestantes} días` : `Vencido hace ${Math.abs(permiso.diasRestantes)} días`}
                      </div>
                      <div className="text-xs text-gray-500">
                        Vence: {formatDate(permiso.fechaVencimiento)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabla de Permisos */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Registro de Permisos</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar permiso..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="vigente">Vigentes</SelectItem>
                      <SelectItem value="por_vencer">Por Vencer</SelectItem>
                      <SelectItem value="vencido">Vencidos</SelectItem>
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
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Número</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="font-semibold">Emisión</TableHead>
                    <TableHead className="font-semibold">Vencimiento</TableHead>
                    <TableHead className="font-semibold text-right">Días Restantes</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermisos.map((permiso) => (
                    <TableRow key={permiso.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{permiso.tipo}</TableCell>
                      <TableCell>{permiso.numero}</TableCell>
                      <TableCell className="max-w-xs">{permiso.descripcion}</TableCell>
                      <TableCell>{formatDate(permiso.fechaEmision)}</TableCell>
                      <TableCell>{formatDate(permiso.fechaVencimiento)}</TableCell>
                      <TableCell className="text-right">
                        <span className={getDiasRestantesColor(permiso.diasRestantes)}>
                          {permiso.diasRestantes > 0 ? `${permiso.diasRestantes}` : `-${Math.abs(permiso.diasRestantes)}`}
                        </span>
                      </TableCell>
                      <TableCell>{getEstadoBadge(permiso.estado)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredPermisos.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No se encontraron permisos con los filtros seleccionados</p>
              </div>
            )}
          </div>

          {/* Calendario de Vencimientos */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Calendario de Vencimientos</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mes, index) => {
                const permisosMes = permisos.filter(p => {
                  const fechaVenc = new Date(p.fechaVencimiento);
                  return fechaVenc.getMonth() === index;
                });
                return (
                  <div key={mes} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-semibold text-gray-900 mb-2">{mes}</div>
                    <div className="space-y-1">
                      {permisosMes.length > 0 ? (
                        permisosMes.map(p => (
                          <div key={p.id} className="text-sm">
                            <div className="font-medium">{p.tipo}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(p.fechaVencimiento).getDate()} - {p.numero}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400">Sin vencimientos</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

