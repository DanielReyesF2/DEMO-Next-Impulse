import { QRCodeSVG } from 'qrcode.react';

interface TraceabilityQRProps {
  lotId: string;
}

export function TraceabilityQR({ lotId }: TraceabilityQRProps) {
  const reportUrl = `${window.location.origin}/report/${lotId}`;
  
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200">
      <QRCodeSVG 
        value={reportUrl}
        size={180}
        level="H"
        includeMargin={true}
        fgColor="#059669"
      />
      <p className="mt-3 text-sm text-gray-500">Escanea para ver reporte</p>
      <p className="text-xs font-mono text-gray-400 mt-1">{lotId}</p>
    </div>
  );
}
