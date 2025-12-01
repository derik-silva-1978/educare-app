
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { License } from '@/types/license';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/auth';

interface AssignLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License | null;
  onClose: () => void;
}

export const AssignLicenseDialog: React.FC<AssignLicenseDialogProps> = ({ 
  open, 
  onOpenChange, 
  license, 
  onClose 
}) => {
  const { assignLicense, unassignLicense } = useLicenseManagement();
  const { users } = useUserManagement();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (open && license) {
      // Reset selection when dialog opens
      setSelectedUserId(null);
    }
  }, [open, license]);
  
  const handleAssign = () => {
    if (license && selectedUserId) {
      const selectedUser = users.find(user => user.id === selectedUserId);
      if (selectedUser) {
        assignLicense(license.id, selectedUser);
      }
    }
    onClose();
  };
  
  const handleUnassign = () => {
    if (license) {
      unassignLicense(license.id);
    }
    onClose();
  };
  
  if (!license) return null;
  
  const isAssigned = !!license.assignedTo;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAssigned ? 'Reatribuir Licença' : 'Atribuir Licença'}</DialogTitle>
          <DialogDescription>
            {isAssigned
              ? `Esta licença está atualmente atribuída a ${license.assignedTo}. Você pode reatribuí-la a outro usuário ou remover a atribuição.`
              : 'Selecione um usuário para atribuir esta licença.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Chave de Licença</p>
              <p className="text-sm text-muted-foreground">
                {license.key.substring(0, 12)}...{license.key.substring(license.key.length - 8)}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Tipo</p>
              <p className="text-sm text-muted-foreground">{license.type}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Atribuir a</label>
              <Select onValueChange={(value) => setSelectedUserId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: User) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <div className="hidden sm:block">
            {isAssigned && (
              <Button variant="outline" onClick={handleUnassign} className="text-destructive">
                Remover Atribuição
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleAssign} disabled={!selectedUserId}>
              {isAssigned ? 'Reatribuir' : 'Atribuir'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignLicenseDialog;
