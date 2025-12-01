
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ValidateLicenseDialog from './ValidateLicenseDialog';
import { AssignLicenseDialog } from './AssignLicenseDialog';
import { DeleteLicenseDialog } from './DeleteLicenseDialog';
import { License } from '@/types/license';
import { Edit2, Trash2, UserPlus, Check, AlertCircle, Users } from "lucide-react";
import { format } from 'date-fns';

interface LicensesListProps {
  licenses: License[];
  isLoading: boolean;
  onEditLicense: (license: License) => void;
}

export const LicensesList: React.FC<LicensesListProps> = ({ 
  licenses, 
  isLoading, 
  onEditLicense 
}) => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleValidate = (license: License) => {
    setSelectedLicense(license);
    setValidationDialogOpen(true);
  };
  
  const handleAssign = (license: License) => {
    setSelectedLicense(license);
    setAssignDialogOpen(true);
  };
  
  const handleDelete = (license: License) => {
    setSelectedLicense(license);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseValidationDialog = () => {
    setValidationDialogOpen(false);
    setSelectedLicense(null);
  };
  
  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedLicense(null);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedLicense(null);
  };
  
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'dd/MM/yyyy');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const formatLicenseType = (type: string) => {
    switch (type) {
      case 'trial': return 'Avaliação';
      case 'standard': return 'Padrão';
      case 'professional': return 'Profissional';
      case 'enterprise': return 'Empresarial';
      case 'individual': return 'Individual';
      default: return type;
    }
  };
  
  const formatLicenseModel = (model: string) => {
    switch (model) {
      case 'individual': return 'Individual';
      case 'enterprise': return 'Empresarial';
      default: return model;
    }
  };
  
  const isLicenseExpired = (expiresAt: string | Date) => {
    const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    return expiryDate < new Date();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        <span className="ml-2 text-muted-foreground">Carregando licenças...</span>
      </div>
    );
  }
  
  if (licenses.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Nenhuma licença encontrada.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chave</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead>Atribuída para</TableHead>
              <TableHead>Equipes</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="font-mono text-xs">
                  {license.key.substring(0, 16)}...
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {formatLicenseModel(license.model || 'individual')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatLicenseType(license.type)}
                </TableCell>
                <TableCell>
                  {license.isActive ? (
                    isLicenseExpired(license.expiresAt) ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Expirada
                      </Badge>
                    ) : (
                      <Badge variant="success" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
                        <Check className="h-3 w-3" />
                        Ativa
                      </Badge>
                    )
                  ) : (
                    <Badge variant="secondary">Inativa</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(license.expiresAt)}
                </TableCell>
                <TableCell>
                  {license.assignedTo || "Não atribuída"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {license.model === 'enterprise' ? (
                      <span>{license.usedCount || 0}/{license.totalCount || 0}</span>
                    ) : (
                      <span>{license.teams?.length || 0}/1</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleValidate(license)}
                      title="Validar licença"
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Validar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAssign(license)}
                      title="Atribuir licença"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="sr-only">Atribuir</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditLicense(license)}
                      title="Editar licença"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(license)}
                      title="Excluir licença"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <ValidateLicenseDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        license={selectedLicense}
        onClose={handleCloseValidationDialog}
      />
      
      <AssignLicenseDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        license={selectedLicense}
        onClose={handleCloseAssignDialog}
      />
      
      <DeleteLicenseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        license={selectedLicense}
        onClose={handleCloseDeleteDialog}
      />
    </>
  );
};

export default LicensesList;
