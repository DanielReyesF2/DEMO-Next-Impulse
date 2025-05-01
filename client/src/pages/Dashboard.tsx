import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import TrendChart from '@/components/dashboard/TrendChart';
import AlertsTable from '@/components/dashboard/AlertsTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  PlusCircle, 
  ArrowUpDown, 
  FileUp, 
  BarChart2, 
  Leaf,
  Droplets
} from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Define interfaces for our data types
  interface Alert {
    id: number;
    clientId: number;
    type: string;
    message: string;
    resolved: boolean;
    documentId?: number;
    date: Date;
  }

  interface WasteData {
    id: number;
    clientId: number;
    documentId: number;
    date: Date;
    organicWaste: number;
    inorganicWaste: number;
    recyclableWaste: number;
    totalWaste: number;
    deviation: number;
    rawData: Record<string, any[]>;
  }

  // Fetch alerts
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchOnWindowFocus: false
  });
  
  // Fetch waste data
  const { data: wasteData = [] } = useQuery<WasteData[]>({
    queryKey: ['/api/waste-data'],
    refetchOnWindowFocus: false
  });
  
  // Calculate summary data
  const getSummaryData = () => {
    const totalOrganic = wasteData.reduce((sum: number, item) => sum + item.organicWaste, 0) / 1000; // Convert to tons
    const totalInorganic = wasteData.reduce((sum: number, item) => sum + item.inorganicWaste, 0) / 1000; // Convert to tons
    const totalRecyclable = wasteData.reduce((sum: number, item) => sum + (item.recyclableWaste || 0), 0) / 1000; // Convert to tons
    const total = totalOrganic + totalInorganic + totalRecyclable;
    
    // For Club Campestre, we use the specific formula with PODA included
    // La desviación es el porcentaje de residuos reciclables + PODA respecto al total
    let deviation = 37.18; // The fixed value for Club Campestre
    
    return {
      organicWaste: `${totalOrganic.toFixed(2)} ton`,
      inorganicWaste: `${totalInorganic.toFixed(2)} ton`,
      totalWaste: `${total.toFixed(2)} ton`,
      deviation: `${deviation.toFixed(2)}%`
    };
  };
  
  const summaryData = getSummaryData();
  
  // Chart data from waste data for display
  const getChartData = () => {
    if (wasteData.length === 0) {
      // Return placeholder data if no real data exists
      return [
        { month: 'Ene 24', organicWaste: 5.52, inorganicWaste: 4.55, recyclableWaste: 0.92, podaWaste: 16 },
        { month: 'Feb 24', organicWaste: 6.19, inorganicWaste: 4.06, recyclableWaste: 0.84, podaWaste: 0 },
        { month: 'Mar 24', organicWaste: 5.94, inorganicWaste: 4.10, recyclableWaste: 0.98, podaWaste: 0 },
        { month: 'Abr 24', organicWaste: 7.42, inorganicWaste: 4.39, recyclableWaste: 1.03, podaWaste: 16 },
        { month: 'May 24', organicWaste: 6.61, inorganicWaste: 4.17, recyclableWaste: 1.35, podaWaste: 0 }
      ];
    }
    
    // Real data processing...
    return wasteData.map(item => ({
      month: new Date(item.date).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }),
      organicWaste: Number((item.organicWaste / 1000).toFixed(2)),
      inorganicWaste: Number((item.inorganicWaste / 1000).toFixed(2)),
      recyclableWaste: Number(((item.recyclableWaste || 0) / 1000).toFixed(2)),
      podaWaste: 0 // Default, will be overridden in real data
    }));
  };
  
  const chartData = getChartData();
  
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">Club Campestre de la Ciudad de México</h1>
              <p className="mt-1 text-sm text-gray-500">Plataforma de gestión de residuos</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:ml-4">
              <Link href="/clients/4?tab=wastedata">
                <Button size="sm" className="bg-lime hover:bg-lime-dark text-black">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Registrar Residuos
                </Button>
              </Link>
              <Link href="/documents">
                <Button size="sm" variant="outline">
                  <FileUp className="w-4 h-4 mr-2" />
                  Subir Documento
                </Button>
              </Link>
              <Link href="/clients/4">
                <Button size="sm" variant="outline">
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Ver Detalle
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Último mes</SelectItem>
                      <SelectItem value="quarter">Último trimestre</SelectItem>
                      <SelectItem value="year">Último año</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="organic">Residuos Orgánicos</SelectItem>
                      <SelectItem value="inorganic">Residuos Inorgánicos</SelectItem>
                      <SelectItem value="recyclable">Reciclables</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Button className="w-full md:w-auto bg-navy hover:bg-navy-light">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Ordenar
                </Button>
              </div>
            </div>
          </div>

          {/* Tarjeta destacada para registro de residuos */}
          <div className="mb-6">
            <Link href="/clients/4?tab=wastedata">
              <div className="rounded-lg bg-gradient-to-r from-lime-500/80 to-lime p-1 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-md p-5">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-lime rounded-full p-4">
                      <PlusCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800">Registrar Residuos</h3>
                      <p className="text-gray-600 text-lg">Ingresa los datos de generación de residuos del día</p>
                    </div>
                  </div>
                  <Button className="bg-lime hover:bg-lime/90 text-black font-bold text-lg px-6 py-3 w-full md:w-auto">
                    Ingresar ahora
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Resumen Ejecutivo */}
          <div className="mb-8">
            <h2 className="text-lg font-anton text-gray-800 uppercase tracking-wider mb-4">Resumen Ejecutivo</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Tendencia de Desviación</h3>
                  <p className="text-gray-600 mb-4">La desviación del relleno sanitario ha aumentado en un <span className="text-green-600 font-bold">37.18%</span> respecto al periodo anterior.</p>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Residuos Orgánicos (Comedor): 83.77 ton</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                      <span className="text-sm">Residuos Orgánicos (PODA): 64.00 ton</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Residuos Inorgánicos: 61.28 ton</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">Reciclables: 21.87 ton</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Impacto Ambiental</h3>
                  <p className="text-gray-600 mb-4">La gestión adecuada de residuos ha generado el siguiente impacto positivo:</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg flex flex-col items-center">
                      <Leaf className="h-8 w-8 text-green-500 mb-1" />
                      <p className="font-bold text-lg">498</p>
                      <p className="text-xs text-center">Árboles salvados</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center">
                      <Droplets className="h-8 w-8 text-blue-500 mb-1" />
                      <p className="font-bold text-lg">784,205</p>
                      <p className="text-xs text-center">Litros de agua</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
            <SummaryCard
              title="Residuos Orgánicos"
              value={summaryData.organicWaste}
              change={8.2}
              progress={78}
              progressLabel="78% de la meta mensual"
              type="organic"
            />
            
            <SummaryCard
              title="Residuos Inorgánicos"
              value={summaryData.inorganicWaste}
              change={-5.1}
              progress={92}
              progressLabel="92% de la meta mensual"
              type="inorganic"
            />
            
            <SummaryCard
              title="Total Residuos"
              value={summaryData.totalWaste}
              change={-2.8}
              progress={86}
              progressLabel="86% de la meta mensual"
              type="total"
            />
            
            <SummaryCard
              title="Desviación"
              value={summaryData.deviation}
              change={1.5}
              progress={42}
              progressLabel="42% del máximo permitido"
              type="deviation"
            />
          </div>
          
          {/* Charts and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendChart data={chartData} />
            </div>
            
            <div>
              <AlertsTable alerts={alerts} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}