
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIReportGenerationOptions } from '@/utils/ai-service';
import { FileText, BookOpen, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIReportPreviewProps {
  reportContent: string;
  options: AIReportGenerationOptions;
  onDownload?: () => void;
  onPrint?: () => void;
}

export const AIReportPreview: React.FC<AIReportPreviewProps> = ({ 
  reportContent,
  options,
  onDownload,
  onPrint
}) => {
  // Convert markdown to HTML for better display
  const htmlContent = convertMarkdownToHTML(reportContent);
  
  return (
    <Card className="report-preview border-2">
      <div className="flex items-center justify-between border-b p-2 bg-background">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-medium">Prévia do Relatório</span>
        </div>
        <div className="flex space-x-2">
          {onPrint && (
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div 
            className="p-6 prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </ScrollArea>
      </CardContent>
      <div className="border-t p-2 flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
        <BookOpen className="h-3 w-3 mr-1" />
        <span>
          {options.detailLevel === 'concise' ? 'Relatório Conciso' : 
           options.detailLevel === 'detailed' ? 'Relatório Detalhado' : 
           'Relatório Compreensivo'} - 
          {options.tone === 'formal' ? ' Tom Formal' : 
           options.tone === 'supportive' ? ' Tom Apoiador' : 
           ' Tom Técnico'}
        </span>
      </div>
    </Card>
  );
};

// Enhanced markdown to HTML converter with better styling
function convertMarkdownToHTML(markdown: string): string {
  let html = markdown;
  
  // Convert headings
  html = html.replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold my-4 text-primary/90">$1</h2>');
  html = html.replace(/### (.*?)\n/g, '<h3 class="text-lg font-semibold my-3 text-primary/80">$1</h3>');
  
  // Convert lists
  html = html.replace(/- (.*?)(\n|$)/g, '<li class="mb-1">$1</li>');
  
  // Wrap lists in ul tags
  let inList = false;
  const lines = html.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<li>') && !inList) {
      lines[i] = '<ul class="list-disc pl-6 my-3 space-y-1">'+lines[i];
      inList = true;
    } else if (!lines[i].includes('<li>') && inList) {
      lines[i-1] = lines[i-1] + '</ul>';
      inList = false;
    }
  }
  if (inList) {
    lines.push('</ul>');
  }
  
  // Convert paragraphs
  html = lines.join('\n');
  html = html.replace(/([^\n<][^\n]+[^\n<])\n\n/g, '<p class="my-2 text-gray-700 dark:text-gray-300">$1</p>');
  
  // Convert emphasis and bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  
  // Enhance alerts and important notes
  html = html.replace(/\*Este relatório foi gerado automaticamente(.*?)\*/g, 
    '<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 my-4 text-sm text-blue-800 dark:text-blue-300">'+
    '<div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" '+
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">'+
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'+
    'Este relatório foi gerado automaticamente$1</div></div>');
  
  return html;
}

export default AIReportPreview;
