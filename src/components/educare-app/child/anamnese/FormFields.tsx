
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Text field component
interface TextFieldProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TextField = ({ label, name, value, onChange, placeholder, disabled }: TextFieldProps) => (
  <div className="grid grid-cols-1 gap-2">
    <Label htmlFor={name}>{label}</Label>
    <Input 
      id={name}
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

// Modern select field component with enhanced styling
interface SelectFieldProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  placeholder = "Selecionar", 
  disabled 
}: SelectFieldProps) => (
  <div className="grid grid-cols-1 gap-2">
    <Label htmlFor={name} className="font-medium text-gray-800">{label}</Label>
    <Select 
      value={value || ''} 
      onValueChange={(val) => onChange(name, val)}
      disabled={disabled}
    >
      <SelectTrigger 
        id={name} 
        variant="modern"
        className="w-full"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent variant="modern">
        {options.map(option => (
          <SelectItem 
            key={option.value} 
            value={option.value} 
            variant="modern"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

// Enhanced boolean field component with improved styling
interface BooleanFieldProps {
  label: string;
  name: string;
  value: boolean | null;
  onChange: (name: string, value: boolean | null) => void;
}

export const BooleanField = ({ label, name, value, onChange }: BooleanFieldProps) => (
  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200/60">
    <Label htmlFor={name} className="cursor-pointer font-medium text-gray-800">{label}</Label>
    <RadioGroup 
      value={value === null ? 'unknown' : value ? 'yes' : 'no'}
      onValueChange={(val) => {
        if (val === 'unknown') onChange(name, null);
        else onChange(name, val === 'yes');
      }}
      className="flex space-x-4"
    >
      <div className="flex items-center space-x-2 group">
        <RadioGroupItem 
          value="yes" 
          id={`${name}-yes`} 
          className="border-gray-400 text-primary transition-all duration-200 group-hover:border-green-500 group-hover:text-green-600" 
        />
        <Label 
          htmlFor={`${name}-yes`} 
          className="cursor-pointer font-medium text-green-700 transition-colors duration-200 group-hover:text-green-800"
        >
          Sim
        </Label>
      </div>
      <div className="flex items-center space-x-2 group">
        <RadioGroupItem 
          value="no" 
          id={`${name}-no`} 
          className="border-gray-400 text-primary transition-all duration-200 group-hover:border-red-500 group-hover:text-red-600" 
        />
        <Label 
          htmlFor={`${name}-no`} 
          className="cursor-pointer font-medium text-red-700 transition-colors duration-200 group-hover:text-red-800"
        >
          Não
        </Label>
      </div>
      <div className="flex items-center space-x-2 group">
        <RadioGroupItem 
          value="unknown" 
          id={`${name}-unknown`} 
          className="border-gray-400 text-primary transition-all duration-200 group-hover:border-gray-600" 
        />
        <Label 
          htmlFor={`${name}-unknown`} 
          className="cursor-pointer font-medium text-gray-600 transition-colors duration-200 group-hover:text-gray-800"
        >
          Não sei
        </Label>
      </div>
    </RadioGroup>
  </div>
);
