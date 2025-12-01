
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PEI } from '@/hooks/usePEI';
import { Plus, Trash2, UserPlus } from 'lucide-react';

interface PEITeamFormProps {
  pei: PEI;
  onUpdate: (data: any) => void;
}

const PEITeamForm: React.FC<PEITeamFormProps> = ({ pei, onUpdate }) => {
  const [teamMembers, setTeamMembers] = useState<string[]>(pei.teamMembers || []);
  const [newMember, setNewMember] = useState('');

  const handleAddMember = () => {
    if (newMember.trim()) {
      const updatedMembers = [...teamMembers, newMember.trim()];
      setTeamMembers(updatedMembers);
      onUpdate({ teamMembers: updatedMembers });
      setNewMember('');
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
    onUpdate({ teamMembers: updatedMembers });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Equipe de Apoio</h3>
        <p className="text-muted-foreground mb-4">
          Adicione profissionais, terapeutas e outros membros da equipe que participarão do PEI.
        </p>

        <div className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <Label htmlFor="newMember">Adicionar Membro</Label>
            <Input
              id="newMember"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nome e função (ex: Maria Silva - Fonoaudióloga)"
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleAddMember}
            disabled={!newMember.trim()}
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-2 mt-6">
          <h4 className="text-sm font-medium mb-2">Membros da Equipe</h4>
          {teamMembers.length > 0 ? (
            <div className="border rounded-md">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 ${
                    index !== teamMembers.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <UserPlus className="text-muted-foreground h-4 w-4 mr-2" />
                    <span>{member}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(index)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover {member}</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">
                Nenhum membro da equipe adicionado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PEITeamForm;
