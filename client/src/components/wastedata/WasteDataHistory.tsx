import { useQuery } from '@tanstack/react-query';
import { WasteData } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart2 } from 'lucide-react';

interface WasteDataHistoryProps {
  clientId?: number;
  limit?: number;
}

export default function WasteDataHistory({ clientId, limit = 5 }: WasteDataHistoryProps) {
  // Fetch waste data for the specified client
  const { data: wasteData = [], isLoading } = useQuery<WasteData[]>({
    queryKey: ['/api/waste-data', clientId],
    queryFn: async ({ queryKey }) => {
      const [_, clientId] = queryKey;
      const url = clientId 
        ? `/api/waste-data?clientId=${clientId}` 
        : '/api/waste-data';
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch waste data');
      return await res.json();
    },
    enabled: true,
    refetchOnWindowFocus: false
  });
  
  // Format date for display
  const formatDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Format number as kg
  const formatKg = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + ' kg';
  };
  
  // Determine waste source (manual entry or document)
  const getWasteSource = (data: WasteData): { text: string, badge: React.ReactNode } => {
    if (data.documentId) {
      return { 
        text: 'Documento', 
        badge: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Documento</Badge>
      };
    } else {
      return { 
        text: 'Manual', 
        badge: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Manual</Badge>
      };
    }
  };
  
  // Sort data by date (newest first) and limit to specified number
  const sortedData = [...wasteData]
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-2">
              <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (sortedData.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <BarChart2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No hay registros de residuos disponibles</p>
        <p className="text-sm mt-2">Usa el formulario para agregar datos manualmente</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-right">Orgánicos</th>
              <th className="px-3 py-2 text-right">PODA</th>
              <th className="px-3 py-2 text-right">Inorgánicos</th>
              <th className="px-3 py-2 text-right">Reciclables</th>
              <th className="px-3 py-2 text-center">Origen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.map((data) => {
              const source = getWasteSource(data);
              
              return (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{formatDate(data.date)}</td>
                  <td className="px-3 py-2 text-right">{formatKg(data.organicWaste || 0)}</td>
                  <td className="px-3 py-2 text-right">{formatKg(data.podaWaste || 0)}</td>
                  <td className="px-3 py-2 text-right">{formatKg(data.inorganicWaste || 0)}</td>
                  <td className="px-3 py-2 text-right">{formatKg(data.recyclableWaste || 0)}</td>
                  <td className="px-3 py-2 text-center">{source.badge}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}