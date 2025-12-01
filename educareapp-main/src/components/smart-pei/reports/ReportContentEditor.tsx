
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportContentEditorProps {
  title: string;
  studentName: string;
  content: string;
  onChange: (content: string) => void;
}

export const ReportContentEditor: React.FC<ReportContentEditorProps> = ({
  title,
  studentName,
  content,
  onChange
}) => {
  // This simple version doesn't include a real rich text editor
  // In a real implementation, we would integrate with a rich text editor library
  
  useEffect(() => {
    // If there's no content yet, initialize with a template
    if (!content && title && studentName) {
      const template = `
<h2>${title}</h2>
<p>Relatório para: ${studentName}</p>
<p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>

<h3>Introdução</h3>
<p>Este relatório apresenta uma análise do desenvolvimento e progresso educacional do aluno.</p>

<h3>Pontos Fortes</h3>
<ul>
  <li>Ponto forte 1</li>
  <li>Ponto forte 2</li>
  <li>Ponto forte 3</li>
</ul>

<h3>Áreas para Desenvolvimento</h3>
<ul>
  <li>Área 1</li>
  <li>Área 2</li>
  <li>Área 3</li>
</ul>

<h3>Conclusão</h3>
<p>Considerações finais sobre o progresso e recomendações para o próximo período.</p>
`;
      onChange(template);
    }
  }, [title, studentName, content, onChange]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Conteúdo do Relatório</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-content">Conteúdo</Label>
            <div className="border rounded-md min-h-[300px] overflow-auto p-4">
              <textarea
                id="report-content"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-[500px] resize-none border-0 focus:ring-0 focus:outline-none"
                placeholder="Conteúdo do relatório..."
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Dica: Este editor suporta formatação HTML básica para estruturar seu relatório.
            </p>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-md">
            <h3 className="text-sm font-medium mb-2">Visualização</h3>
            <div 
              className="prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportContentEditor;
