import { ReactNode } from 'react';
import { Download, Printer, Calendar } from 'lucide-react';

interface ReportDocumentProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  logoSrc?: string;
  period: string;
  company: string;
  standard: string;
  accentColor?: string;
  onDownload?: () => void;
}

export function ReportDocument({ 
  children, 
  title, 
  subtitle,
  logoSrc, 
  period, 
  company, 
  standard,
  accentColor = '#10B981',
  onDownload 
}: ReportDocumentProps) {
  return (
    <div className="bg-gray-100 p-4">
      {/* Controles */}
      <div className="flex justify-between items-center mb-3 max-w-[800px] mx-auto">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {period}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Documento tamaño carta */}
      <div 
        className="max-w-[800px] mx-auto bg-white shadow-xl rounded-sm print:shadow-none"
        style={{ minHeight: '1000px' }}
      >
        {/* Header compacto */}
        <div 
          className="px-8 py-6 flex justify-between items-center border-b-4"
          style={{ borderColor: accentColor }}
        >
          <div className="flex items-center gap-4">
            {logoSrc && (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: accentColor }}
              >
                {standard.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-800">{company}</div>
            <div className="text-xs text-gray-400">Reporte {period}</div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-8 py-6">
          {children}
        </div>

        {/* Footer */}
        <div className="px-8 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>Generado por Econova Platform</span>
          <span>{new Date().toLocaleDateString('es-MX')}</span>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares compactos
export function ReportSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200 uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ReportKPIRow({ items }: { items: { label: string; value: string | number; unit?: string; highlight?: boolean }[] }) {
  return (
    <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((item, i) => (
        <div key={i} className={`p-3 rounded-lg text-center ${item.highlight ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}`}>
          <div className={`text-xl font-bold ${item.highlight ? 'text-emerald-600' : 'text-gray-800'}`}>
            {item.value}
            {item.unit && <span className="text-xs font-normal text-gray-400 ml-1">{item.unit}</span>}
          </div>
          <div className="text-xs text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export function ReportMiniTable({ headers, rows }: { headers: string[]; rows: (string | number | ReactNode)[][] }) {
  return (
    <table className="w-full text-xs border-collapse mb-3">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h, i) => (
            <th key={i} className={`py-2 px-3 font-semibold text-gray-600 border-b border-gray-200 ${i > 0 ? 'text-right' : 'text-left'}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-gray-100">
            {row.map((cell, j) => (
              <td key={j} className={`py-2 px-3 ${j > 0 ? 'text-right' : ''}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ReportComparisonBar({ 
  label, 
  traditional, 
  circular, 
  unit 
}: { 
  label: string; 
  traditional: number; 
  circular: number; 
  unit: string;
}) {
  const max = Math.max(traditional, circular);
  const tradWidth = (traditional / max) * 100;
  const circWidth = (circular / max) * 100;
  const reduction = Math.round((1 - circular / traditional) * 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="text-emerald-600 font-semibold">-{reduction}%</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-16 text-xs text-gray-400">Tradicional</div>
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="bg-red-400 h-full rounded-full" style={{ width: `${tradWidth}%` }}></div>
          </div>
          <div className="w-20 text-xs text-right text-gray-600">{traditional.toLocaleString()} {unit}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 text-xs text-gray-400">Circular</div>
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${circWidth}%` }}></div>
          </div>
          <div className="w-20 text-xs text-right font-semibold text-emerald-600">{circular.toLocaleString()} {unit}</div>
        </div>
      </div>
    </div>
  );
}

export function ReportDonutChart({ 
  value, 
  total, 
  label, 
  color = '#10B981' 
}: { 
  value: number; 
  total: number; 
  label: string; 
  color?: string;
}) {
  const percent = Math.round((value / total) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <circle 
          cx="50" cy="50" r="40" 
          fill="none" 
          stroke={color} 
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dy="0.35em" className="text-lg font-bold" fill="#1F2937">
          {percent}%
        </text>
      </svg>
      <div className="text-xs text-gray-500 mt-1 text-center">{label}</div>
    </div>
  );
}

export function ReportStatusBadge({ status }: { status: 'cumple' | 'parcial' | 'pendiente' }) {
  const styles = {
    cumple: 'bg-emerald-100 text-emerald-700',
    parcial: 'bg-amber-100 text-amber-700',
    pendiente: 'bg-gray-100 text-gray-600',
  };
  const labels = {
    cumple: '✓',
    parcial: '◐',
    pendiente: '○',
  };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
