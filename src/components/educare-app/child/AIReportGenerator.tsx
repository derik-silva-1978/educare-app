import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, FileText, Baby, Heart, Syringe, Brain, User, Scale, Ruler, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AIReportGeneratorProps {
  childId: string;
  childData?: {
    id: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
    gender?: string;
    [key: string]: unknown;
  };
  onReportGenerated?: (report: any) => void;
}

interface ReportSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fields: ReportField[];
}

interface ReportField {
  id: string;
  name: string;
  description?: string;
}

const reportSections: ReportSection[] = [
  {
    id: 'personal',
    name: 'Dados Pessoais',
    description: 'Informações básicas da criança e responsáveis',
    icon: <User className="h-5 w-5" />,
    fields: [
      { id: 'child_name', name: 'Nome da criança' },
      { id: 'birth_date', name: 'Data de nascimento' },
      { id: 'age', name: 'Idade atual' },
      { id: 'gender', name: 'Sexo' },
      { id: 'parent_names', name: 'Nome dos pais/responsáveis' },
      { id: 'contact_info', name: 'Informações de contato' },
    ]
  },
  {
    id: 'biometrics',
    name: 'Biometria',
    description: 'Medidas de crescimento',
    icon: <Scale className="h-5 w-5" />,
    fields: [
      { id: 'current_weight', name: 'Peso atual' },
      { id: 'current_height', name: 'Altura atual' },
      { id: 'head_circumference', name: 'Perímetro cefálico' },
      { id: 'weight_history', name: 'Histórico de peso' },
      { id: 'height_history', name: 'Histórico de altura' },
      { id: 'growth_percentiles', name: 'Percentis de crescimento' },
    ]
  },
  {
    id: 'birth',
    name: 'Condições do Nascimento',
    description: 'Informações sobre o parto e período neonatal',
    icon: <Baby className="h-5 w-5" />,
    fields: [
      { id: 'gestational_age', name: 'Idade gestacional' },
      { id: 'birth_weight', name: 'Peso ao nascer' },
      { id: 'birth_height', name: 'Altura ao nascer' },
      { id: 'delivery_type', name: 'Tipo de parto' },
      { id: 'apgar_score', name: 'Apgar' },
      { id: 'neonatal_complications', name: 'Complicações neonatais' },
    ]
  },
  {
    id: 'vaccines',
    name: 'Vacinas',
    description: 'Histórico de vacinação',
    icon: <Syringe className="h-5 w-5" />,
    fields: [
      { id: 'vaccines_taken', name: 'Vacinas aplicadas' },
      { id: 'vaccines_pending', name: 'Vacinas pendentes' },
      { id: 'vaccines_upcoming', name: 'Próximas vacinas' },
      { id: 'vaccination_schedule', name: 'Calendário vacinal' },
    ]
  },
  {
    id: 'development',
    name: 'Marcos do Desenvolvimento',
    description: 'Progresso nos marcos de desenvolvimento',
    icon: <Brain className="h-5 w-5" />,
    fields: [
      { id: 'motor_development', name: 'Desenvolvimento motor' },
      { id: 'cognitive_development', name: 'Desenvolvimento cognitivo' },
      { id: 'language_development', name: 'Desenvolvimento da linguagem' },
      { id: 'social_emotional', name: 'Desenvolvimento socioemocional' },
      { id: 'milestones_achieved', name: 'Marcos alcançados' },
      { id: 'milestones_in_progress', name: 'Marcos em progresso' },
      { id: 'development_concerns', name: 'Pontos de atenção' },
    ]
  },
  {
    id: 'health',
    name: 'Saúde',
    description: 'Histórico de saúde e consultas',
    icon: <Heart className="h-5 w-5" />,
    fields: [
      { id: 'sleep_patterns', name: 'Padrões de sono' },
      { id: 'feeding_info', name: 'Alimentação' },
      { id: 'allergies', name: 'Alergias' },
      { id: 'medical_conditions', name: 'Condições médicas' },
      { id: 'medications', name: 'Medicamentos em uso' },
      { id: 'recent_appointments', name: 'Consultas recentes' },
    ]
  },
];

