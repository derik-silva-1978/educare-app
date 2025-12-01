import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterState } from '@/hooks/useStudentFilters';

interface StudentFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  // Grade level options
  const gradeLevelOptions = [
    { value: 'preschool', label: 'Pré-escolar' },
    { value: '1', label: '1º Ano' },
    { value: '2', label: '2º Ano' },
    { value: '3', label: '3º Ano' },
    { value: '4', label: '4º Ano' },
    { value: '5', label: '5º Ano' },
    { value: '6', label: '6º Ano' },
    { value: '7', label: '7º Ano' },
    { value: '8', label: '8º Ano' },
    { value: '9', label: '9º Ano' },
  ];

  // Diagnosis type options
  const diagnosisTypeOptions = [
    { value: 'autism', label: 'TEA (Transtorno do Espectro Autista)' },
    { value: 'adhd', label: 'TDAH' },
    { value: 'intellectual', label: 'Deficiência Intelectual' },
    { value: 'down', label: 'Síndrome de Down' },
    { value: 'other', label: 'Outros' },
  ];

  // Therapy options
  const therapyOptions = [
    { value: 'speech', label: 'Fonoaudiologia' },
    { value: 'occupational', label: 'Terapia Ocupacional' },
    { value: 'behavioral', label: 'Terapia Comportamental' },
    { value: 'psychotherapy', label: 'Psicoterapia' },
    { value: 'physical', label: 'Fisioterapia' },
  ];

  // Accommodation options
  const accommodationOptions = [
    { value: 'extended_time', label: 'Tempo Estendido' },
    { value: 'modified_materials', label: 'Materiais Adaptados' },
    { value: 'preferential_seating', label: 'Assento Preferencial' },
    { value: 'assistive_technology', label: 'Tecnologia Assistiva' },
    { value: 'scribe', label: 'Escriba/Auxílio na Escrita' },
  ];

  // Support level options
  const supportLevelOptions = [
    { value: 'minimal', label: 'Mínimo' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'substantial', label: 'Substancial' },
    { value: 'very_substantial', label: 'Muito Substancial' },
  ];

  // Handle age range change
  const handleAgeChange = (field: 'minAge' | 'maxAge', value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  // Handle grade level toggle
  const handleGradeLevelToggle = (value: string) => {
    const updatedLevels = filters.gradeLevels.includes(value)
      ? filters.gradeLevels.filter(level => level !== value)
      : [...filters.gradeLevels, value];

    onChange({
      ...filters,
      gradeLevels: updatedLevels,
    });
  };

  // Handle diagnosis filter change
  const handleDiagnosisFilterChange = (value: 'all' | 'with' | 'without') => {
    onChange({
      ...filters,
      diagnosisFilter: value,
      // Clear diagnosis types if not filtering for students with diagnosis
      diagnosisTypes: value === 'with' ? filters.diagnosisTypes : [],
    });
  };

  // Handle diagnosis type toggle
  const handleDiagnosisTypeToggle = (value: string) => {
    const updatedTypes = filters.diagnosisTypes.includes(value)
      ? filters.diagnosisTypes.filter(type => type !== value)
      : [...filters.diagnosisTypes, value];

    onChange({
      ...filters,
      diagnosisTypes: updatedTypes,
    });
  };

  // Handle therapy toggle
  const handleTherapyToggle = (value: string) => {
    const updatedTherapies = filters.therapies.includes(value)
      ? filters.therapies.filter(therapy => therapy !== value)
      : [...filters.therapies, value];

    onChange({
      ...filters,
      therapies: updatedTherapies,
    });
  };

  // Handle accommodation toggle
  const handleAccommodationToggle = (value: string) => {
    const updatedAccommodations = filters.accommodations.includes(value)
      ? filters.accommodations.filter(acc => acc !== value)
      : [...filters.accommodations, value];

    onChange({
      ...filters,
      accommodations: updatedAccommodations,
    });
  };

  // Handle support level toggle
  const handleSupportLevelToggle = (value: string) => {
    const updatedSupportLevels = filters.supportLevels.includes(value)
      ? filters.supportLevels.filter(level => level !== value)
      : [...filters.supportLevels, value];

    onChange({
      ...filters,
      supportLevels: updatedSupportLevels,
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 pt-6">
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Filtros Básicos</TabsTrigger>
            <TabsTrigger value="advanced">Filtros Avançados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Age filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Idade</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minAge" className="text-xs mb-1">
                      Mínima
                    </Label>
                    <Input
                      id="minAge"
                      type="number"
                      min="0"
                      max="25"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => handleAgeChange('minAge', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAge" className="text-xs mb-1">
                      Máxima
                    </Label>
                    <Input
                      id="maxAge"
                      type="number"
                      min="0"
                      max="25"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => handleAgeChange('maxAge', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Grade level filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Série</h3>
                <div className="grid grid-cols-2 gap-2">
                  {gradeLevelOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`grade-${option.value}`}
                        checked={filters.gradeLevels.includes(option.value)}
                        onCheckedChange={() => handleGradeLevelToggle(option.value)}
                      />
                      <Label
                        htmlFor={`grade-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnosis filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Diagnóstico</h3>
                <RadioGroup
                  value={filters.diagnosisFilter}
                  onValueChange={(value: any) => handleDiagnosisFilterChange(value)}
                  className="mb-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-diagnosis" />
                    <Label htmlFor="all-diagnosis" className="text-sm font-normal cursor-pointer">
                      Todos os estudantes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="with" id="with-diagnosis" />
                    <Label htmlFor="with-diagnosis" className="text-sm font-normal cursor-pointer">
                      Com diagnóstico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="without" id="without-diagnosis" />
                    <Label htmlFor="without-diagnosis" className="text-sm font-normal cursor-pointer">
                      Sem diagnóstico
                    </Label>
                  </div>
                </RadioGroup>

                {filters.diagnosisFilter === 'with' && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground mb-2">Tipo de diagnóstico:</p>
                    <div className="space-y-1">
                      {diagnosisTypeOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`diagnosis-${option.value}`}
                            checked={filters.diagnosisTypes.includes(option.value)}
                            onCheckedChange={() => handleDiagnosisTypeToggle(option.value)}
                          />
                          <Label
                            htmlFor={`diagnosis-${option.value}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Therapies filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Terapias</h3>
                <div className="space-y-1">
                  {therapyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`therapy-${option.value}`}
                        checked={filters.therapies?.includes(option.value)}
                        onCheckedChange={() => handleTherapyToggle(option.value)}
                      />
                      <Label
                        htmlFor={`therapy-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accommodations filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Adaptações</h3>
                <div className="space-y-1">
                  {accommodationOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`accommodation-${option.value}`}
                        checked={filters.accommodations?.includes(option.value)}
                        onCheckedChange={() => handleAccommodationToggle(option.value)}
                      />
                      <Label
                        htmlFor={`accommodation-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support level filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Nível de Suporte</h3>
                <div className="space-y-1">
                  {supportLevelOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`support-${option.value}`}
                        checked={filters.supportLevels?.includes(option.value)}
                        onCheckedChange={() => handleSupportLevelToggle(option.value)}
                      />
                      <Label
                        htmlFor={`support-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onReset} type="button">
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentFilters;
