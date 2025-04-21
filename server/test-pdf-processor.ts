import * as path from 'path';
import * as fs from 'fs';
import { processPDFDocument } from './pdf-processor';
import { storage } from './storage';
import { InsertDocument } from '@shared/schema';

// Directorio donde se encuentran los PDFs
const assetsDir = path.resolve(process.cwd(), 'attached_assets');

// Función principal para probar el procesamiento de PDFs
async function testPDFProcessor() {
  console.log('Iniciando prueba de procesamiento de PDFs...');
  
  // Lista todos los archivos PDF en el directorio de assets
  const files = fs.readdirSync(assetsDir)
    .filter(file => file.endsWith('.pdf'));
  
  console.log(`Encontrados ${files.length} archivos PDF para procesar:`);
  
  // Crear un directorio temporal para los uploads si no existe
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Procesar cada archivo
  for (const file of files) {
    console.log(`\nProcesando ${file}...`);
    
    // Ruta completa al archivo PDF
    const pdfPath = path.join(assetsDir, file);
    
    // Copiar el archivo al directorio de uploads
    const destPath = path.join(uploadsDir, file);
    fs.copyFileSync(pdfPath, destPath);
    
    // Procesar el PDF
    try {
      const clientId = 4; // ID del cliente Club Campestre
      
      // Primero, crear el documento en la base de datos
      const fileStats = fs.statSync(destPath);
      const documentData = {
        fileName: file,
        fileSize: fileStats.size,
        clientId
      };
      
      // Crear el documento
      const document = await storage.createDocument(documentData);
      console.log(`Documento creado con ID: ${document.id}`);
      
      // Procesar el PDF con el ID de documento correcto
      const wasteData = await processPDFDocument(destPath, clientId, document.id);
      
      if (wasteData) {
        console.log('Archivo procesado con éxito:');
        console.log(`- Residuos orgánicos: ${wasteData.organicWaste} kg`);
        console.log(`- Residuos inorgánicos: ${wasteData.inorganicWaste} kg`);
        console.log(`- Residuos reciclables: ${wasteData.recyclableWaste} kg`);
        console.log(`- Total: ${wasteData.totalWaste} kg`);
        console.log(`- Desviación de relleno sanitario: ${wasteData.deviation}%`);
        console.log(`- Fecha: ${wasteData.date}`);
      } else {
        console.log('Error al procesar el archivo.');
      }
    } catch (error) {
      console.error('Error al procesar el PDF:', error);
    }
  }
  
  console.log('\nPrueba completada.');
}

// Ejecutar la prueba
testPDFProcessor()
  .then(() => {
    console.log('Prueba de procesamiento de PDFs completada con éxito.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en la prueba de procesamiento de PDFs:', error);
    process.exit(1);
  });