
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FileText, AlignLeft, User, Calendar as CalendarIcon2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PEIGeneralFormProps {
  title: string;
  setTitle: (title: string) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  startDate: Date;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date;
  setEndDate: (date: Date | undefined) => void;
  nextReviewDate: Date;
  setNextReviewDate: (date: Date | undefined) => void;
  notes: string;
  setNotes: (notes: string) => void;
  students: { id: string; name: string }[];
}

const PEIGeneralForm: React.FC<PEIGeneralFormProps> = ({
  title,
  setTitle,
  selectedStudentId,
  setSelectedStudentId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  nextReviewDate,
  setNextReviewDate,
  notes,
  setNotes,
  students,
}) => {
  const studentName = students.find(s => s.id === selectedStudentId)?.name || '';

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary/70" />
            Informações Gerais do PEI
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Preencha os dados gerais do Plano Educacional Individualizado.
          </p>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="mb-2 block flex items-center gap-1">
                <AlignLeft className="h-4 w-4" />
                Título do PEI
              </Label>
              <div className="mb-2">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: PEI 2023 - Desenvolvimento de Autonomia e Habilidades Sociais"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student" className="mb-2 block flex items-center gap-1">
                <User className="h-4 w-4" />
                Aluno
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="student"
                  value={studentName}
                  disabled
                  className="w-full bg-muted/30"
                />
                {selectedStudentId && (
                  <Badge variant="outline" className="bg-primary/5">
                    ID: {selectedStudentId.substring(0, 8)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="mb-2 block flex items-center gap-1">
                  <CalendarIcon2 className="h-4 w-4" />
                  Data de Início
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="startDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="mb-2 block flex items-center gap-1">
                  <CalendarIcon2 className="h-4 w-4" />
                  Data de Término
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="endDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewDate" className="mb-2 block flex items-center gap-1">
                  <CalendarIcon2 className="h-4 w-4" />
                  Data da Próxima Revisão
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="reviewDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextReviewDate ? (
                        format(nextReviewDate, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={nextReviewDate}
                      onSelect={setNextReviewDate}
                      initialFocus
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="mb-2 block flex items-center gap-1">
                <AlignLeft className="h-4 w-4" />
                Observações / Resumo
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva brevemente os objetivos gerais deste PEI e quaisquer observações relevantes..."
                className="w-full min-h-24"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PEIGeneralForm;
