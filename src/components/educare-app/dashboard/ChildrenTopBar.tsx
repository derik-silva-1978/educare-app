import React from 'react';
import { Baby, Calendar, Heart, User, Plus } from 'lucide-react';
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
  avatarUrl?: string;
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

  const getChildFirstName = (child: ChildData) => {
    return child.firstName || child.first_name || '';
  };

  const getChildBirthDate = (child: ChildData) => {
    return child.birthDate || child.birthdate;
  };

  const getInitials = (child: ChildData) => {
    const first = (child.firstName || child.first_name || '')[0] || '';
    const last = (child.lastName || child.last_name || '')[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {isMotherJourney ? 'Jornada Materna' : 'Acompanhamento'}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300">
          {childList.map((child) => {
            const isSelected = selectedChildId === child.id && journeyType === 'child';
            const birthDate = getChildBirthDate(child);
            const ageDisplay = birthDate ? getDetailedAgeDisplay(birthDate) : '';
            
            return (
              <button
                key={child.id}
                onClick={() => handleChildSelect(child.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 flex-shrink-0 min-w-0",
                  "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1",
                  isSelected 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200" 
                    : "bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                  isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                )}>
                  {child.avatarUrl ? (
                    <img src={child.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{getInitials(child)}</span>
                  )}
                </div>
                
                <div className="flex flex-col items-start min-w-0">
                  <span className={cn(
                    "text-sm font-semibold truncate max-w-[140px]",
                    isSelected ? "text-white" : "text-gray-900"
                  )}>
                    {getChildFirstName(child)}
                  </span>
                  {ageDisplay && (
                    <span className={cn(
                      "text-[11px] flex items-center gap-1",
                      isSelected ? "text-white/80" : "text-gray-500"
                    )}>
                      <Calendar className="w-3 h-3" />
                      {ageDisplay}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {showMotherOption && (
            <>
              {childList.length > 0 && (
                <div className="w-px bg-gray-200 self-stretch my-1 flex-shrink-0" />
              )}
              <button
                onClick={handleMotherSelect}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 flex-shrink-0 min-w-0",
                  "focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1",
                  isMotherJourney
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200" 
                    : "bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-pink-700 border border-gray-200 hover:border-pink-200"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  isMotherJourney ? "bg-white/20" : "bg-pink-100"
                )}>
                  <Heart className={cn(
                    "w-4 h-4",
                    isMotherJourney ? "text-white" : "text-pink-600"
                  )} />
                </div>
                
                <div className="flex flex-col items-start min-w-0">
                  <span className={cn(
                    "text-sm font-semibold",
                    isMotherJourney ? "text-white" : "text-gray-900"
                  )}>
                    Minha Jornada
                  </span>
                  <span className={cn(
                    "text-[11px]",
                    isMotherJourney ? "text-white/80" : "text-gray-500"
                  )}>
                    Saúde materna
                  </span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildrenTopBar;
