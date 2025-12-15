import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Newspaper, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNewsContent, ContentItem } from '@/services/contentService';

const NewsCarousel: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: news, isLoading } = useQuery({
    queryKey: ['welcome-news'],
    queryFn: getNewsContent,
    staleTime: 5 * 60 * 1000,
  });

  const handleNewsClick = (newsId: string) => {
    navigate(`/educare-app/news/${newsId}`);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Newspaper className="h-5 w-5 text-blue-600" />
          Últimas Notícias e Anúncios
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !news || news.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Newspaper className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notícia disponível</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item: ContentItem) => {
              const fallbackImages = [
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1522662304937-f69f11b8b739?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1521737604893-6f3031224c94?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1516552404090-6a0f9f4b1e7b?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1488190211105-8342361f853c?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1504711331261-cae0b4b58a9b?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1526779259212-7adae4c3d734?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1469521318250-8f72c59fa1a6?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1493514789560-586cb221d7c7?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1511576661531-b34c7eaf8722?w=400&h=250&fit=crop',
              ];
              const hashCode = (str: string) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                  const char = str.charCodeAt(i);
                  hash = ((hash << 5) - hash) + char;
                  hash = hash & hash;
                }
                return Math.abs(hash);
              };
              const fallbackImage = fallbackImages[hashCode(item.id) % fallbackImages.length];
              return (
              <div
                key={item.id}
                onClick={() => handleNewsClick(item.id)}
                className="group cursor-pointer rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={item.image_url || fallbackImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {item.publish_date ? new Date(item.publish_date).toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Recente'}
                  </p>
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.summary || item.description}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                    onClick={() => handleNewsClick(item.id)}
                  >
                    {item.cta_text || 'Ler mais'} <ArrowRight className="h-3 w-3 ml-1" />
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

export default NewsCarousel;
