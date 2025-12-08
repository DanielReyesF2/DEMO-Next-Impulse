// Función para crear gradientes simulados en jsPDF
export function createGradientPattern(
  doc: any, 
  startX: number, 
  startY: number, 
  width: number, 
  height: number, 
  color1: string, 
  color2: string, 
  direction: 'horizontal' | 'vertical' | 'diagonal' = 'horizontal'
): void {
  // Convertir colores a valores RGB
  const parseColor = (color: string): [number, number, number] => {
    const hex = color.replace('#', '');
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16)
    ];
  };
  
  const [r1, g1, b1] = parseColor(color1);
  const [r2, g2, b2] = parseColor(color2);
  
  // Número de bandas para el degradado (más bandas = más suave)
  const numBands = 20;
  
  // Dimensiones de cada banda
  const bandWidth = direction === 'vertical' ? width : width / numBands;
  const bandHeight = direction === 'horizontal' ? height : height / numBands;
  
  // Dibujar bandas con colores graduales
  for (let i = 0; i < numBands; i++) {
    const ratio = i / (numBands - 1);
    
    // Interpolar colores
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    
    // Establecer el color de relleno
    doc.setFillColor(r, g, b);
    
    if (direction === 'horizontal') {
      doc.rect(startX + (i * bandWidth), startY, bandWidth, bandHeight, 'F');
    } else if (direction === 'vertical') {
      doc.rect(startX, startY + (i * bandHeight), bandWidth, bandHeight, 'F');
    } else { // diagonal
      // Para diagonal, usamos un enfoque simplificado con rectángulos
      const offset = i * (width + height) / numBands;
      doc.rect(startX + offset, startY, bandWidth, bandHeight, 'F');
    }
  }
}