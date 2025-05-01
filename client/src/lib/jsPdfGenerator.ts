import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Client, WasteData } from '@shared/schema';
import autoTable from 'jspdf-autotable';
import { createGradientPattern } from './imageUtils';
import logoPath from '@assets/Logo-ECONOVA-OF_Blanco.png';

// Un margen adecuado mejora la legibilidad del documento
const MARGINS = {
  top: 25,
  bottom: 25,
  left: 15,
  right: 15
};

// Función auxiliar para añadir el encabezado minimalista de Econova
function addMinimalistHeader(doc: jsPDF, title: string = 'REPORTE DE GESTIÓN DE RESIDUOS') {
  // Barra superior azul 
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, 0, 210, 20, 'F');
  
  // Línea verde característica
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.rect(0, 20, 210, 2, 'F');
  
  // Logo en el encabezado
  try {
    doc.addImage(logoPath, 'PNG', 10, 2, 30, 15, undefined, 'FAST');
  } catch (error) {
    console.error('Error al añadir el logo en el encabezado:', error);
  }
  
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title, 105, 13, { align: 'center' });
}

// Función para dibujar icono de árbol más detallado
function drawTreeIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  const trunkWidth = 3 * size;
  const trunkHeight = 12 * size;
  const crownRadius = 10 * size;
  
  // Tronco
  doc.setFillColor(120, 80, 40); // Marrón para el tronco
  doc.rect(x - trunkWidth/2, y - trunkHeight/2, trunkWidth, trunkHeight, 'F');
  
  // Copa del árbol (varias capas para darle forma)
  doc.setFillColor(60, 160, 60); // Verde oscuro para la base
  doc.circle(x, y - trunkHeight/2 - crownRadius*0.5, crownRadius, 'F');
  
  doc.setFillColor(76, 175, 80); // Verde medio para el medio
  doc.circle(x, y - trunkHeight/2 - crownRadius*0.8, crownRadius*0.85, 'F');
  
  doc.setFillColor(100, 190, 90); // Verde claro para la parte superior
  doc.circle(x, y - trunkHeight/2 - crownRadius*1.1, crownRadius*0.7, 'F');
}

// Función para dibujar icono de gota de agua más detallado
function drawWaterDropIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  const dropWidth = 9 * size;
  const dropHeight = 14 * size;
  
  // Sombra para efecto 3D
  doc.setFillColor(40, 140, 200, 0.5); // Azul con transparencia
  doc.ellipse(x + 0.5, y + 0.5, dropWidth/2, dropHeight/2, 'F');
  
  // Forma principal de la gota
  doc.setFillColor(52, 152, 219); // Azul principal
  doc.ellipse(x, y, dropWidth/2, dropHeight/2, 'F');
  
  // Brillo para efecto 3D
  doc.setFillColor(120, 190, 240, 0.7); // Azul claro con transparencia
  doc.ellipse(x - dropWidth/6, y - dropHeight/6, dropWidth/6, dropHeight/6, 'F');
}

// Función para dibujar icono de rayo eléctrico más detallado
function drawLightningIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  const boltWidth = 10 * size;
  const boltHeight = 16 * size;
  
  // Puntos para un rayo detallado - Usando triángulos en su lugar ya que jsPDF no tiene polygon nativo
  
  // Forma principal del rayo - dibujarlo manualmente con triángulos
  doc.setFillColor(241, 196, 15); // Amarillo brillante
  
  // Parte superior del rayo (triángulo)
  doc.triangle(
    x, y - boltHeight/2,  // Punta superior
    x - boltWidth*0.4, y - boltHeight*0.1,  // Esquina izquierda
    x + boltWidth*0.4, y - boltHeight*0.2,  // Esquina derecha
    'F'
  );
  
  // Parte media del rayo (triángulo)
  doc.triangle(
    x - boltWidth*0.4, y - boltHeight*0.1,  // Esquina izquierda superior
    x, y + boltHeight*0.1,  // Punto medio bajo
    x + boltWidth*0.2, y - boltHeight*0.2,  // Punto medio derecho
    'F'
  );
  
  // Parte inferior del rayo (triángulo)
  doc.triangle(
    x - boltWidth*0.6, y + boltHeight*0.3,  // Punta inferior
    x - boltWidth*0.4, y - boltHeight*0.1,  // Conexión izquierda
    x, y + boltHeight*0.1,  // Conexión derecha
    'F'
  );
  
  // Brillo para efecto 3D
  doc.setFillColor(255, 230, 150, 0.7); // Amarillo claro con transparencia
  doc.circle(x - boltWidth*0.1, y - boltHeight*0.3, boltWidth*0.15, 'F');
}

