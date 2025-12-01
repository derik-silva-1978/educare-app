
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { License, ValidationResult } from '@/types/license';
import { useLicenseManagement } from '@/hooks/useLicenseManagement';
import { Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ValidateLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  license: License | null;
  onClose: () => void;
}

const ValidateLicenseDialog: React.FC<ValidateLicenseDialogProps> = ({
  open,
  onOpenChange,
  license,
  onClose
}) => {
  const { validateLicense } = useLicenseManagement();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  const handleValidate = async () => {
    if (!license) return;
    
    setIsValidating(true);
    setValidationResult(null);
    
    try {
      const result = await validateLicense(license.id);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Erro ao validar a licença. Tente novamente.',
        details: 'Ocorreu um erro durante a comunicação com o servidor de licenças.',
        errorCode: 'VALIDATION_ERROR'
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleClose = () => {
    setValidationResult(null);
    onClose();
  };
  
  if (!license) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Validar Licença</DialogTitle>
          <DialogDescription>
            Verificar validade e autenticidade da licença.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Chave de Licença</p>
            <p className="text-sm text-muted-foreground">
              {license.key.substring(0, 12)}...{license.key.substring(license.key.length - 8)}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Tipo de Licença</p>
            <p className="text-sm text-muted-foreground capitalize">
              {license.model} - {license.type}
            </p>
          </div>
          
          {validationResult && (
            <Alert 
              variant={validationResult.isValid ? "default" : 
                (validationResult.errorCode === "LICENSE_EXPIRED" ? "warning" : "destructive")}
              className="mt-4"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-2">
                  {validationResult.isValid ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : validationResult.errorCode === "LICENSE_EXPIRED" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <AlertTitle>
                    {validationResult.isValid ? 'Licença válida' : 'Problema na licença'}
                  </AlertTitle>
                  <AlertDescription className="mt-1">
                    <p>{validationResult.message}</p>
                    {validationResult.details && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {typeof validationResult.details === 'string' 
                          ? validationResult.details 
                          : JSON.stringify(validationResult.details)}
                      </p>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          
          {license.lastValidated && (
            <div className="text-sm text-muted-foreground mt-2">
              <p>Última validação: {new Date(license.lastValidated).toLocaleDateString()} {new Date(license.lastValidated).toLocaleTimeString()}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
          <Button onClick={handleValidate} disabled={isValidating}>
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : (
              'Validar Agora'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValidateLicenseDialog;
