
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { JourneyBotQuestionImporter } from './JourneyBotQuestionImporter';

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  skipped: number;
}

export const JourneyBotImportTab: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const downloadTemplate = () => {
    const template = `question_text,dimension,age_min_months,age_max_months,order_index,feedback_yes,feedback_no,feedback_unknown,tips_yes,tips_no,tips_unknown,concern_level
"A criança consegue sustentar a cabeça quando está de bruços?",motor,0,3,1,"Excelente! O controle da cabeça é um marco importante do desenvolvimento motor.","Não se preocupe, cada criança tem seu próprio ritmo. Vamos trabalhar nisso juntos.","É importante observar este marco nos próximos dias.","Continue com tempo supervisionado de bruços diariamente|Use brinquedos coloridos para motivar o levantamento da cabeça","Pratique 2-3 minutos de bruços por dia|Coloque brinquedos à frente para estimular|Consulte o pediatra se não houver progresso","Observe durante as brincadeiras no tapete|Anote quando consegue levantar a cabeça|Teste em diferentes momentos do dia",1
"A criança faz sons de balbucios (ba-ba, ma-ma)?",language,3,6,2,"Maravilhoso! Os balbucios são os primeiros passos para a fala.","Os balbucios podem aparecer entre 4-6 meses. Vamos estimular a comunicação!","Continue prestando atenção aos sons que a criança faz.","Continue conversando bastante com a criança|Repita os sons que ela faz|Cante músicas e cantigas","Fale mais durante atividades diárias|Imite sons diferentes|Leia livros com vozes variadas","Observe durante momentos de brincadeira|Note se responde quando você fala|Registre diferentes tipos de sons",1`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'titi_nauta_questions_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template baixado",
      description: "O template CSV foi baixado com sucesso."
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    
    // Parse and preview
    try {
      const importer = new JourneyBotQuestionImporter();
      const preview = await importer.previewCsv(selectedFile);
      setPreviewData(preview.slice(0, 5)); // Show first 5 rows
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Erro no preview",
        description: "Não foi possível visualizar o arquivo.",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      const importer = new JourneyBotQuestionImporter();
      
      const result = await importer.importFromCsv(file, (progress) => {
        setImportProgress(progress);
      });

      setImportResult(result);

      if (result.success) {
        toast({
          title: "Importação concluída",
          description: `${result.imported} perguntas importadas com sucesso.`
        });
      } else {
        toast({
          title: "Importação finalizada com erros",
          description: `${result.imported} importadas, ${result.errors.length} erros.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Erro na importação",
        description: "Houve um erro durante a importação.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Perguntas do Titi Nauta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Download */}
          <div className="space-y-2">
            <Label>1. Baixar Template</Label>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Template CSV
              </Button>
              <p className="text-sm text-gray-600">
                Use o template para garantir o formato correto
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">2. Selecionar Arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isImporting}
            />
          </div>

          {/* Preview */}
          {previewData.length > 0 && (
            <div className="space-y-2">
              <Label>3. Preview dos Dados</Label>
              <div className="border rounded-lg p-4 bg-gray-50 max-h-40 overflow-auto">
                <div className="text-sm space-y-2">
                  {previewData.map((row, index) => (
                    <div key={index} className="border-b pb-2">
                      <strong>{row.question_text}</strong>
                      <div className="text-gray-600">
                        Dimensão: {row.dimension} | Idade: {row.age_min_months}-{row.age_max_months} meses
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Import Button */}
          <div className="space-y-2">
            <Label>4. Importar</Label>
            <Button 
              onClick={handleImport}
              disabled={!file || isImporting}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Importar Perguntas
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          {isImporting && (
            <div className="space-y-2">
              <Label>Progresso da Importação</Label>
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-gray-600">{importProgress}% concluído</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Resultado da Importação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                <div className="text-sm text-green-700">Importadas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{importResult.skipped}</div>
                <div className="text-sm text-yellow-700">Ignoradas</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                <div className="text-sm text-red-700">Erros</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <details>
                    <summary className="cursor-pointer font-semibold">
                      Erros encontrados (clique para ver detalhes)
                    </summary>
                    <div className="mt-2 space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </details>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Format Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Formato do Arquivo CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <h4 className="font-semibold">Colunas obrigatórias:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>question_text:</strong> Texto da pergunta</li>
              <li><strong>dimension:</strong> motor, language, social, sensory</li>
              <li><strong>age_min_months:</strong> Idade mínima em meses</li>
              <li><strong>age_max_months:</strong> Idade máxima em meses</li>
              <li><strong>feedback_yes:</strong> Feedback para resposta "Sim"</li>
              <li><strong>feedback_no:</strong> Feedback para resposta "Não"</li>
              <li><strong>feedback_unknown:</strong> Feedback para "Não sei"</li>
              <li><strong>tips_yes, tips_no, tips_unknown:</strong> Dicas separadas por "|"</li>
              <li><strong>concern_level:</strong> 0=normal, 1=atenção, 2=preocupação</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyBotImportTab;
