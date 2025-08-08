
import * as XLSX from 'xlsx';

// CSV export function
export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Excel export function
export const downloadExcel = (data: any[], filename: string, sheetName: string = 'Datos de Residuos') => {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-size columns
  const colWidths = Object.keys(data[0]).map(key => {
    const maxLength = Math.max(
      key.length, // Header length
      ...data.map(row => String(row[key] || '').length)
    );
    return { width: Math.min(Math.max(maxLength + 2, 10), 50) };
  });
  
  worksheet['!cols'] = colWidths;

  // Add some styling to headers
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;
    
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "EEEEEE" } },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    };
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate and download file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Utility function to format data for export
export const formatDataForExport = (
  wasteData: any[], 
  clients: any[], 
  selectedWasteTypes: { organic: boolean; inorganic: boolean; recyclable: boolean }
) => {
  return wasteData.map(record => {
    const client = clients.find(c => c.id === record.clientId);
    const exportRecord: any = {
      'Fecha': new Date(record.date).toLocaleDateString('es-ES'),
      'Cliente': client?.name || 'N/A',
    };

    // Add waste type columns based on selection
    if (selectedWasteTypes.organic) {
      exportRecord['Residuos Orgánicos (kg)'] = record.organicWaste || 0;
    }
    if (selectedWasteTypes.inorganic) {
      exportRecord['Residuos Inorgánicos (kg)'] = record.inorganicWaste || 0;
    }
    if (selectedWasteTypes.recyclable) {
      exportRecord['Residuos Reciclables (kg)'] = record.recyclableWaste || 0;
    }

    // Always include total and deviation
    exportRecord['Total Residuos (kg)'] = record.totalWaste || 0;
    exportRecord['Desviación de Relleno Sanitario (%)'] = record.deviation || 0;
    exportRecord['Ubicación'] = record.location || 'N/A';
    exportRecord['Observaciones'] = record.observations || '';

    return exportRecord;
  });
};
