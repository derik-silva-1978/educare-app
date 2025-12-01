
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Save } from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AssessmentDomain, AssessmentLevel } from '@/types/assessment';

// Define Skill type
export interface Skill {
  id: string;
  name: string;
  domain: AssessmentDomain;
  description: string;
}

// Define Question type with proper type for levels
export interface Question {
  id: string;
  skillId: string;
  text: string;
  helpText?: string;
  levels: {
    [key in Exclude<AssessmentLevel, null>]?: string;
  };
}

interface QuestionFormProps {
  isEditing: boolean;
  question: Omit<Question, 'id'> | Question;
  skills: Skill[];
  onSave: () => void;
  onUpdate: () => void;
  onCancel?: () => void;
  onChange: (field: string, value: any) => void;
  onReset: () => void;
}

export const getLevelName = (level: AssessmentLevel): string => {
  const levelNames: Record<string, string> = {
    not_present: 'Não Presente',
    emerging: 'Emergente',
    developing: 'Em Desenvolvimento',
    developing_strong: 'Em Desenvolvimento Avançado',
    achieved: 'Alcançado',
    mastered: 'Dominado',
    acquired: 'Adquirido'
  };
  return level === null ? 'Não Avaliado' : (levelNames[level] || String(level));
};

const QuestionForm: React.FC<QuestionFormProps> = ({
  isEditing,
  question,
  skills,
  onSave,
  onUpdate,
  onCancel,
  onChange,
  onReset
}) => {
  // Handle level change
  const handleLevelChange = (level: Exclude<AssessmentLevel, null>, value: string) => {
    const updatedLevels = {
      ...question.levels,
      [level]: value
    };
    onChange('levels', updatedLevels);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question-skill">Habilidade Relacionada</Label>
          <Select 
            value={question.skillId}
            onValueChange={(value) => onChange('skillId', value)}
          >
            <SelectTrigger id="question-skill">
              <SelectValue placeholder="Selecione uma habilidade" />
            </SelectTrigger>
            <SelectContent>
              {skills.length === 0 ? (
                <div className="p-2 text-center text-muted-foreground">
                  Nenhuma habilidade cadastrada
                </div>
              ) : (
                skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="question-text">Texto da Questão</Label>
          <Textarea 
            id="question-text"
            value={question.text}
            onChange={(e) => onChange('text', e.target.value)}
            placeholder="Ex: A criança consegue compreender comandos simples?"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="question-help">Texto de Ajuda (opcional)</Label>
          <Textarea 
            id="question-help"
            value={question.helpText || ''}
            onChange={(e) => onChange('helpText', e.target.value)}
            placeholder="Texto adicional para ajudar o avaliador a entender a questão"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Descrição dos Níveis</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80 text-sm">
                    Descreva o que significa cada nível para esta questão específica.
                    Isso ajudará os avaliadores a atribuir o nível correto.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-3 pt-2">
            {(['not_present', 'emerging', 'developing', 'developing_strong', 'achieved', 'mastered', 'acquired'] as const).map((level) => (
              <div key={level} className="space-y-1">
                <Label htmlFor={`level-${level}`} className="text-sm">
                  {getLevelName(level)}
                </Label>
                <Input 
                  id={`level-${level}`}
                  value={question.levels[level] || ''}
                  onChange={(e) => handleLevelChange(level, e.target.value)}
                  placeholder={`Descrição para o nível ${getLevelName(level)}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t p-4">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={onUpdate}>
              <Save className="h-4 w-4 mr-2" />
              Atualizar Questão
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onReset}>
              Limpar Campos
            </Button>
            <Button onClick={onSave}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Questão
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default QuestionForm;
