
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ChildCard from './ChildCard';
import EmptyChildrenList from './EmptyChildrenList';
import { ChildrenListSkeleton } from './ChildrenListSkeleton';
import { ChildrenError } from './ChildrenError';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  age: number;
  city?: string;
  observations?: string;
  journey_progress?: number;
}

interface ChildrenListProps {
  children: Child[];
  isLoading: boolean;
  isError: boolean;
  onChildClick: (childId: string) => void;
  onRetry: () => void;
  onAddChild: () => void;
}

const ChildrenList: React.FC<ChildrenListProps> = ({ 
  children, 
  isLoading, 
  isError,
  onChildClick,
  onRetry,
  onAddChild
}) => {
  if (isLoading) {
    return <ChildrenListSkeleton />;
  }

  if (isError) {
    return <ChildrenError onRetry={onRetry} onAddChild={onAddChild} />;
  }

  if (children.length === 0) {
    return <EmptyChildrenList />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Suas Crianças</CardTitle>
          <Button 
            onClick={onAddChild}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Criança
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onCardClick={onChildClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildrenList;
