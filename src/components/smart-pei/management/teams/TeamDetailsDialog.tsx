
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LicenseTeam, TeamMember } from '@/types/license';
import { Spinner } from '@/components/ui/loading';
import { TeamMemberSelector } from './TeamMemberSelector';

interface TeamDetailsDialogProps {
  team: LicenseTeam;
  open: boolean;
  onClose: () => void;
  onSave: (team: LicenseTeam) => void;
  onOpenChange?: (open: boolean) => void;
}

const TeamDetailsDialog: React.FC<TeamDetailsDialogProps> = ({
  team,
  open,
  onClose,
  onSave,
  onOpenChange
}) => {
  const [formData, setFormData] = useState<LicenseTeam>({ ...team });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateMembers = (members: TeamMember[]) => {
    setFormData(prev => ({ ...prev, members }));
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={openState => {
        if (onOpenChange) {
          onOpenChange(openState);
        }
        if (!openState) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Equipe</DialogTitle>
          <DialogDescription>
            Visualize e edite os detalhes da equipe.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipe</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            {formData.studentName !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="studentName">Nome do Estudante</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  value={formData.studentName || ''}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Membros da Equipe</Label>
              <TeamMemberSelector 
                role="professional"
                multiple={true}
                selectedMembers={formData.members || []}
                onSelectMultiple={updateMembers} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetailsDialog;
