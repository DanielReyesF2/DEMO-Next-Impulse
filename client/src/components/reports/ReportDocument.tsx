import { ReactNode } from 'react';
import { Download, Printer } from 'lucide-react';

interface ReportDocumentProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  logoUrl?: string;
  period: string;
  company: string;
  standard: string;
  onDownload?: () => void;
}

export function ReportDocument({ 
  children, 
  title, 
  subtitle,
  logoUrl, 
  period, 
  company, 
  standard,
  onDownload 
}: ReportDocumentProps) {
  return (
    <div className="bg-gray-100 p-6 min-h-[800px]">
      {/* Controles flotantes */}
      <div className="flex justify-end gap-2 mb-4 sticky top-0 z-10">
        <button 
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar PDF
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <Printer className="w-4 h-4" />
          Imprimir
        </button>
      </div>

      {/* Documento tipo papel */}
      <div className="max-w-[850px] mx-auto bg-white shadow-xl rounded-sm print:shadow-none">
        {/* Portada */}
        <div className="h-[500px] flex flex-col justify-between p-12 bg-gradient-to-br from-gray-50 to-white border-b-4 border-emerald-500">
          {/* Header con logo */}
          <div className="flex justify-between items-start">
            {logoUrl && (
              <img src={logoUrl} alt={standard} className="h-16 object-contain" />
            )}
            <div className="text-right">
              <div className="text-sm text-gray-400">Período de reporte</div>
              <div className="text-lg font-semibold text-gray-700">{period}</div>
            </div>
          </div>

          {/* Título central */}
          <div className="text-center py-12">
            <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">{title}</h1>
            {subtitle && (
              <p className="text-xl text-gray-500">{subtitle}</p>
            )}
          </div>

          {/* Footer de portada */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-2xl font-bold text-gray-800">{company}</div>
              <div className="text-sm text-gray-500">Reporte generado automáticamente</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Powered by</div>
              <div className="text-sm font-semibold text-emerald-600">Econova Platform</div>
            </div>
          </div>
        </div>

        {/* Contenido del reporte */}
        <div className="p-12">
          {children}
        </div>

        {/* Footer del documento */}
        <div className="px-12 py-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-400">
          <span>{company} • {standard} • {period}</span>
          <span>Generado por Econova Platform</span>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares para el contenido del reporte
export function ReportSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="mb-10 page-break-inside-avoid">
      <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 pb-2 border-b-2 border-emerald-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ReportSubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-emerald-700 mb-3 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

export function ReportTable({ headers, rows }: { headers: string[]; rows: (string | number | ReactNode)[][] }) {
  return (
    <table className="w-full text-sm border-collapse mb-4">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((header, i) => (
            <th key={i} className={`py-3 px-4 text-left font-semibold text-gray-700 border-b-2 border-gray-300 ${i > 0 ? 'text-right' : ''}`}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
            {row.map((cell, j) => (
              <td key={j} className={`py-3 px-4 ${j > 0 ? 'text-right' : ''}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ReportMetricCard({ 
  label, 
  value, 
  unit, 
  highlight = false 
}: { 
  label: string; 
  value: string | number; 
  unit?: string; 
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-emerald-600' : 'text-gray-800'}`}>
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export function ReportIndicator({ 
  code, 
  name, 
  value, 
  status 
}: { 
  code: string; 
  name: string; 
  value: string | ReactNode; 
  status?: 'cumple' | 'parcial' | 'no-cumple';
}) {
  const statusColors = {
    'cumple': 'bg-emerald-100 text-emerald-700',
    'parcial': 'bg-amber-100 text-amber-700',
    'no-cumple': 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100">
      <div className="w-20 flex-shrink-0">
        <span className="text-xs font-mono bg-gray-200 text-gray-600 px-2 py-1 rounded">{code}</span>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-700">{name}</div>
        <div className="text-sm text-gray-600 mt-1">{value}</div>
      </div>
      {status && (
        <span className={`text-xs px-2 py-1 rounded ${statusColors[status]}`}>
          {status === 'cumple' ? '✓ Cumple' : status === 'parcial' ? '◐ Parcial' : '✗ No cumple'}
        </span>
      )}
    </div>
  );
}

