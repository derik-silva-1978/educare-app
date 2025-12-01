
import { PEIGoal } from '@/hooks/usePEI';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

// Handle print goal report
export const printGoalReport = (goal: PEIGoal, printRef: React.RefObject<HTMLDivElement>) => {
  if (!printRef.current) return false;
  
  const printContents = printRef.current.innerHTML;
  
  // Create a print-specific stylesheet
  const styleSheet = `
    <style>
      @media print {
        body { font-family: Arial, sans-serif; }
        .print-header { margin-bottom: 20px; }
        .print-title { font-size: 18px; font-weight: bold; }
        .print-subtitle { font-size: 14px; color: #666; }
        .print-date { font-size: 12px; color: #888; text-align: right; }
        .print-section { margin-bottom: 15px; }
        .print-section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .progress-record { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .progress-date { font-weight: bold; }
        .progress-status { font-style: italic; }
        .progress-notes { margin-top: 5px; }
      }
    </style>
  `;
  
  // Create print content with custom formatting
  const goalStatusText = {
    'not_started': 'Não Iniciado',
    'in_progress': 'Em Progresso',
    'achieved': 'Alcançado',
    'canceled': 'Cancelado'
  }[goal.status];
  
  const progressStatusText = {
    'regression': 'Regressão',
    'no_change': 'Sem Alteração',
    'minor_progress': 'Progresso Mínimo',
    'significant_progress': 'Progresso Significativo',
    'achieved': 'Objetivo Alcançado'
  };
  
  const printContent = `
    <div class="print-container">
      ${styleSheet}
      <div class="print-header">
        <div class="print-title">Relatório de Progresso do Objetivo</div>
        <div class="print-subtitle">${goal.title}</div>
        <div class="print-date">Gerado em: ${format(new Date(), 'PPP', { locale: pt })}</div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Informações do Objetivo</div>
        <p><strong>Descrição:</strong> ${goal.description}</p>
        <p><strong>Domínio:</strong> ${goal.domain}</p>
        <p><strong>Status:</strong> ${goalStatusText}</p>
        <p><strong>Data Alvo:</strong> ${format(new Date(goal.targetDate), 'PPP', { locale: pt })}</p>
        <p><strong>Método de Avaliação:</strong> ${goal.evaluationMethod}</p>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Estratégias</div>
        ${goal.strategies.map(strategy => `
          <div class="strategy-item">
            <p><strong>Descrição:</strong> ${strategy.description}</p>
            <p><strong>Recursos:</strong> ${strategy.resources}</p>
            <p><strong>Responsável:</strong> ${strategy.responsible}</p>
            <p><strong>Frequência:</strong> ${strategy.frequency}</p>
          </div>
        `).join('') || '<p>Nenhuma estratégia definida</p>'}
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Registros de Progresso</div>
        ${goal.progress.map(record => `
          <div class="progress-record">
            <span class="progress-date">${format(new Date(record.date), 'PPP', { locale: pt })}</span> - 
            <span class="progress-status">${progressStatusText[record.status] || record.status}</span>
            <div class="progress-notes">${record.notes}</div>
            ${record.evidence ? `<div><strong>Evidências:</strong> ${record.evidence}</div>` : ''}
          </div>
        `).join('') || '<p>Nenhum registro de progresso</p>'}
      </div>
    </div>
  `;
  
  // Set up the print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Relatório de Progresso - ${goal.title}</title>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  
  return true;
};
