
import React from 'react';
import { Activity } from '@/types/activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ActivityListItem from './ActivityListItem';
import ActivityFilters from './ActivityFilters';
import useActivityFilters from '@/hooks/useActivityFilters';

export interface ActivitiesListProps {
  activities: Activity[];
  isLoading: boolean;
  onAddActivity?: () => void;
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({ 
  activities,
  isLoading,
  onAddActivity
}) => {
  const {
    filters,
    updateSearchTerm,
    sortedActivities
  } = useActivityFilters(activities);
  
  const handleSearch = (term: string) => {
    updateSearchTerm(term);
  };
  
  return (
    <div>
      <ActivityFilters
        onSearch={handleSearch}
        onFilterChange={() => {}}
      />
      
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : sortedActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Nenhuma atividade encontrada.</p>
            {onAddActivity && (
              <Button 
                onClick={onAddActivity}
                className="bg-sky-400 hover:bg-sky-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Atividade
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesList;
