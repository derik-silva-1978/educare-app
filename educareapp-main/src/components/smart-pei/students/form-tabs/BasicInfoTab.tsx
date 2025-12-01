
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StudentFormData } from '@/hooks/useStudents';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage 
} from '@/components/ui/form';

interface BasicInfoTabProps {
  formData: StudentFormData;
  handleChange: (field: keyof StudentFormData, value: any) => void;
  errors?: Record<string, string>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  formData, 
  handleChange,
  errors = {}
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
            Nome completo*
          </Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm font-medium text-destructive">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDate" className={errors.birthDate ? 'text-destructive' : ''}>
            Data de nascimento*
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate || ''}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className={errors.birthDate ? 'border-destructive' : ''}
          />
          {errors.birthDate && (
            <p className="text-sm font-medium text-destructive">{errors.birthDate}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select 
            value={formData.gender || 'male'} 
            onValueChange={(value) => handleChange('gender', value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Idade</Label>
          <Input
            value={formData.age || ''}
            readOnly
            disabled
          />
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Informações do Responsável</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianName" className={errors.guardianName ? 'text-destructive' : ''}>
              Nome do responsável*
            </Label>
            <Input
              id="guardianName"
              value={formData.guardianName || ''}
              onChange={(e) => handleChange('guardianName', e.target.value)}
              className={errors.guardianName ? 'border-destructive' : ''}
            />
            {errors.guardianName && (
              <p className="text-sm font-medium text-destructive">{errors.guardianName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guardianRelationship" className={errors.guardianRelationship ? 'text-destructive' : ''}>
              Parentesco
            </Label>
            <Select 
              value={formData.guardianRelationship || ''} 
              onValueChange={(value) => handleChange('guardianRelationship', value)}
            >
              <SelectTrigger id="guardianRelationship">
                <SelectValue placeholder="Selecione o parentesco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mother">Mãe</SelectItem>
                <SelectItem value="father">Pai</SelectItem>
                <SelectItem value="grandparent">Avó/Avô</SelectItem>
                <SelectItem value="sibling">Irmã/Irmão</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.guardianRelationship && (
              <p className="text-sm font-medium text-destructive">{errors.guardianRelationship}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="guardianPhone" className={errors.guardianPhone ? 'text-destructive' : ''}>
              Telefone
            </Label>
            <Input
              id="guardianPhone"
              value={formData.guardianPhone || ''}
              onChange={(e) => handleChange('guardianPhone', e.target.value)}
              className={errors.guardianPhone ? 'border-destructive' : ''}
            />
            {errors.guardianPhone && (
              <p className="text-sm font-medium text-destructive">{errors.guardianPhone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guardianEmail" className={errors.guardianEmail ? 'text-destructive' : ''}>
              Email
            </Label>
            <Input
              id="guardianEmail"
              type="email"
              value={formData.guardianEmail || ''}
              onChange={(e) => handleChange('guardianEmail', e.target.value)}
              className={errors.guardianEmail ? 'border-destructive' : ''}
            />
            {errors.guardianEmail && (
              <p className="text-sm font-medium text-destructive">{errors.guardianEmail}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Endereço</h3>
        
        <div className="space-y-2">
          <Label htmlFor="address" className={errors.address ? 'text-destructive' : ''}>
            Endereço completo
          </Label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className={errors.address ? 'border-destructive' : ''}
          />
          {errors.address && (
            <p className="text-sm font-medium text-destructive">{errors.address}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="city" className={errors.city ? 'text-destructive' : ''}>
              Cidade
            </Label>
            <Input
              id="city"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              className={errors.city ? 'border-destructive' : ''}
            />
            {errors.city && (
              <p className="text-sm font-medium text-destructive">{errors.city}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state" className={errors.state ? 'text-destructive' : ''}>
              Estado
            </Label>
            <Input
              id="state"
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              className={errors.state ? 'border-destructive' : ''}
            />
            {errors.state && (
              <p className="text-sm font-medium text-destructive">{errors.state}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
