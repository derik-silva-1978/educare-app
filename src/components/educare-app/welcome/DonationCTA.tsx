import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';

const DonationCTA: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base">Apoie o Educare+</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ajude-nos a levar desenvolvimento infantil de qualidade para mais famílias.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/30 flex-shrink-0"
          >
            <Heart className="h-4 w-4 mr-2" />
            Colaborar
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationCTA;
