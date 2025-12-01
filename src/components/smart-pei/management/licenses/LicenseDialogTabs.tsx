
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { License } from '@/types/license';

interface LicenseDialogTabsProps {
  license: License | null;
  isEditMode: boolean;
  register: any;
  setValue: any;
  watch: any;
  errors: any;
  generateLicenseKey: () => void;
}

export const LicenseDialogTabs: React.FC<LicenseDialogTabsProps> = ({
  license,
  isEditMode,
  register,
  setValue,
  watch,
  errors,
  generateLicenseKey
}) => {
  const isActiveValue = watch('isActive');
  const licenseModel = watch('model');
  
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
        <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="key">Chave de Licença</Label>
            {!isEditMode && (
              <Button type="button" variant="outline" size="sm" onClick={generateLicenseKey}>
                Gerar Chave
              </Button>
            )}
          </div>
          <Input
            id="key"
            {...register('key', { required: "Chave de licença é obrigatória" })}
            readOnly={isEditMode}
          />
          {errors.key && (
            <p className="text-sm text-destructive">{errors.key.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Modelo de Licença</Label>
          <Select 
            defaultValue={license?.model || 'individual'}
            onValueChange={(value: "individual" | "enterprise") => setValue('model', value)}
            disabled={isEditMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual (1 aluno)</SelectItem>
              <SelectItem value="enterprise">Empresarial (vários alunos)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Licença</Label>
          <Select 
            defaultValue={license?.type || 'standard'}
            onValueChange={(value: "trial" | "standard" | "professional" | "enterprise" | "individual") => setValue('type', value)}
            disabled={isEditMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trial">Avaliação</SelectItem>
              <SelectItem value="standard">Padrão</SelectItem>
              <SelectItem value="professional">Profissional</SelectItem>
              <SelectItem value="enterprise">Empresarial</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expiresAt">Data de Expiração</Label>
          <Input
            id="expiresAt"
            type="date"
            {...register('expiresAt', { required: "Data de expiração é obrigatória" })}
          />
          {errors.expiresAt && (
            <p className="text-sm text-destructive">{errors.expiresAt.message}</p>
          )}
        </div>
        
        {licenseModel === 'individual' ? (
          <div className="space-y-2">
            <Label htmlFor="maxUsers">Número Máximo de Membros da Equipe</Label>
            <Input
              id="maxUsers"
              type="number"
              min="1"
              max="5"
              {...register('maxUsers', { 
                required: "Número máximo de usuários é obrigatório",
                min: {
                  value: 1,
                  message: "Deve ser pelo menos 1"
                },
                max: {
                  value: 5,
                  message: "Máximo permitido é 5 (1 coordenador + 1 responsável + 3 profissionais)"
                }
              })}
            />
            {errors.maxUsers && (
              <p className="text-sm text-destructive">{errors.maxUsers.message}</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="totalCount">Número de Licenças (Total)</Label>
            <Input
              id="totalCount"
              type="number"
              min="1"
              {...register('totalCount', { 
                required: "Número total de licenças é obrigatório",
                min: {
                  value: 1,
                  message: "Deve ser pelo menos 1"
                }
              })}
            />
            {errors.totalCount && (
              <p className="text-sm text-destructive">{errors.totalCount.message}</p>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={isActiveValue}
            onCheckedChange={(checked) => setValue('isActive', checked)}
          />
          <Label htmlFor="isActive">Licença Ativa</Label>
        </div>
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="features">Funcionalidades (separadas por vírgula)</Label>
          <Input
            id="features"
            {...register('features')}
          />
        </div>
        
        {isEditMode && licenseModel === 'enterprise' && license && (
          <div className="p-4 bg-muted rounded-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Licenças utilizadas:</span>
              <span>{license.usedCount || 0} de {license.totalCount || 0}</span>
            </div>
            <div className="w-full bg-background rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ 
                  width: `${license.totalCount ? (license.usedCount || 0) * 100 / license.totalCount : 0}%` 
                }}
              />
            </div>
          </div>
        )}
        
        {isEditMode && license?.teams && license.teams.length > 0 && (
          <div className="space-y-2">
            <Label>Equipes alocadas</Label>
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              <ul className="space-y-1">
                {license.teams.map(team => (
                  <li key={team.id} className="text-sm">
                    {team.name} - {team.studentName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default LicenseDialogTabs;
