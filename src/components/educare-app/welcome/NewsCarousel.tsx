import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'novidade' | 'dica' | 'evento' | 'atualização';
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Nova funcionalidade: Marcos do Desenvolvimento',
    summary: 'Agora você pode acompanhar os marcos importantes do desenvolvimento do seu filho baseado nas recomendações do Ministério da Saúde.',
    date: '2025-12-09',
    category: 'novidade',
  },
  {
    id: '2',
    title: 'Dica: Estimulação da linguagem',
    summary: 'Converse com seu bebê durante as atividades diárias. Narrar o que você está fazendo ajuda no desenvolvimento da linguagem.',
    date: '2025-12-08',
    category: 'dica',
  },
  {
    id: '3',
    title: 'TitiNauta agora ainda mais inteligente',
    summary: 'Nosso assistente foi atualizado com novos recursos para oferecer orientações ainda mais personalizadas.',
    date: '2025-12-07',
    category: 'atualização',
  },
];

const getCategoryColor = (category: NewsItem['category']) => {
  switch (category) {
    case 'novidade':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'dica':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'evento':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    case 'atualização':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  }
};

const getCategoryLabel = (category: NewsItem['category']) => {
  switch (category) {
    case 'novidade':
      return 'Novidade';
    case 'dica':
      return 'Dica';
    case 'evento':
      return 'Evento';
    case 'atualização':
      return 'Atualização';
  }
};

const NewsCarousel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Newspaper className="h-5 w-5 text-blue-600" />
          Notícias e Anúncios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockNews.map((news) => (
          <div
            key={news.id}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getCategoryColor(news.category)}>
                    {getCategoryLabel(news.category)}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(news.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <h4 className="font-medium text-sm">{news.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{news.summary}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
        <Button variant="ghost" className="w-full text-sm" size="sm">
          Ver todas as notícias
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsCarousel;
