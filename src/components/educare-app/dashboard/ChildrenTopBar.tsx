import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Calendar, ChevronRight, Heart, User } from 'lucide-react';
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
  showMotherOption?: boolean;
}

const ChildrenTopBar: React.FC<ChildrenTopBarProps> = ({ childList, onChildClick, showMotherOption = true }) => {
  const { selectedChildId, setSelectedChildId, journeyType, setJourneyType, isMotherJourney } = useSelectedChild();

  React.useEffect(() => {
    if (!selectedChildId && childList.length > 0 && journeyType === 'child') {
      setSelectedChildId(childList[0].id);
    }
  }, [childList, selectedChildId, setSelectedChildId, journeyType]);

  const handleChildSelect = (childId: string) => {
    setJourneyType('child');
    setSelectedChildId(childId);
    if (onChildClick) {
      onChildClick(childId);
    }
  };

  const handleMotherSelect = () => {
    setJourneyType('mother');
    setSelectedChildId(null);
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
        "justify-start"
      )}>
        {childList.map((child) => {
          const isSelected = selectedChildId === child.id && journeyType === 'child';
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

        {showMotherOption && (
          <Card
            onClick={handleMotherSelect}
            className={cn(
              "flex-shrink-0 cursor-pointer transition-all duration-200 hover:shadow-md min-w-[200px] max-w-[280px]",
              isMotherJourney
                ? "bg-gradient-to-r from-pink-500 to-rose-500 border-pink-400 text-white" 
                : "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 hover:border-pink-300"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  isMotherJourney ? "bg-white/20" : "bg-pink-100"
                )}>
                  <Heart className={cn(
                    "w-5 h-5",
                    isMotherJourney ? "text-white" : "text-pink-600"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-semibold text-sm truncate",
                    isMotherJourney ? "text-white" : "text-gray-900"
                  )}>
                    Minha Jornada
                  </h4>
                  <div className={cn(
                    "flex items-center gap-1 text-xs mt-0.5",
                    isMotherJourney ? "text-white/80" : "text-pink-600"
                  )}>
                    <User className="w-3 h-3" />
                    <span className="truncate">Saúde materna</span>
                  </div>
                </div>

                {isMotherJourney && (
                  <ChevronRight className="w-4 h-4 text-white/60 flex-shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {(childList.length > 0 || showMotherOption) && (
        <p className="text-xs text-muted-foreground mt-1">
          {childList.length === 0 
            ? 'Acompanhe sua jornada materna ou cadastre uma criança' 
            : childList.length > 1 || showMotherOption 
              ? 'Clique para alternar entre crianças ou sua jornada materna'
              : 'Clique para alternar entre seu bebê e sua jornada materna'}
        </p>
      )}
    </div>
  );
};

export default ChildrenTopBar;