export const AIReportGenerator: React.FC<AIReportGeneratorProps> = ({ 
  childId, 
  childData,
  onReportGenerated 
}) => {
  const { toast } = useToast();
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleFieldToggle = (fieldId: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldId)) {
      newSelected.delete(fieldId);
    } else {
      newSelected.add(fieldId);
    }
    setSelectedFields(newSelected);
  };

  const handleSectionToggle = (section: ReportSection) => {
    const newSelected = new Set(selectedFields);
    const allFieldsSelected = section.fields.every(f => selectedFields.has(f.id));
    
    if (allFieldsSelected) {
      section.fields.forEach(f => newSelected.delete(f.id));
    } else {
      section.fields.forEach(f => newSelected.add(f.id));
    }
    setSelectedFields(newSelected);
  };

  const handleSelectAll = () => {
    const allFields = reportSections.flatMap(s => s.fields.map(f => f.id));
    if (selectedFields.size === allFields.length) {
      setSelectedFields(new Set());
    } else {
      setSelectedFields(new Set(allFields));
    }
  };

  const getSectionSelectionState = (section: ReportSection): 'none' | 'partial' | 'all' => {
    const selectedCount = section.fields.filter(f => selectedFields.has(f.id)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === section.fields.length) return 'all';
    return 'partial';
  };

  const isFeatureReady = false;

  const handleGenerateReport = async () => {
    if (selectedFields.size === 0) {
      toast({
        title: 'Selecione campos',
        description: 'Por favor, selecione pelo menos um campo para incluir no relatório.',
        variant: 'destructive'
      });
      return;
    }

    if (!isFeatureReady) {
      toast({
        title: 'Em desenvolvimento',
        description: 'O gerador de relatórios com IA estará disponível em breve. Enquanto isso, você pode usar o Relatório Padrão.',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedReport(null);

    try {
      const response = await fetch('/api/reports/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          childId,
          selectedFields: Array.from(selectedFields)
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar relatório');
      }

      const data = await response.json();
      
      if (data.success && data.report) {
        setGeneratedReport(data.report);
        toast({
          title: 'Relatório gerado',
          description: 'Seu relatório personalizado foi gerado com sucesso!',
        });
        onReportGenerated?.(data.report);
      } else {
        throw new Error(data.error || 'Erro ao gerar relatório');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: 'Erro ao gerar relatório',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao gerar o relatório. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const totalFields = reportSections.flatMap(s => s.fields).length;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Gerador de Relatório com IA</CardTitle>
                <Badge variant="secondary" className="text-xs">Em breve</Badge>
              </div>
              <CardDescription>
                Selecione as informações que deseja incluir no relatório. 
                Nosso assistente IA irá buscar os dados e gerar um relatório personalizado.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedFields.size} de {totalFields} campos selecionados
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
            >
              {selectedFields.size === totalFields ? 'Desmarcar todos' : 'Selecionar todos'}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportSections.map((section) => {
              const selectionState = getSectionSelectionState(section);
              
              return (
                <Card key={section.id} className="overflow-hidden">
                  <CardHeader className="pb-2 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${
                          selectionState === 'all' ? 'bg-green-100 text-green-600' :
                          selectionState === 'partial' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {section.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{section.name}</h4>
                          <p className="text-xs text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                      <Checkbox 
                        checked={selectionState === 'all'}
                        onCheckedChange={() => handleSectionToggle(section)}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-3">
                    <div className="space-y-2">
                      {section.fields.map((field) => (
                        <div 
                          key={field.id} 
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1.5 rounded-md transition-colors"
                          onClick={() => handleFieldToggle(field.id)}
                        >
                          <Checkbox 
                            id={field.id}
                            checked={selectedFields.has(field.id)}
                            onCheckedChange={() => handleFieldToggle(field.id)}
                          />
                          <Label 
                            htmlFor={field.id} 
                            className="cursor-pointer flex-1 text-xs"
                          >
                            {field.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
          <div className="flex-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              O assistente IA buscará as informações disponíveis no sistema para gerar seu relatório.
            </div>
          </div>
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating || selectedFields.size === 0}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando relatório...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar Relatório com IA
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {generatedReport && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Relatório Gerado</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div 
                className="whitespace-pre-wrap bg-white p-4 rounded-lg border"
                dangerouslySetInnerHTML={{ __html: generatedReport }}
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" className="gap-2">
              Compartilhar
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AIReportGenerator;
