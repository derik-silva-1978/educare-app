import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Calendar } from 'lucide-react';
import { getDetailedAgeDisplay } from '@/utils/educare-app/calculateAge';
import { useSelectedChild } from '@/contexts/SelectedChildContext';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  age: number;
}

interface ChildSelectorProps {
  children: Child[];
}

const ChildSelector: React.FC<ChildSelectorProps> = ({ children }) => {
  const { selectedChildId, setSelectedChildId } = useSelectedChild();

  // Auto-select first child if none selected
  React.useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId, setSelectedChildId]);

  const selectedChild = children.find(child => child.id === selectedChildId);

  if (children.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Baby className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="mb-2">
              <label className="text-sm font-medium text-blue-700 block mb-1">
                Criança Selecionada
              </label>
              <Select value={selectedChildId || ''} onValueChange={setSelectedChildId}>
                <SelectTrigger className="w-full bg-white border-blue-200">
                  <SelectValue placeholder="Selecione uma criança" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {child.firstName} {child.lastName}
                        </span>
                        <span className="text-sm text-gray-500">
                          • {getDetailedAgeDisplay(child.birthdate)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedChild && (
              <div className="flex items-center gap-4 text-sm text-blue-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{getDetailedAgeDisplay(selectedChild.birthdate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>{selectedChild.age} meses</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildSelector;