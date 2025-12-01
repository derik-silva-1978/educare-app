
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Users } from 'lucide-react';
import AIAssistSuggestion from './AIAssistSuggestion';
import { usePEIAIAssistance } from '@/hooks/usePEIAIAssistance';

interface PEITeamFormProps {
  teamMembers: string[];
  setTeamMembers: (members: string[]) => void;
}

const PEITeamForm: React.FC<PEITeamFormProps> = ({ teamMembers, setTeamMembers }) => {
  const [newMember, setNewMember] = useState('');
  const { suggestTeamMembers } = usePEIAIAssistance();
  
  const handleAddMember = () => {
    if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
      setTeamMembers([...teamMembers, newMember.trim()]);
      setNewMember('');
    }
  };
  
  const handleRemoveMember = (memberToRemove: string) => {
    setTeamMembers(teamMembers.filter(member => member !== memberToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary/70" />
            Equipe de Apoio
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Defina a equipe multidisciplinar que irá implementar e acompanhar o PEI.
          </p>
          
          <div className="mb-6">
            <AIAssistSuggestion
              title="membros da equipe"
              onRequestSuggestion={suggestTeamMembers}
              onAccept={(suggestion) => {
                if (Array.isArray(suggestion)) {
                  // Filter out members that are already in the team
                  const newMembers = suggestion.filter(
                    member => !teamMembers.includes(member)
                  );
                  if (newMembers.length > 0) {
                    setTeamMembers([...teamMembers, ...newMembers]);
                  }
                }
              }}
              type="list"
              context="Com base nas necessidades do aluno e nas práticas recomendadas"
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="newMember" className="mb-2 block text-sm">
                    Adicionar Novo Membro
                  </Label>
                  <Input
                    id="newMember"
                    placeholder="Ex: Professor de AEE, Psicólogo Escolar, etc."
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddMember}
                  disabled={!newMember.trim()}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              
              <div className="mt-2">
                <Label className="text-sm mb-2 block">Membros da Equipe</Label>
                {teamMembers.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic p-3 bg-muted/20 rounded-md">
                    Nenhum membro adicionado. Adicione membros da equipe ou use a sugestão de IA.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/10 rounded-md min-h-24">
                    {teamMembers.map((member, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 py-1.5 px-3"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member)}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                          title="Remover membro da equipe"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100 text-sm">
              <h4 className="font-medium text-blue-800 mb-2">Dica Profissional</h4>
              <p className="text-blue-700">
                Uma equipe multidisciplinar eficaz geralmente inclui professores regulares, especialistas em educação especial, psicólogos escolares e, dependendo das necessidades do estudante, outros profissionais como fonoaudiólogos ou terapeutas ocupacionais.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PEITeamForm;
