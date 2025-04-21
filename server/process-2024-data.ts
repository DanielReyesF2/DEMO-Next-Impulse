import { InsertDocument, InsertWasteData } from '@shared/schema';
import { storage } from './storage';

// Función para calcular el porcentaje de desviación de relleno sanitario
function calculateSanitaryLandfillDeviation(
  organicWaste: number, 
  inorganicWaste: number, 
  recyclableWaste: number
): number {
  const totalWaste = organicWaste + inorganicWaste + recyclableWaste;
  if (totalWaste === 0) return 0;
  const wasteNotGoingToLandfill = organicWaste + recyclableWaste;
  const deviation = (wasteNotGoingToLandfill / totalWaste) * 100;
  return Math.round(deviation * 100) / 100;
}

// Información de los PDFs de 2024 para Club Campestre (definidos manualmente)
const pdfData2024 = [
  {
    fileName: '2024-01 CCCM - Bitácora de RSR.pdf',
    fileSize: 344664,
    date: new Date('2024-01-01'),
    organicWaste: 6432.10,
    inorganicWaste: 3521.80,
    recyclableWaste: 780.5,
    totalWaste: 10734.4,
    month: 'Enero',
    year: '2024'
  },
  {
    fileName: '2024-02 CCCM - Bitácora de RSR.pdf',
    fileSize: 309833,
    date: new Date('2024-02-01'),
    organicWaste: 5890.45,
    inorganicWaste: 3290.75,
    recyclableWaste: 765.8,
    totalWaste: 9947.0,
    month: 'Febrero',
    year: '2024'
  },
  // Agregamos el resto de los meses si se decide procesar más adelante
];

// Función principal para procesar los datos de 2024
async function process2024Data() {
  console.log('Iniciando procesamiento de datos de 2024...');
  
  // ID del cliente Club Campestre
  const clientId = 4;
  
  // Procesar datos de cada mes
  for (const pdfInfo of pdfData2024) {
    console.log(`\nProcesando datos de ${pdfInfo.month} ${pdfInfo.year}...`);
    
    try {
      // Crear el documento en la base de datos
      const documentData: InsertDocument = {
        fileName: pdfInfo.fileName,
        fileSize: pdfInfo.fileSize,
        clientId,
        processed: true,
        processingError: null
      };
      
      // Crear el documento
      const document = await storage.createDocument(documentData);
      console.log(`Documento creado con ID: ${document.id}`);
      
      // Calcular desviación
      const deviation = calculateSanitaryLandfillDeviation(
        pdfInfo.organicWaste, 
        pdfInfo.inorganicWaste, 
        pdfInfo.recyclableWaste
      );
      
      // Crear registro de datos de residuos
      const wasteData: InsertWasteData = {
        clientId,
        documentId: document.id,
        date: pdfInfo.date,
        organicWaste: pdfInfo.organicWaste,
        inorganicWaste: pdfInfo.inorganicWaste,
        recyclableWaste: pdfInfo.recyclableWaste,
        totalWaste: pdfInfo.totalWaste,
        deviation,
        rawData: {} as Record<string, any>,
        notes: `Datos para ${pdfInfo.month} ${pdfInfo.year}`
      };
      
      // Guardar en la base de datos
      const savedWasteData = await storage.createWasteData(wasteData);
      console.log('Datos procesados con éxito:');
      console.log(`- Residuos orgánicos: ${pdfInfo.organicWaste} kg`);
      console.log(`- Residuos inorgánicos: ${pdfInfo.inorganicWaste} kg`);
      console.log(`- Residuos reciclables: ${pdfInfo.recyclableWaste} kg`);
      console.log(`- Total: ${pdfInfo.totalWaste} kg`);
      console.log(`- Desviación de relleno sanitario: ${deviation}%`);
      console.log(`- Fecha: ${pdfInfo.date}`);
      console.log(`- ID de datos guardados: ${savedWasteData.id}`);
    } catch (error) {
      console.error(`Error al procesar datos de ${pdfInfo.month} ${pdfInfo.year}:`, error);
    }
  }
  
  console.log('\nProcesamiento de datos completado.');
}

// Ejecutar el procesamiento
process2024Data()
  .then(() => {
    console.log('Procesamiento de datos de 2024 completado con éxito.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en el procesamiento de datos:', error);
    process.exit(1);
  });