// Función para dibujar icono de hoja para CO2 más detallado
function drawLeafIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  const leafWidth = 8 * size;
  const leafHeight = 14 * size;
  
  // Sombra para efecto 3D
  doc.setFillColor(30, 170, 90, 0.5); // Verde con transparencia
  doc.ellipse(x + 0.5, y + 0.5, leafWidth/2, leafHeight/2, 'F');
  
  // Forma principal de la hoja
  doc.setFillColor(46, 204, 113); // Verde brillante
  doc.ellipse(x, y, leafWidth/2, leafHeight/2, 'F');
  
  // Nervio central
  doc.setDrawColor(30, 150, 70);
  doc.setLineWidth(0.8 * size);
  doc.line(x, y - leafHeight/2, x, y + leafHeight/2);
  
  // Nervios laterales
  doc.setLineWidth(0.4 * size);
  const nerveLength = leafWidth * 0.4;
  const nerveCount = 5;
  const nerveSpacing = leafHeight / (nerveCount + 1);
  
  for (let i = 1; i <= nerveCount; i++) {
    const yPos = y - leafHeight/2 + i * nerveSpacing;
    // Nervio derecho
    doc.line(x, yPos, x + nerveLength, yPos - nerveSpacing*0.3);
    // Nervio izquierdo
    doc.line(x, yPos, x - nerveLength, yPos - nerveSpacing*0.3);
  }
}

interface ReportData {
  client: Client;
  wasteData: WasteData[];
  organicTotal: number;
  inorganicTotal: number;
  recyclableTotal: number;
  totalWaste: number;
  deviation: number;
  period: string;
}

// Colores corporativos de Econova
const COLORS = {
  navy: '#273949',      // Azul marino corporativo
  lime: '#b5e951',      // Verde lima corporativo
  lightGray: '#f8f9fa', // Fondo claro
  darkGray: '#495057',  // Texto secundario
  green: '#74c278',     // Verde para orgánicos
  blue: '#3e8cbe',      // Azul para elementos decorativos
  accent: '#e9f5d8',    // Color de acento suave
};

// Función para formatear números con separador de miles
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(num);
};

