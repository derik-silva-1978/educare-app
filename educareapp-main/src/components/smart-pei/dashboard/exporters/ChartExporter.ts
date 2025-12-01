
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

interface ExportChartOptions {
  fileName?: string;
  bgColor?: string;
}

/**
 * Exports chart data as JSON
 */
export const exportChartDataAsJSON = (data: any[], fileName = 'chart-data.json') => {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    saveAs(blob, fileName);
    return true;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return false;
  }
};

/**
 * Exports chart data as CSV
 */
export const exportChartDataAsCSV = (data: any[], fileName = 'chart-data.csv') => {
  try {
    if (!data || data.length === 0) return false;
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV string with headers
    let csvContent = headers.join(',') + '\n';
    
    // Add rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        // Handle special characters and wrap in quotes if needed
        const cell = typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        return cell;
      }).join(',');
      csvContent += row + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, fileName);
    return true;
  } catch (error) {
    console.error('Erro ao exportar dados CSV:', error);
    return false;
  }
};

/**
 * Exports chart data as Excel (XLSX)
 */
export const exportChartDataAsExcel = (data: any[], fileName = 'chart-data.xlsx') => {
  try {
    if (!data || data.length === 0) return false;
    
    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
    
    // Generate the Excel file
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (error) {
    console.error('Erro ao exportar dados Excel:', error);
    return false;
  }
};

/**
 * Exports chart as PNG image
 */
export const exportChartAsPNG = async (
  chartRef: React.RefObject<HTMLDivElement>, 
  options: ExportChartOptions = {}
) => {
  try {
    if (!chartRef.current) return false;
    
    const { fileName = 'chart.png', bgColor = '#ffffff' } = options;
    
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: bgColor,
      scale: 2, // Better quality
      logging: false,
      allowTaint: true,
      useCORS: true
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fileName);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar imagem:', error);
    return false;
  }
};
