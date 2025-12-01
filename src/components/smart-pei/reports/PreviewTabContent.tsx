
import React from 'react';

interface PreviewTabContentProps {
  report: {
    title: string;
    description?: string;
    content: string;
    date: string;
    studentName: string;
    author?: string;
  };
}

export const PreviewTabContent: React.FC<PreviewTabContentProps> = ({ report }) => {
  const formattedDate = new Date(report.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
        
        {report.description && (
          <p className="text-muted-foreground">{report.description}</p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-4 text-sm">
          <div className="flex gap-2">
            <span className="font-medium">Data:</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex gap-2">
            <span className="font-medium">Aluno:</span>
            <span>{report.studentName}</span>
          </div>
          
          {report.author && (
            <div className="flex gap-2">
              <span className="font-medium">Autor:</span>
              <span>{report.author}</span>
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="prose prose-sm max-w-none" 
        dangerouslySetInnerHTML={{ __html: report.content }}
      />
    </div>
  );
};

export default PreviewTabContent;