export async function generateClientPDF(data: ReportData): Promise<Blob> {
  // Crear documento PDF - exactamente 3 páginas
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ===== PÁGINA 1: PORTADA Y RESUMEN EJECUTIVO =====
  // Fondo blanco limpio para mayor minimalismo
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Barra superior con color corporativo - más compacta
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, 0, 210, 50, 'F');
  
  // Línea decorativa verde
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.rect(0, 50, 210, 3, 'F');
  
  // Añadir imagen del logo centrado
  try {
    doc.addImage(logoPath, 'PNG', 70, 8, 70, 35, undefined, 'FAST');
  } catch (error) {
    console.error('Error al añadir el logo:', error);
  }
  
  // Título del reporte con aspecto minimalista
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.setFontSize(22);
  doc.text('REPORTE DE GESTIÓN DE RESIDUOS', 105, 70, { align: 'center' });
  
  // Línea decorativa para separar el título
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(60, 75, 150, 75);
  
  // Cliente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(data.client.name, 105, 90, { align: 'center' });
  
  // Información del periodo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(data.period, 105, 105, { align: 'center' });
  
  // INDICADORES CLAVE - Panel más compacto
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, 115, 180, 40, 3, 3, 'F');
  
  // Título de la métrica clave
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('INDICADORES CLAVE', 105, 125, { align: 'center' });
  
  // Mostrar tres indicadores clave en línea
  // 1. Desviación
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.circle(45, 140, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text(`${data.deviation.toFixed(1)}%`, 45, 143, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ÍNDICE DE DESVIACIÓN', 45, 155, { align: 'center' });
  
  // Calcular valores en toneladas
  const organicTons = data.organicTotal / 1000;
  const inorganicTons = data.inorganicTotal / 1000;
  const recyclableTons = data.recyclableTotal / 1000;
  const totalTons = data.totalWaste / 1000;
  
  // 2. Total toneladas
  doc.setFillColor(parseInt(COLORS.blue.slice(1, 3), 16), parseInt(COLORS.blue.slice(3, 5), 16), parseInt(COLORS.blue.slice(5, 7), 16), 0.8);
  doc.circle(105, 140, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(formatNumber(totalTons), 105, 143, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
  doc.text('TONELADAS TOTALES', 105, 155, { align: 'center' });
  
  // 3. Reciclaje
  doc.setFillColor(parseInt(COLORS.green.slice(1, 3), 16), parseInt(COLORS.green.slice(3, 5), 16), parseInt(COLORS.green.slice(5, 7), 16), 0.8);
  doc.circle(165, 140, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(formatNumber(recyclableTons), 165, 143, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
  doc.text('TONELADAS RECICLADAS', 165, 155, { align: 'center' });
  
  // ===== CONTENIDO PRINCIPAL - RESUMEN EJECUTIVO =====
  doc.addPage();
  
  // Usar la función auxiliar para crear el encabezado
  addMinimalistHeader(doc);
  
  // Información del cliente con estilo minimalista
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 22, 210, 18, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text(`Cliente: ${data.client.name}`, 15, 33);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Período: ${data.period}`, 105, 33);
  
  // ==== RESUMEN EJECUTIVO ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('RESUMEN EJECUTIVO', 105, 50, { align: 'center' });
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(65, 53, 145, 53);
  
  // Panel minimalista para el resumen
  doc.setFillColor(parseInt(COLORS.accent.slice(1, 3), 16), parseInt(COLORS.accent.slice(3, 5), 16), parseInt(COLORS.accent.slice(5, 7), 16));
  doc.roundedRect(MARGINS.left, 60, 210 - MARGINS.left - MARGINS.right, 55, 2, 2, 'F');
  
  // Texto del resumen ejecutivo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
  
  // Calcular toneladas a relleno sanitario (ya tenemos los valores por separado)
  const landfillTons = organicTons + inorganicTons;
  
  const recyclablePercentage = (data.recyclableTotal / data.totalWaste * 100).toFixed(1);
  const organicPercentage = (data.organicTotal / data.totalWaste * 100).toFixed(1);
  
  // Calcular tendencia (comparando primera mitad con segunda mitad del período)
  const sortedData = [...data.wasteData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const midpoint = Math.floor(sortedData.length / 2);
  const firstHalf = sortedData.slice(0, midpoint);
  const secondHalf = sortedData.slice(midpoint);
  
  const firstHalfTotal = firstHalf.reduce((sum, item) => sum + (item.organicWaste || 0) + (item.inorganicWaste || 0) + (item.recyclableWaste || 0), 0);
  const secondHalfTotal = secondHalf.reduce((sum, item) => sum + (item.organicWaste || 0) + (item.inorganicWaste || 0) + (item.recyclableWaste || 0), 0);
  
  const firstHalfAvg = firstHalfTotal / firstHalf.length;
  const secondHalfAvg = secondHalfTotal / secondHalf.length;
  
  const percentChange = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100) : 0;
  const trendDescription = percentChange > 5 ? 'aumento' : percentChange < -5 ? 'reducción' : 'estabilidad';
  
  // Crear texto del resumen ejecutivo
  const summaryText = [
    `• Durante el período ${data.period}, ${data.client.name} generó un total de ${formatNumber(totalTons)} toneladas de residuos.`,
    `• El Índice de Desviación de Relleno Sanitario fue de ${data.deviation.toFixed(1)}%, lo que indica que esta proporción`,
    `  de residuos fueron recuperados para reciclaje en lugar de enviarse al relleno sanitario.`,
    `• Del total de residuos, ${formatNumber(landfillTons)} toneladas fueron enviadas a relleno sanitario y`,
    `  ${formatNumber(recyclableTons)} toneladas a reciclaje.`,
    `• Se observa una ${trendDescription} en la generación de residuos del ${Math.abs(percentChange).toFixed(1)}% durante el período.`,
    `• El impacto ambiental positivo equivale a ${formatNumber((recyclableTons * 0.3) * 17)} árboles salvados.`
  ];
  
  // Posicionar el texto del resumen
  let yPos = 72;
  summaryText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });
  
  // ==== VISUALIZACIÓN DE DATOS ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73); // Navy
  doc.text('ANÁLISIS VISUAL DE RESIDUOS', 15, 120);
  
  // Visualizar proporciones con gráficos simples
  
  // Gráfico de barras horizontal para tipos de residuos
  doc.setFillColor(108, 185, 71); // Verde para orgánicos
  doc.rect(20, 130, (data.organicTotal / data.totalWaste) * 160, 12, 'F');
  
  doc.setFillColor(156, 156, 156); // Gris para inorgánicos
  doc.rect(20, 147, (data.inorganicTotal / data.totalWaste) * 160, 12, 'F');
  
  doc.setFillColor(181, 233, 81); // Lime para reciclables
  doc.rect(20, 164, (data.recyclableTotal / data.totalWaste) * 160, 12, 'F');
  
  // Etiquetas para el gráfico
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text('Orgánicos (Comedor)', 20, 128);
  doc.text(`${formatNumber(data.organicTotal/1000)} ton (${organicPercentage}%)`, 182, 136, { align: 'right' });
  
  doc.text('Inorgánicos', 20, 145);
  doc.text(`${formatNumber(data.inorganicTotal/1000)} ton (${(data.inorganicTotal / data.totalWaste * 100).toFixed(1)}%)`, 182, 153, { align: 'right' });
  
  doc.text('Reciclables', 20, 162);
  doc.text(`${formatNumber(data.recyclableTotal/1000)} ton (${recyclablePercentage}%)`, 182, 170, { align: 'right' });
  
  // Gráfico circular para destino de residuos (Relleno sanitario vs Reciclaje)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(39, 57, 73);
  doc.text('Destino de Residuos', 105, 190, { align: 'center' });
  
  // Dibujar un círculo dividido (simplificado)
  const centerX = 105;
  const centerY = 215;
  const radius = 25;
  
  // Porcentaje a relleno sanitario (orgánico + inorgánico)
  const landfillPercentage = (data.organicTotal + data.inorganicTotal) / data.totalWaste;
  const recyclePercentage = data.recyclableTotal / data.totalWaste;
  
  // Dibujar sector para relleno sanitario
  doc.setFillColor(156, 156, 156); // Gris
  doc.circle(centerX, centerY, radius, 'F');
  
  // Dibujar sector para reciclaje
  doc.setFillColor(181, 233, 81); // Lime
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  
  // Crear un "pie slice" simulado
  const angle = recyclePercentage * Math.PI * 2;
  doc.ellipse(centerX, centerY, radius, radius, 'F');
  doc.setFillColor(156, 156, 156);
  
  // Método simplificado para dibujar un sector circular
  // (Esta es una aproximación simplificada para jsPDF)
  doc.triangle(
    centerX, 
    centerY, 
    centerX + radius * Math.cos(0), 
    centerY + radius * Math.sin(0), 
    centerX + radius * Math.cos(angle), 
    centerY + radius * Math.sin(angle), 
    'F'
  );
  
  // Dibujar dos rectángulos para la leyenda
  doc.setFillColor(156, 156, 156);
  doc.rect(centerX - 50, centerY + 35, 10, 5, 'F');
  doc.setFillColor(181, 233, 81);
  doc.rect(centerX + 10, centerY + 35, 10, 5, 'F');
  
  // Agregar texto para la leyenda
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Relleno Sanitario (${(landfillPercentage * 100).toFixed(1)}%)`, centerX - 35, centerY + 39);
  doc.text(`Reciclaje (${(recyclePercentage * 100).toFixed(1)}%)`, centerX + 25, centerY + 39);
  
  // ==== ÍNDICE DE DESVIACIÓN ====
  // Añadir nueva página para el resto del contenido
  doc.addPage();
  
  // Usar la función auxiliar para crear el encabezado
  addMinimalistHeader(doc);
  
  // Título de la sección
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(39, 57, 73); // Navy
  doc.text('ÍNDICE DE DESVIACIÓN', 105, 40, { align: 'center' });
  
  // Elemento decorativo
  doc.setDrawColor(181, 233, 81); // Lime
  doc.setLineWidth(2);
  doc.line(75, 45, 135, 45);
  
  // Subtítulo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Medición del desempeño en la gestión de residuos', 105, 55, { align: 'center' });
  
  // Crear un indicador visual para el índice de desviación
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(15);
  doc.line(40, 80, 160, 80);
  
  // Dibujar la línea de progreso
  const deviationWidth = Math.min(120, (data.deviation / 100) * 120);
  doc.setDrawColor(181, 233, 81);
  doc.setLineWidth(15);
  doc.line(40, 80, 40 + deviationWidth, 80);
  
  // Añadir marcadores
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  // Marcadores de porcentaje
  doc.text('0%', 40, 95);
  doc.text('25%', 70, 95);
  doc.text('50%', 100, 95);
  doc.text('75%', 130, 95);
  doc.text('100%', 160, 95);
  
  // Valor actual
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(39, 57, 73);
  doc.text(`${data.deviation.toFixed(1)}%`, 105, 75, { align: 'center' });
  
  // Explicación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const deviationExplanation = [
    'El Índice de Desviación representa el porcentaje de residuos que son desviados del relleno sanitario',
    'mediante el reciclaje. Un mayor índice indica un mejor desempeño ambiental.',
    '',
    'Cálculo: (Residuos Reciclables / Residuos Totales) × 100'
  ];
  
  let yPosDeviation = 110;
  deviationExplanation.forEach(line => {
    doc.text(line, 15, yPosDeviation);
    yPosDeviation += 5;
  });
  
  // ==== IMPACTO AMBIENTAL ====
  // Añadir nueva página para el impacto ambiental
  doc.addPage();
  
  // Usar la función auxiliar para crear el encabezado
  addMinimalistHeader(doc);
  
  // Banner del impacto ambiental con degradado atractivo
  // Crear un rectángulo con degradado verde a azul marino para la sección de impacto
  createGradientPattern(doc, 0, 30, 210, 25, COLORS.lime, COLORS.navy, 'horizontal');
  
  // Título con mayor impacto visual
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('IMPACTO AMBIENTAL POSITIVO', 105, 47, { align: 'center' });
  
  // Línea decorativa bajo el título
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1);
  doc.line(65, 51, 145, 51);
  
  // Añadir un fondo con textura suave para toda la página
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 55, 210, 242, 'F');
  
  // Marco para los indicadores visuales
  doc.setDrawColor(181, 233, 81); // Verde lima
  doc.setLineWidth(1.5);
  doc.roundedRect(15, 65, 180, 120, 5, 5, 'S');
  
  // Calcular impacto ambiental
  const paperRecycled = data.recyclableTotal * 0.3; // Asumiendo que el 30% de los reciclables es papel
  const treesSaved = (paperRecycled / 1000) * 17; // 17 árboles salvados por tonelada de papel reciclado
  const waterSaved = (paperRecycled / 1000) * 26000; // 26,000 litros de agua por tonelada de papel
  const energySaved = data.recyclableTotal * 5.3; // 5.3 kWh por kg de reciclables
  const co2Reduced = data.recyclableTotal * 2.5; // 2.5 kg de CO2 por kg de residuos reciclados
  
  // Título de impacto con degradado suave
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16), 0.1);
  doc.roundedRect(20, 70, 170, 20, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(39, 57, 73);
  doc.text('BENEFICIOS AMBIENTALES DE LA RECUPERACIÓN', 105, 82, { align: 'center' });
  
  // ÁREA DE ICONOS E INDICADORES - CUATRO PANELES VISUALES
  // Primer panel - Árboles salvados
  doc.setFillColor(230, 245, 230); // Fondo verde claro
  doc.roundedRect(25, 100, 75, 35, 3, 3, 'F');
  
  // Usar la función para dibujar un árbol
  const treeX = 40;
  const treeY = 118;
  drawTreeIcon(doc, treeX, treeY, 0.8);
  
  // Valor y etiqueta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  const treesValue = Math.round(treesSaved);
  doc.text(formatNumber(treesValue), 85, 115, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('ÁRBOLES SALVADOS', 85, 125, { align: 'right' });
  
  // Segundo panel - Agua ahorrada
  doc.setFillColor(230, 240, 250); // Fondo azul claro
  doc.roundedRect(110, 100, 75, 35, 3, 3, 'F');
  
  // Dibujar un icono de gota de agua
  const dropX = 125;
  const dropY = 118;
  
  // Usar la función para dibujar una gota de agua detallada
  drawWaterDropIcon(doc, dropX, dropY, 0.8);
  
  // Valor y etiqueta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  // Convertir a miles de litros para una presentación más limpia
  const waterKL = Math.round(waterSaved / 1000);
  doc.text(formatNumber(waterKL), 170, 115, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('MILES DE LITROS AHORRADOS', 170, 125, { align: 'right' });
  
  // Tercer panel - Energía ahorrada
  doc.setFillColor(255, 248, 225); // Fondo amarillo claro
  doc.roundedRect(25, 145, 75, 35, 3, 3, 'F');
  
  // Dibujar un icono de rayo usando nuestra función auxiliar
  const boltX = 40;
  const boltY = 162;
  drawLightningIcon(doc, boltX, boltY, 0.8);
  
  // Valor y etiqueta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  const energyMWh = Math.round(energySaved / 1000); // Convertir a MWh para números más limpios
  doc.text(formatNumber(energyMWh), 85, 162, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('MWh DE ENERGÍA AHORRADOS', 85, 172, { align: 'right' });
  
  // Cuarto panel - CO2 reducido
  doc.setFillColor(231, 245, 241); // Fondo verde-azulado claro
  doc.roundedRect(110, 145, 75, 35, 3, 3, 'F');
  
  // Dibujar un icono de hoja para representar CO2 usando nuestra función auxiliar
  const leafX = 125;
  const leafY = 162;
  drawLeafIcon(doc, leafX, leafY, 0.8);
  
  // Valor y etiqueta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  const co2Tons = Math.round(co2Reduced / 1000);
  doc.text(formatNumber(co2Tons), 170, 162, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('TON CO₂ NO EMITIDAS', 170, 172, { align: 'right' });
  
  // SECCIÓN DE EQUIVALENCIAS VISUALES
  // Fondo degradado suave para la sección de equivalencias
  doc.setFillColor(parseInt(COLORS.accent.slice(1, 3), 16), parseInt(COLORS.accent.slice(3, 5), 16), parseInt(COLORS.accent.slice(5, 7), 16), 0.7);
  doc.roundedRect(15, 195, 180, 75, 5, 5, 'F');
  
  // Título más llamativo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(39, 57, 73);
  doc.text('EQUIVALENCIAS DE IMPACTO', 105, 207, { align: 'center' });
  
  // Línea decorativa bajo título
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(65, 210, 145, 210);
  
  // Iconos para cada equivalencia - Mucho más visuales
  // Bosque - pequeño icono de árbol 
  drawTreeIcon(doc, 30, 222, 0.4);
  
  // Persona - pequeño icono estilizado de persona
  // Cabeza
  doc.setFillColor(52, 152, 219);
  doc.circle(30, 233, 2, 'F');
  // Cuerpo
  doc.setLineWidth(1.5);
  doc.setDrawColor(52, 152, 219);
  doc.line(30, 235, 30, 241);
  // Brazos
  doc.line(30, 237, 27, 240);
  doc.line(30, 237, 33, 240);
  // Piernas
  doc.line(30, 241, 28, 245);
  doc.line(30, 241, 32, 245);
  
  // Casa - icono de casa
  // Base de la casa
  doc.setFillColor(241, 196, 15);
  doc.rect(27, 252, 6, 4, 'F');
  // Techo
  doc.setFillColor(241, 150, 15);
  doc.triangle(
    26, 252, // Esquina izquierda
    30, 248, // Punto superior
    34, 252, // Esquina derecha
    'F'
  );
  // Puerta
  doc.setFillColor(150, 120, 10);
  doc.rect(29, 253, 2, 3, 'F');
  
  // Coche - icono de auto
  // Cuerpo del auto
  doc.setFillColor(46, 204, 113);
  doc.roundedRect(120, 236, 8, 3, 1, 1, 'F');
  // Cabina
  doc.setFillColor(32, 184, 93);
  doc.roundedRect(122, 234, 4, 2, 1, 1, 'F');
  // Ruedas - cambiando de negro a gris oscuro
  doc.setFillColor(80, 90, 100);
  doc.circle(121.5, 239, 1, 'F');
  doc.circle(126.5, 239, 1, 'F');
  
  // Texto explicativo con formato mejorado
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  
  // Crear recuadros para cada equivalencia
  doc.setFillColor(240, 248, 240);
  doc.roundedRect(38, 216, 130, 14, 1, 1, 'F');
  
  doc.setFillColor(235, 245, 255);
  doc.roundedRect(38, 231, 70, 14, 1, 1, 'F');
  
  doc.setFillColor(255, 248, 230);
  doc.roundedRect(38, 246, 70, 14, 1, 1, 'F');
  
  doc.setFillColor(230, 250, 240);
  doc.roundedRect(115, 231, 70, 14, 1, 1, 'F');
  
  // Bosque
  const hectares = (treesSaved / 400).toFixed(1);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(76, 175, 80);
  doc.text(`BOSQUE DE ${hectares} HECTÁREAS`, 105, 223, { align: 'center' });
  
  // Agua
  const people = Math.round(waterSaved / 73000);
  doc.setTextColor(52, 152, 219);
  doc.text(`AGUA PARA ${formatNumber(people)} PERSONAS/AÑO`, 73, 238, { align: 'center' });
  
  // Energía
  const homes = Math.round(energySaved / 1200);
  doc.setTextColor(241, 150, 15);
  doc.text(`ENERGÍA PARA ${formatNumber(homes)} HOGARES/MES`, 73, 253, { align: 'center' });
  
  // CO2
  const cars = Math.round((co2Reduced / 1000) / 4.6);
  doc.setTextColor(46, 204, 113);
  doc.text(`${formatNumber(cars)} AUTOS MENOS/AÑO`, 150, 238, { align: 'center' });
  
  // ==== DETALLE MENSUAL ====
  doc.addPage();
  
  // Usar la función auxiliar para crear el encabezado
  addMinimalistHeader(doc);
  
  // Título de la sección
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text('DETALLE MENSUAL', 105, 40, { align: 'center' });
  
  // Elemento decorativo
  doc.setDrawColor(181, 233, 81); // Lime
  doc.setLineWidth(2);
  doc.line(75, 45, 135, 45);
  
  // Agrupar datos por mes y año
  const monthlyData: Record<string, { 
    organicWaste: number, 
    inorganicWaste: number, 
    recyclableWaste: number,
    date: Date
  }> = {};
  
  data.wasteData.forEach(item => {
    const date = new Date(item.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        organicWaste: 0,
        inorganicWaste: 0,
        recyclableWaste: 0,
        date
      };
    }
    
    monthlyData[monthYear].organicWaste += (item.organicWaste || 0);
    monthlyData[monthYear].inorganicWaste += (item.inorganicWaste || 0);
    monthlyData[monthYear].recyclableWaste += (item.recyclableWaste || 0);
  });
  
  // Preparar datos para la tabla
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const monthlyRows = Object.entries(monthlyData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthName = monthNames[parseInt(month) - 1];
      const total = data.organicWaste + data.inorganicWaste + data.recyclableWaste;
      const toSanitaryLandfill = data.organicWaste + data.inorganicWaste;
      const deviation = toSanitaryLandfill > 0 ? (data.recyclableWaste / total) * 100 : 0;
      
      return [
        `${monthName} ${year}`,
        formatNumber(data.organicWaste / 1000), // Mostrar en toneladas
        formatNumber(data.inorganicWaste / 1000),
        formatNumber(data.recyclableWaste / 1000),
        formatNumber(total / 1000),
        `${deviation.toFixed(2)}%`
      ];
    });
  
  // Añadir la tabla de detalle mensual
  autoTable(doc, {
    startY: 60,
    head: [['Mes/Año', 'Orgánico (ton)', 'Inorgánico (ton)', 'Reciclable (ton)', 'Total (ton)', 'Desviación']],
    body: monthlyRows,
    headStyles: {
      fillColor: [39, 57, 73], // Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250], // Light gray
    },
    styles: {
      cellPadding: 5,
      fontSize: 9,
    },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
    },
  });
  
  // Pie de página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Reporte generado por Econova - Página ${i} de ${totalPages}`, 105, 285, { align: 'center' });
  }
  
  // Devolver como blob
  return doc.output('blob');
}

