import * as path from 'path';
import * as fs from 'fs';
import { processPDFDocument } from './pdf-processor';
import { storage } from './storage';

// Directorio donde se encuentran los PDFs
const assetsDir = path.resolve(process.cwd(), 'attached_assets');

// Función principal para procesar los PDFs de 2024
async function process2024PDFs() {
  console.log('Iniciando procesamiento de PDFs de 2024...');
  
  // Lista todos los archivos PDF de 2024 en el directorio de assets
  const files = fs.readdirSync(assetsDir)
    .filter(file => file.includes('2024') && file.endsWith('.pdf'));
  
  console.log(`Encontrados ${files.length} archivos PDF de 2024 para procesar:`);
  files.forEach(file => console.log(`- ${file}`));
  
  // Crear un directorio temporal para los documentos procesados si no existe
  const processedDir = path.resolve(process.cwd(), 'processed_pdfs');
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
  }
  
  // Procesar cada archivo
  for (const file of files) {
    console.log(`\nProcesando ${file}...`);
    
    // Ruta completa al archivo PDF
    const pdfPath = path.join(assetsDir, file);
    
    // Procesar el PDF
    try {
      const clientId = 4; // ID del cliente Club Campestre
      
      // Primero, crear el documento en la base de datos
      const fileStats = fs.statSync(pdfPath);
      const documentData = {
        fileName: file,
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
        const destPath = path.join(processedDir, file.replace(/\s+/g, '-'));
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
  }
  
  console.log('\nProcesamiento de PDFs de 2024 completado.');
}

// Ejecutar el procesamiento
process2024PDFs()
  .then(() => {
    console.log('Procesamiento de PDFs de 2024 completado con éxito.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en el procesamiento de PDFs de 2024:', error);
    process.exit(1);
  });