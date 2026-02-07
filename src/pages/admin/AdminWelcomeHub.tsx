import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { getAllContent, ContentItem } from '@/services/contentService';
import { BlogHighlights } from '@/components/educare-app/welcome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Newspaper,
  BookOpen,
  GraduationCap,
  Pencil,
  Settings,
  Image,
  Loader2,
  FileText,
  CheckCircle,
  Archive,
  Eye,
} from 'lucide-react';

const statusConfig = {
  draft: { label: 'Rascunho', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  published: { label: 'Publicado', className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  archived: { label: 'Arquivado', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400' },
};

const audienceConfig = {
  all: { label: 'Todos', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  parents: { label: 'Pais', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  professionals: { label: 'Profissionais', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
};

const sectionConfig = {
  news: { label: 'Noticias', icon: Newspaper, color: 'text-blue-600 dark:text-blue-400' },
  training: { label: 'Treinamentos', icon: BookOpen, color: 'text-amber-600 dark:text-amber-400' },
  course: { label: 'Cursos', icon: GraduationCap, color: 'text-purple-600 dark:text-purple-400' },
};

const ContentCard: React.FC<{ item: ContentItem; onEdit: () => void }> = ({ item, onEdit }) => {
  const status = statusConfig[item.status] || statusConfig.draft;
  const audience = audienceConfig[item.target_audience] || audienceConfig.all;

  return (
    <div className="group relative rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300">
      <div className="relative h-36 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge className={`text-[10px] px-1.5 py-0.5 ${status.className}`}>{status.label}</Badge>
          <Badge className={`text-[10px] px-1.5 py-0.5 ${audience.className}`}>{audience.label}</Badge>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="p-3 space-y-1.5">
        <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {item.summary || item.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          {item.view_count !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {item.view_count}
            </span>
          )}
          {item.publish_date && (
            <span>
              {new Date(item.publish_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminWelcomeHub: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-all-content'],
    queryFn: () => getAllContent({ limit: 100 }),
    staleTime: 2 * 60 * 1000,
  });

  const allItems = data?.data || [];

  const filteredItems = useMemo(() => {
    if (audienceFilter === 'all') return allItems;
    return allItems.filter(
      (item) => item.target_audience === 'all' || item.target_audience === audienceFilter
    );
  }, [allItems, audienceFilter]);

  const counts = useMemo(() => {
    const draft = allItems.filter((i) => i.status === 'draft').length;
    const published = allItems.filter((i) => i.status === 'published').length;
    const archived = allItems.filter((i) => i.status === 'archived').length;
    return { draft, published, archived, total: allItems.length };
  }, [allItems]);

  const groupedByType = useMemo(() => {
    const groups: Record<string, ContentItem[]> = { news: [], training: [], course: [] };
    filteredItems.forEach((item) => {
      if (groups[item.type]) groups[item.type].push(item);
    });
    return groups;
  }, [filteredItems]);

  const getContentManagementPath = () => {
    const path = window.location.pathname;
    if (path.includes('/owner/')) return '/educare-app/owner/content-management';
    return '/educare-app/admin/content-management';
  };

  const getMediaManagementPath = () => {
    const path = window.location.pathname;
    if (path.includes('/owner/')) return '/educare-app/owner/media-resources';
    return '/educare-app/admin/media-resources';
  };

  const handleEdit = () => {
    navigate(getContentManagementPath());
  };

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Sandbox de Conteudo</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Ola, {firstName}!
                </h1>
                <p className="text-slate-300 text-sm max-w-md">
                  Visualize e gerencie todo o conteudo do Welcome Hub como ele aparece para os usuarios.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-amber-400" />
                    <span className="text-slate-300">{counts.draft} rascunhos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">{counts.published} publicados</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Archive className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{counts.archived} arquivados</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-white text-slate-900 hover:bg-slate-100"
                    onClick={() => navigate(getContentManagementPath())}
                  >
                    <FileText className="h-4 w-4 mr-1.5" />
                    Gerenciar Conteudo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-800"
                    onClick={() => navigate(getMediaManagementPath())}
                  >
                    <Image className="h-4 w-4 mr-1.5" />
                    Midias
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Tabs value={audienceFilter} onValueChange={setAudienceFilter}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="parents">Pais</TabsTrigger>
              <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {(Object.keys(sectionConfig) as Array<keyof typeof sectionConfig>).map((type) => {
              const config = sectionConfig[type];
              const items = groupedByType[type] || [];
              const Icon = config.icon;

              return (
                <Card key={type}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-lg font-semibold">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        {config.label}
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {items.length}
                        </Badge>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {items.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Icon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhum conteudo nesta categoria</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                          <ContentCard key={item.id} item={item} onEdit={handleEdit} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            <BlogHighlights />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminWelcomeHub;