export function downloadPDF(pdfBlob: Blob, fileName: string): void {
  // Crear un objeto URL para el blob
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  // Crear un enlace temporal
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  
  // Simular un clic en el enlace para iniciar la descarga
  document.body.appendChild(link);
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

export async function generateAndDownloadPDFReport(client: Client, wasteData: WasteData[]): Promise<void> {
  // Calcular totales
  const organicTotal = wasteData.reduce((sum, item) => sum + (item.organicWaste || 0), 0);
  const inorganicTotal = wasteData.reduce((sum, item) => sum + (item.inorganicWaste || 0), 0);
  const recyclableTotal = wasteData.reduce((sum, item) => sum + (item.recyclableWaste || 0), 0);
  const totalWaste = organicTotal + inorganicTotal + recyclableTotal;
  
  // Calcular desviación (recyclableWaste / (organicWaste + inorganicWaste)) * 100
  const toSanitaryLandfill = organicTotal + inorganicTotal;
  const deviation = toSanitaryLandfill > 0 ? (recyclableTotal / toSanitaryLandfill) * 100 : 0;
  
  // Determinar el periodo del reporte
  const formatMonth = (date: Date) => date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  const sortedData = [...wasteData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let period = 'Reporte Completo';
  if (sortedData.length > 0) {
    const firstDate = new Date(sortedData[0].date);
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    if (firstDate.getFullYear() === lastDate.getFullYear() && firstDate.getMonth() === lastDate.getMonth()) {
      period = formatMonth(firstDate);
    } else {
      period = `${formatMonth(firstDate)} - ${formatMonth(lastDate)}`;
    }
  }
  
  // Preparar datos para el reporte
  const reportData: ReportData = {
    client,
    wasteData,
    organicTotal,
    inorganicTotal,
    recyclableTotal,
    totalWaste,
    deviation,
    period
  };
  
  // Generar y descargar el PDF
  const pdfBlob = await generateClientPDF(reportData);
  downloadPDF(pdfBlob, `Reporte_${client.name.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`);
}