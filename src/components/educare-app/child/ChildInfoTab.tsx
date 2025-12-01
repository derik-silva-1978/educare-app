
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Droplet } from 'lucide-react';

interface ChildInfoTabProps {
  childData: any;
}

export const ChildInfoTab: React.FC<ChildInfoTabProps> = ({ childData }) => {
  if (!childData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma informação disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
              <p className="text-lg font-semibold">{childData.first_name} {childData.last_name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>{new Date(childData.birthdate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gênero</label>
              <p className="capitalize">{childData.gender}</p>
            </div>
            
            {childData.city && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p>{childData.city}</p>
                </div>
              </div>
            )}
            
            {childData.bloodtype && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo Sanguíneo</label>
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{childData.bloodtype}</Badge>
                </div>
              </div>
            )}
          </div>
          
          {childData.observations && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Observações</label>
              <p className="text-sm text-muted-foreground mt-1">{childData.observations}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
