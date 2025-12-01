
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type KPICardsProps = {
  inProgress: number;
  completed: number;
  pending: number;
};

const KPICards: React.FC<KPICardsProps> = ({ inProgress, completed, pending }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <Card>
      <CardContent className="py-4 text-center">
        <div className="text-lg font-semibold mb-2 text-blue-700">Em Progresso</div>
        <div className="text-3xl font-bold">{inProgress}</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="py-4 text-center">
        <div className="text-lg font-semibold mb-2 text-green-700">Concluídos</div>
        <div className="text-3xl font-bold">{completed}</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="py-4 text-center">
        <div className="text-lg font-semibold mb-2 text-amber-700">Pendentes</div>
        <div className="text-3xl font-bold">{pending}</div>
      </CardContent>
    </Card>
  </div>
);

export default KPICards;
