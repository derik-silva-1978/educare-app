import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  category: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Novo Guia de Desenvolvimento Infantil',
    summary: 'Lançamos um guia completo sobre os marcos do desenvolvimento do seu filho de 0 a 6 anos.',
    date: '2025-12-09',
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
    category: 'Guia',
  },
  {
    id: '2',
    title: 'Workshop de Estimulação Cognitiva',
    summary: 'Inscreva-se no nosso workshop online sobre técnicas de estimulação cognitiva para a primeira infância.',
    date: '2025-12-08',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=250&fit=crop',
    category: 'Evento',
  },
  {
    id: '3',
    title: 'Pesquisa de Satisfação 2024',
    summary: 'Sua opinião é importante! Participe da nossa pesquisa anual e ajude-nos a melhorar.',
    date: '2025-12-07',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
    category: 'Feedback',
  },
];

const NewsCarousel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Newspaper className="h-5 w-5 text-blue-600" />
          Últimas Notícias e Anúncios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockNews.map((news) => (
            <div
              key={news.id}
              className="group cursor-pointer rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(news.date).toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {news.summary}
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                >
                  Ler mais <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCarousel;
