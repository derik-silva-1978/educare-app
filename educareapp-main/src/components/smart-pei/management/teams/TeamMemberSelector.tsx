
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Added import for Textarea
import { TeamMember } from '@/types/license';
import { X, Plus, User } from 'lucide-react';
import { uuid } from '@/utils/uuid';
import { Label } from '@/components/ui/label'; // Added import for Label

interface TeamMemberSelectorProps {
  role: TeamMember['role'];
  multiple?: boolean;
  selectedMember?: TeamMember | null;
  selectedMembers?: TeamMember[];
  onSelect?: (member: TeamMember) => void;
  onSelectMultiple?: (members: TeamMember[]) => void;
}

export function TeamMemberSelector({
  role,
  multiple = false,
  selectedMember,
  selectedMembers = [],
  onSelect,
  onSelectMultiple
}: TeamMemberSelectorProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState(''); // Added state for description
  
  const handleAddMember = () => {
    if (!name.trim() || !email.trim()) return;
    
    const newMember: TeamMember = {
      id: uuid(),
      name: name.trim(),
      email: email.trim(),
      role: role,
      joinedAt: new Date().toISOString(),
      description: description.trim() || undefined // Include description if provided
    };
    
    if (multiple && onSelectMultiple) {
      onSelectMultiple([...selectedMembers, newMember]);
    } else if (onSelect) {
      onSelect(newMember);
    }
    
    // Clear form
    setName('');
    setEmail('');
    setDescription('');
  };
  
  const handleRemoveMember = (id: string) => {
    if (multiple && onSelectMultiple) {
      onSelectMultiple(selectedMembers.filter(m => m.id !== id));
    } else if (onSelect) {
      onSelect(null as any);  // Clear selection
    }
  };
  
  const renderSelectedMembers = () => {
    if (multiple) {
      return selectedMembers.map(member => (
        <div key={member.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{member.name} ({member.email})</span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => handleRemoveMember(member.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ));
    } else if (selectedMember) {
      return (
        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{selectedMember.name} ({selectedMember.email})</span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => handleRemoveMember(selectedMember.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {renderSelectedMembers()}
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Informações adicionais sobre o profissional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>
        
        <Button 
          type="button" 
          className="w-full"
          onClick={handleAddMember}
          disabled={!name.trim() || !email.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar {role === 'coordinator' ? 'Coordenador' : 
                     role === 'parent' ? 'Responsável' : 'Profissional'}
        </Button>
      </div>
    </div>
  );
}
