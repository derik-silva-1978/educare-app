import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Clock, 
  Share2, 
  ExternalLink,
  Loader2,
  Newspaper
} from 'lucide-react';
import { httpClient } from '@/services/api/httpClient';
import { ContentItem } from '@/services/contentService';
import { toast } from 'sonner';

const getNewsById = async (id: string): Promise<ContentItem | null> => {
  try {
    const response = await httpClient.get(`/api/content/${id}/public`);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
};

const incrementViewCount = async (id: string): Promise<void> => {
  try {
    await httpClient.post(`/api/content/${id}/view`, {}, { requiresAuth: false });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
};

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news-detail', id],
    queryFn: () => getNewsById(id!),
    enabled: !!id,
  });

  const viewMutation = useMutation({
    mutationFn: () => incrementViewCount(id!),
  });

  useEffect(() => {
    if (id && news) {
      viewMutation.mutate();
    }
  }, [id, news]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.title || 'Notícia Educare+',
          text: news?.summary || news?.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  const handleCtaClick = () => {
    if (news?.cta_url) {
      window.open(news.cta_url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de leitura`;
  };

  const fallbackImages = [
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522662304937-f69f11b8b739?w=800&h=400&fit=crop',
  ];

  const getImageUrl = () => {
    if (news?.image_url) return news.image_url;
    const hash = id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return fallbackImages[hash % fallbackImages.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-lg font-semibold mb-2">Notícia não encontrada</h2>
            <p className="text-muted-foreground mb-4">
              A notícia que você procura pode ter sido removida ou não existe.
            </p>
            <Button onClick={() => navigate('/educare-app/welcome')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/educare-app/welcome')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Início
        </Button>

        <article className="space-y-6">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={getImageUrl()}
              alt={news.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {news.category && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {news.category}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {news.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {news.publish_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(news.publish_date)}</span>
              </div>
            )}
            
            {news.description && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(news.description)}</span>
              </div>
            )}
            
            {news.view_count !== undefined && news.view_count > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{news.view_count} visualizações</span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="ml-auto"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          <Separator />

          {news.summary && (
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
              {news.summary}
            </p>
          )}

          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: news.description || '' }}
          />

          {news.cta_url && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Quer saber mais?</h3>
                    <p className="text-sm text-muted-foreground">
                      Acesse o conteúdo completo clicando no botão ao lado.
                    </p>
                  </div>
                  <Button onClick={handleCtaClick} className="whitespace-nowrap">
                    {news.cta_text || 'Saiba mais'}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {news.creator && (
            <div className="flex items-center gap-3 pt-4 border-t">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {news.creator.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">Publicado por</p>
                <p className="text-sm text-muted-foreground">{news.creator.name || 'Equipe Educare+'}</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
