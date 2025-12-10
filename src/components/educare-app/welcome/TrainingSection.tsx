import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getTrainingContent, ContentItem } from '@/services/contentService';

const TrainingSection: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: trainings, isLoading } = useQuery({
    queryKey: ['welcome-trainings'],
    queryFn: getTrainingContent,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Treinamentos e Capacitação
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/educare-app/academia')}
          >
            Ver todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !trainings || trainings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum treinamento disponível</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainings.map((item: ContentItem, index: number) => {
              const fallbackImages = [
                'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1453928582348-c93905e3a7a0?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1516321318423-f06f70570ec0?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1434030216411-0b793bcad804?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1534417307012-b34494a514f5?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1599133407505-b56d0ce4f2db?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1427504494784-904bc9d2b378?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1522661335684-37898b6baf30?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1531615533034-ef7a2c56b912?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1553729784-e91953dec042?w=400&h=250&fit=crop',
              ];
              const fallbackImage = fallbackImages[index % fallbackImages.length];
              return (
              <div
                key={item.id}
                className="group cursor-pointer rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image_url || fallbackImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-4 space-y-2">
                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.summary || item.description}
                  </p>
                  {item.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </div>
                  )}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                  >
                    {item.cta_text || 'Saiba mais'} <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingSection;
