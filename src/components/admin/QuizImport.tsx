
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const QuizImport: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Quiz Import
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Quiz import functionality has been disabled. Only Journey Bot is available for assessments.
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizImport;
