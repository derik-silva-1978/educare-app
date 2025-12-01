
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { License } from '@/types/license';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { uuid } from '@/utils/uuid';
import LicenseDialogTabs from './LicenseDialogTabs';

interface LicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License | null;
  onClose: () => void;
}

export const LicenseDialog: React.FC<LicenseDialogProps> = ({ 
  open, 
  onOpenChange, 
  license, 
  onClose 
}) => {
  const { addLicense, updateLicense } = useLicenseManagement();
  const isEditMode = !!license;
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      key: license?.key || '',
      type: license?.type || 'standard',
      model: license?.model || 'individual',
      expiresAt: license?.expiresAt ? new Date(license.expiresAt).toISOString().substring(0, 10) : '',
      maxUsers: license?.maxUsers || 1,
      totalCount: license?.totalCount || 1,
      features: license?.features?.join(', ') || '',
      isActive: license?.isActive ?? true
    }
  });
  
  React.useEffect(() => {
    if (open) {
      reset({
        key: license?.key || '',
        type: license?.type || 'standard',
        model: license?.model || 'individual',
        expiresAt: license?.expiresAt ? new Date(license.expiresAt).toISOString().substring(0, 10) : '',
        maxUsers: license?.maxUsers || 1,
        totalCount: license?.totalCount || 1,
        features: license?.features?.join(', ') || '',
        isActive: license?.isActive ?? true
      });
    }
  }, [open, license, reset]);
  
  const generateLicenseKey = () => {
    const key = `SMARTPEI-${uuid().toUpperCase().replace(/-/g, '')}`;
    setValue('key', key);
  };
  
  const onSubmit = (data: any) => {
    const now = new Date().toISOString();
    
    const licenseData: License = {
      id: license?.id || uuid(),
      key: data.key,
      type: data.type as "trial" | "standard" | "professional" | "enterprise" | "individual",
      model: data.model as "individual" | "enterprise",
      expiresAt: new Date(data.expiresAt).toISOString(),
      maxUsers: Number(data.maxUsers),
      totalCount: data.model === 'enterprise' ? Number(data.totalCount) : 1,
      usedCount: license?.usedCount || 0,
      features: data.features.split(',').map((feature: string) => feature.trim()).filter(Boolean),
      isActive: data.isActive,
      assignedTo: license?.assignedTo || null,
      lastValidated: license?.lastValidated || null,
      teams: license?.teams || [],
      status: license?.status || (data.isActive ? 'active' : 'inactive'),
      createdAt: license?.createdAt || now
    };
    
    if (isEditMode) {
      updateLicense(licenseData);
    } else {
      addLicense(licenseData);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Licença' : 'Nova Licença'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Modifique os detalhes da licença e clique em Salvar quando terminar.' 
              : 'Preencha os detalhes da nova licença e clique em Criar quando terminar.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <LicenseDialogTabs
            license={license}
            isEditMode={isEditMode}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            generateLicenseKey={generateLicenseKey}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditMode ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseDialog;
