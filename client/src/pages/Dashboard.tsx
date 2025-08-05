import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  FileUp, 
  BarChart2, 
  Download, 
  Leaf, 
  Droplets, 
  ArrowUpDown, 
  Trash2,
  Recycle,
  Calendar,
  ChartPie,
  Settings,
  Eye
} from 'lucide-react';
import TrendChart from '@/components/dashboard/TrendChart';
import AlertsTable from '@/components/dashboard/AlertsTable';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { ClubHeader } from '@/components/dashboard/ClubHeader';
import { ClubAchievements } from '@/components/dashboard/ClubAchievements';
import { TrueCertification } from '@/components/dashboard/TrueCertification';
import { WasteData, Alert } from '@shared/schema';

export default function Dashboard() {
  // Estados para filtros
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Obtener datos de residuos
  const { data: wasteData = [] } = useQuery<WasteData[]>({
    queryKey: ['/api/waste-data'],
    refetchOnWindowFocus: false,
  });
  
  // Obtener alertas
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchOnWindowFocus: false,
  });
  
  // Calcular datos de resumen - convertir kg a toneladas
  const summaryData = {
    organicWaste: 147.77, // Incluye PODA y orgánicos
    inorganicWaste: 61.28,
    totalWaste: 230.92,
    deviation: 37.18, // (Reciclable + PODA) / Total × 100
  };
  
  // Preparar datos para el gráfico - se espera una estructura específica
  const chartData = [
    { month: 'Ene 24', organicWaste: 5.52, podaWaste: 16.00, inorganicWaste: 4.55, recyclableWaste: 0.92 },
    { month: 'Feb 24', organicWaste: 6.19, podaWaste: 0.00, inorganicWaste: 4.06, recyclableWaste: 0.84 },
    { month: 'Mar 24', organicWaste: 5.94, podaWaste: 0.00, inorganicWaste: 4.10, recyclableWaste: 0.98 },
    { month: 'Abr 24', organicWaste: 7.42, podaWaste: 16.00, inorganicWaste: 4.39, recyclableWaste: 1.03 },
    { month: 'May 24', organicWaste: 6.61, podaWaste: 0.00, inorganicWaste: 4.17, recyclableWaste: 1.35 },
    { month: 'Jun 24', organicWaste: 4.93, podaWaste: 0.00, inorganicWaste: 4.38, recyclableWaste: 0.00 },
    { month: 'Jul 24', organicWaste: 5.05, podaWaste: 0.00, inorganicWaste: 3.34, recyclableWaste: 0.66 },
    { month: 'Ago 24', organicWaste: 5.46, podaWaste: 0.00, inorganicWaste: 5.73, recyclableWaste: 0.63 },
    { month: 'Sep 24', organicWaste: 5.67, podaWaste: 0.00, inorganicWaste: 4.69, recyclableWaste: 2.19 },
    { month: 'Oct 24', organicWaste: 6.05, podaWaste: 0.00, inorganicWaste: 4.50, recyclableWaste: 0.76 },
    { month: 'Nov 24', organicWaste: 5.86, podaWaste: 0.00, inorganicWaste: 4.71, recyclableWaste: 0.98 },
    { month: 'Dic 24', organicWaste: 6.21, podaWaste: 16.00, inorganicWaste: 5.20, recyclableWaste: 1.13 },
    { month: 'Ene 25', organicWaste: 6.87, podaWaste: 0.00, inorganicWaste: 3.75, recyclableWaste: 1.14 },
    { month: 'Feb 25', organicWaste: 5.07, podaWaste: 0.00, inorganicWaste: 2.83, recyclableWaste: 5.07 },
    { month: 'Mar 25', organicWaste: 4.52, podaWaste: 0.00, inorganicWaste: 3.56, recyclableWaste: 3.18 },
  ];
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-6 px-4">
          {/* Header con branding personalizado del Club Campestre */}
          <ClubHeader />
          
          {/* KPI Cards - diseño minimalista usando el componente SummaryCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="Índice de Desviación"
              value={`${summaryData.deviation}%`}
              change={2.3}
              progress={summaryData.deviation}
              progressLabel="Meta: 90% para certificación TRUE"
              type="deviation"
            />
            
            <SummaryCard
              title="Residuos Orgánicos"
              value={`${summaryData.organicWaste} ton`}
              change={-8.2}
              progress={75}
              progressLabel="Incluye comedor y PODA"
              type="organic"
            />
            
            <SummaryCard
              title="Residuos Inorgánicos"
              value={`${summaryData.inorganicWaste} ton`}
              change={4.1}
              progress={60}
              progressLabel="Requiere mejor separación"
              type="inorganic"
            />
            
            <SummaryCard
              title="Total de Residuos"
              value={`${summaryData.totalWaste} ton`}
              change={-2.5}
              progress={85}
              progressLabel="Generación en 2024"
              type="total"
            />
          </div>
          
          {/* Certificación TRUE Zero Waste */}
          <TrueCertification currentDeviation={summaryData.deviation} />
          
          {/* Logros de sostenibilidad del Club Campestre */}
          <ClubAchievements />
          
          {/* Gráfica de tendencias - diseño minimalista */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Tendencia de Residuos</h2>
              <select 
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="year">Último año</option>
                <option value="quarter">Último trimestre</option>
                <option value="month">Último mes</option>
              </select>
            </div>
            
            <div className="h-[300px]">
              <TrendChart data={chartData} />
            </div>
          </div>
          
          {/* Acciones rápidas - diseño minimalista */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Link href="/data-entry">
              <div className="bg-white border border-gray-100 rounded-xl p-6 hover:border-navy/20 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-lime/10 rounded-xl flex items-center justify-center group-hover:bg-lime/20 transition-colors">
                    <PlusCircle className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Registrar Residuos</h3>
                    <p className="text-sm text-gray-500 mt-1">Ingresa datos del día</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/documents">
              <div className="bg-white border border-gray-100 rounded-xl p-6 hover:border-navy/20 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center group-hover:bg-navy/20 transition-colors">
                    <FileUp className="h-6 w-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Subir Documento</h3>
                    <p className="text-sm text-gray-500 mt-1">Carga una nueva bitácora o reporte</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}