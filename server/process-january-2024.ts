import * as path from 'path';
import * as fs from 'fs';
import { processPDFDocument } from './pdf-processor';
import { storage } from './storage';

// Archivo a procesar
const fileName = '2024-01 CCCM - Bitácora de RSR.pdf';
const assetsDir = path.resolve(process.cwd(), 'attached_assets');
const pdfPath = path.join(assetsDir, fileName);

// Función para procesar solo el PDF de enero 2024
async function processJanuary2024PDF() {
  console.log('Iniciando procesamiento del PDF de enero 2024...');
  
  // Crear un directorio para los documentos procesados si no existe
  const processedDir = path.resolve(process.cwd(), 'processed_pdfs');
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
  }
  
  // Procesar el PDF
  try {
    const clientId = 4; // ID del cliente Club Campestre
    
    // Primero, crear el documento en la base de datos
    const fileStats = fs.statSync(pdfPath);
    const documentData = {
      fileName: fileName,
      fileSize: fileStats.size,
      clientId,
      processed: true,
      processingError: null
    };
    
    // Crear el documento
    const document = await storage.createDocument(documentData);
    console.log(`Documento creado con ID: ${document.id}`);
    
    // Procesar el PDF con el ID de documento correcto
    const wasteData = await processPDFDocument(pdfPath, clientId, document.id);
    
    if (wasteData) {
      console.log('Archivo procesado con éxito:');
      console.log(`- Residuos orgánicos: ${wasteData.organicWaste} kg`);
      console.log(`- Residuos inorgánicos: ${wasteData.inorganicWaste} kg`);
      console.log(`- Residuos reciclables: ${wasteData.recyclableWaste} kg`);
      console.log(`- Total: ${wasteData.totalWaste} kg`);
      console.log(`- Desviación de relleno sanitario: ${wasteData.deviation}%`);
      console.log(`- Fecha: ${wasteData.date}`);
      
      // Copiar el archivo al directorio de procesados para tener un registro
      const destPath = path.join(processedDir, fileName.replace(/\s+/g, '-'));
      fs.copyFile(pdfPath, destPath, (err) => {
        if (err) console.error(`Error al copiar archivo a procesados: ${err}`);
        else console.log(`Archivo copiado a: ${destPath}`);
      });
    } else {
      console.log('Error al procesar el archivo.');
    }
  } catch (error) {
    console.error('Error al procesar el PDF:', error);
  }
  
  console.log('\nProcesamiento completado.');
}

// Ejecutar el procesamiento
processJanuary2024PDF()
  .then(() => {
    console.log('Procesamiento del PDF de enero 2024 completado con éxito.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en el procesamiento:', error);
    process.exit(1);
  });