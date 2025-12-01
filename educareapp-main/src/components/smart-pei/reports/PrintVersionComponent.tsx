
import React from 'react';

interface PrintVersionComponentProps {
  report: {
    title: string;
    description?: string;
    content: string;
    date: string;
    studentName: string;
    author?: string;
    school?: string;
  };
}

export const PrintVersionComponent: React.FC<PrintVersionComponentProps> = ({
  report
}) => {
  const formattedDate = new Date(report.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="print-container">
      <style>
        {`
          @media print {
            .print-container {
              padding: 0;
              margin: 0;
            }
            
            @page {
              size: A4;
              margin: 2cm;
            }
          }
        `}
      </style>
      
      <div className="mb-8 text-center border-b pb-6">
        <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
        {report.description && (
          <p className="text-muted-foreground">{report.description}</p>
        )}
      </div>
      
      <div className="mb-6 flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Aluno:</span>
          <span>{report.studentName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Data:</span>
          <span>{formattedDate}</span>
        </div>
        {report.author && (
          <div className="flex justify-between">
            <span className="font-medium">Autor:</span>
            <span>{report.author}</span>
          </div>
        )}
        {report.school && (
          <div className="flex justify-between">
            <span className="font-medium">Escola:</span>
            <span>{report.school}</span>
          </div>
        )}
      </div>
      
      <div 
        className="report-content print-content" 
        dangerouslySetInnerHTML={{ __html: report.content }}
      />
      
      <div className="mt-8 pt-6 border-t">
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 border-b border-black mb-2 mt-20"></div>
          <p className="text-center text-sm">Assinatura do Responsável</p>
        </div>
      </div>
    </div>
  );
};

export default PrintVersionComponent;
