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
  // Crear documento PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // ===== PORTADA MINIMALISTA =====
  // Fondo blanco limpio para mayor minimalismo
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Barra superior con color corporativo
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, 0, 210, 70, 'F');
  
  // Línea decorativa verde
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.rect(0, 70, 210, 3, 'F');
  
  // Añadir imagen del logo centrado
  try {
    doc.addImage(logoPath, 'PNG', 70, 15, 70, 35, undefined, 'FAST');
  } catch (error) {
    console.error('Error al añadir el logo:', error);
  }
  
  // Título del reporte con aspecto minimalista
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.setFontSize(24);
  doc.text('REPORTE DE GESTIÓN DE RESIDUOS', 105, 100, { align: 'center' });
  
  // Línea decorativa para separar el título
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(60, 105, 150, 105);
  
  // Cliente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(data.client.name, 105, 125, { align: 'center' });
  
  // Información del periodo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(data.period, 105, 140, { align: 'center' });
  
  // Destacar el índice de desviación - métrica clave
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(30, 160, 150, 80, 3, 3, 'F');
  
  // Título de la métrica clave
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('INDICADORES CLAVE', 105, 175, { align: 'center' });
  
  // Círculo verde para el índice de desviación
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.circle(60, 200, 18, 'F');
  
  // Valor de desviación destacado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text(`${data.deviation.toFixed(1)}%`, 60, 204, { align: 'center' });
  
  // Etiqueta de desviación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('ÍNDICE DE DESVIACIÓN', 60, 225, { align: 'center' });
  
  // Información adicional destacada para la portada
  const portalTotalTons = data.totalWaste / 1000;
  const portalRecyclableTons = data.recyclableTotal / 1000;
  
  // Total toneladas
  doc.setFillColor(parseInt(COLORS.blue.slice(1, 3), 16), parseInt(COLORS.blue.slice(3, 5), 16), parseInt(COLORS.blue.slice(5, 7), 16), 0.8);
  doc.circle(150, 200, 18, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(formatNumber(portalTotalTons), 150, 200, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
  doc.text('TONELADAS TOTALES', 150, 225, { align: 'center' });
  
  // Pie de página minimalista
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('ECONOVA © 2025 | Innovando en Gestión Ambiental', 105, 280, { align: 'center' });
  
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
  
  // Cálculos para el resumen ejecutivo (valores en toneladas para más impacto)
  const organicTons = data.organicTotal / 1000;
  const inorganicTons = data.inorganicTotal / 1000;
  const recyclableTons = data.recyclableTotal / 1000;
  const totalTons = data.totalWaste / 1000;
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
  
  // Título de la sección con fondo degradado para destacar
  doc.setFillColor(39, 57, 73); // Navy
  doc.roundedRect(15, 35, 180, 12, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('IMPACTO AMBIENTAL POSITIVO', 105, 44, { align: 'center' });
  
  // Calcular impacto ambiental
  const paperRecycled = data.recyclableTotal * 0.3; // Asumiendo que el 30% de los reciclables es papel
  const treesSaved = (paperRecycled / 1000) * 17; // 17 árboles salvados por tonelada de papel reciclado
  const waterSaved = (paperRecycled / 1000) * 26000; // 26,000 litros de agua por tonelada de papel
  const energySaved = data.recyclableTotal * 5.3; // 5.3 kWh por kg de reciclables
  const co2Reduced = data.recyclableTotal * 2.5; // 2.5 kg de CO2 por kg de residuos reciclados
  
  // Crear visualizaciones de impacto ambiental
  // Contenedor para los indicadores del impacto
  doc.setFillColor(245, 250, 255);
  doc.roundedRect(15, 55, 180, 120, 3, 3, 'F');
  
  // Título interior
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(39, 57, 73);
  doc.text('BENEFICIOS AMBIENTALES DE LA RECUPERACIÓN DE MATERIALES', 105, 65, { align: 'center' });
  
  // Árboles - círculo verde
  doc.setFillColor(108, 185, 71);
  doc.circle(45, 85, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(treesSaved), 105, 85, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Árboles salvados', 120, 85);
  
  // Agua - círculo azul
  doc.setFillColor(66, 139, 202);
  doc.circle(45, 110, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(waterSaved), 105, 110, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Litros de agua ahorrados', 120, 110);
  
  // Energía - círculo amarillo
  doc.setFillColor(241, 196, 15);
  doc.circle(45, 135, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(energySaved), 105, 135, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('kWh de energía ahorrados', 120, 135);
  
  // CO2 - círculo azul claro
  doc.setFillColor(52, 152, 219);
  doc.circle(45, 160, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(co2Reduced / 1000), 105, 160, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Ton CO₂ no emitidas', 120, 160);
  
  // Equivalencias visuales
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 185, 180, 70, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(39, 57, 73);
  doc.text('EQUIVALENCIAS', 105, 195, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Texto explicativo
  const impactText = [
    `• Los ${formatNumber(treesSaved)} árboles salvados equivalen a un bosque de aproximadamente ${formatNumber(treesSaved / 400)} hectáreas.`,
    `• El ahorro de ${formatNumber(waterSaved)} litros de agua representa el consumo anual de ${formatNumber(waterSaved / 73000)} personas.`,
    `• La energía ahorrada de ${formatNumber(energySaved)} kWh es suficiente para abastecer ${formatNumber(energySaved / 1200)} hogares durante un mes.`,
    `• La reducción de ${formatNumber(co2Reduced / 1000)} toneladas de CO₂ equivale a retirar de circulación ${formatNumber((co2Reduced / 1000) / 4.6)} automóviles durante un año.`
  ];
  
  let yPosImpact = 210;
  impactText.forEach(line => {
    doc.text(line, 20, yPosImpact);
    yPosImpact += 10;
  });
  
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