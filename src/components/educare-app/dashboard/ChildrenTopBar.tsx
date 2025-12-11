import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Calendar, ChevronRight } from 'lucide-react';
import { getDetailedAgeDisplay } from '@/utils/educare-app/calculateAge';
import { useSelectedChild } from '@/contexts/SelectedChildContext';
import { cn } from '@/lib/utils';

interface ChildData {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  birthDate?: string;
  birthdate?: string;
}

interface ChildrenTopBarProps {
  childList: ChildData[];
  onChildClick?: (childId: string) => void;
}

const ChildrenTopBar: React.FC<ChildrenTopBarProps> = ({ childList, onChildClick }) => {
  const { selectedChildId, setSelectedChildId } = useSelectedChild();

  React.useEffect(() => {
    if (!selectedChildId && childList.length > 0) {
      setSelectedChildId(childList[0].id);
    }
  }, [childList, selectedChildId, setSelectedChildId]);

  if (childList.length === 0) {
    return null;
  }

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId);
    if (onChildClick) {
      onChildClick(childId);
    }
  };

  const getChildName = (child: ChildData) => {
    const firstName = child.firstName || child.first_name || '';
    const lastName = child.lastName || child.last_name || '';
    return `${firstName} ${lastName}`.trim();
  };

  const getChildBirthDate = (child: ChildData) => {
    return child.birthDate || child.birthdate;
  };

  return (
    <div className="w-full">
      <div className={cn(
        "flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300",
        childList.length === 1 ? "justify-start" : ""
      )}>
        {childList.map((child) => {
          const isSelected = selectedChildId === child.id;
          const birthDate = getChildBirthDate(child);
          const ageDisplay = birthDate ? getDetailedAgeDisplay(birthDate) : 'Idade não informada';
          
          return (
            <Card
              key={child.id}
              onClick={() => handleChildSelect(child.id)}
              className={cn(
                "flex-shrink-0 cursor-pointer transition-all duration-200 hover:shadow-md min-w-[200px] max-w-[280px]",
                isSelected 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400 text-white" 
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-white/20" : "bg-blue-100"
                  )}>
                    <Baby className={cn(
                      "w-5 h-5",
                      isSelected ? "text-white" : "text-blue-600"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-semibold text-sm truncate",
                      isSelected ? "text-white" : "text-gray-900"
                    )}>
                      {getChildName(child)}
                    </h4>
                    <div className={cn(
                      "flex items-center gap-1 text-xs mt-0.5",
                      isSelected ? "text-white/80" : "text-blue-600"
                    )}>
                      <Calendar className="w-3 h-3" />
                      <span className="truncate">{ageDisplay}</span>
                    </div>
                  </div>

                  {childList.length > 1 && isSelected && (
                    <ChevronRight className="w-4 h-4 text-white/60 flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {childList.length > 1 && (
        <p className="text-xs text-muted-foreground mt-1">
          Clique para alternar entre crianças
        </p>
      )}
    </div>
  );
};

export default ChildrenTopBar;
