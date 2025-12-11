/**
 * FAQ Analytics Dashboard
 * Visualiza métricas e analytics do sistema de FAQ Dinâmica Contextual
 * Para Owner/Admin apenas
 */

import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import httpClient from '@/services/api/httpClient';

interface FAQSummary {
  total_faqs: number;
  total_usage: number;
  total_upvotes: number;
  total_downvotes: number;
  avg_usage: number;
  seed_faqs: number;
  custom_faqs: number;
}

interface TopFAQ {
  id: string;
  category: string;
  question_text: string;
  usage_count: number;
  upvotes: number;
  downvotes: number;
  relevance_score: number;
}

interface ProblemFAQ {
  id: string;
  category: string;
  question_text: string;
  downvotes: number;
  upvotes: number;
  negative_ratio: number;
}

interface CategoryStats {
  category: string;
  count: number;
  total_usage: number;
  total_upvotes: number;
  total_downvotes: number;
}

interface AnalyticsData {
  summary: FAQSummary;
  topFaqs: TopFAQ[];
  problemFaqs: ProblemFAQ[];
  byCategory: CategoryStats[];
}

const CATEGORY_COLORS = {
  child: '#3b82f6',
  mother: '#ec4899',
  system: '#8b5cf6'
};

const CATEGORY_LABELS = {
  child: 'Bebê',
  mother: 'Mãe',
  system: 'Sistema'
};

const FAQAnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TopFAQ[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get<AnalyticsData>('faqs/analytics');
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as métricas de FAQ',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.length < 2) {
      toast({
        title: 'Busca inválida',
        description: 'Digite pelo menos 2 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await httpClient.get<TopFAQ[]>(`faqs/search?q=${encodeURIComponent(searchTerm)}&limit=10`);
      if (response.success && response.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao buscar FAQs',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Carregando métricas de FAQ...</p>
        </div>
      </div>
    );
  }

  const summary = analytics?.summary || {
    total_faqs: 0,
    total_usage: 0,
    total_upvotes: 0,
    total_downvotes: 0,
    avg_usage: 0,
    seed_faqs: 0,
    custom_faqs: 0
  };

  const categoryData = (analytics?.byCategory || []).map(cat => ({
    name: CATEGORY_LABELS[cat.category as keyof typeof CATEGORY_LABELS] || cat.category,
    value: Number(cat.count),
    color: CATEGORY_COLORS[cat.category as keyof typeof CATEGORY_COLORS] || '#6b7280'
  }));

  const engagementData = (analytics?.byCategory || []).map(cat => ({
    category: CATEGORY_LABELS[cat.category as keyof typeof CATEGORY_LABELS] || cat.category,
    upvotes: Number(cat.total_upvotes),
    downvotes: Number(cat.total_downvotes),
    usage: Number(cat.total_usage)
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-blue-500" />
            FAQ Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Métricas e performance do sistema de FAQ Dinâmica Contextual
          </p>
        </div>
        <Button 
          onClick={loadAnalytics} 
          variant="outline"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total FAQs</p>
                <p className="text-3xl font-bold mt-1">{summary.total_faqs}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.seed_faqs} seed / {summary.custom_faqs} custom
                </p>
              </div>
              <HelpCircle className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Visualizações</p>
                <p className="text-3xl font-bold mt-1">{summary.total_usage}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Média: {Number(summary.avg_usage).toFixed(1)} por FAQ
                </p>
              </div>
              <Eye className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Upvotes</p>
                <p className="text-3xl font-bold mt-1 text-green-600">{summary.total_upvotes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Feedback positivo
                </p>
              </div>
              <ThumbsUp className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Downvotes</p>
                <p className="text-3xl font-bold mt-1 text-red-600">{summary.total_downvotes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Feedback negativo
                </p>
              </div>
              <ThumbsDown className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
            <CardDescription>Quantidade de FAQs por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engajamento por Categoria</CardTitle>
            <CardDescription>Upvotes e downvotes por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="upvotes" fill="#22c55e" name="Upvotes" />
                  <Bar dataKey="downvotes" fill="#ef4444" name="Downvotes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top FAQs & Problem FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top 10 FAQs
            </CardTitle>
            <CardDescription>FAQs com maior score de relevância</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {(analytics?.topFaqs || []).map((faq, index) => (
                <div 
                  key={faq.id} 
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{faq.question_text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[faq.category as keyof typeof CATEGORY_LABELS] || faq.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {faq.usage_count}
                      </span>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> {faq.upvotes}
                      </span>
                      <span className="text-xs text-red-600 flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" /> {faq.downvotes}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {Number(faq.relevance_score).toFixed(1)}
                  </span>
                </div>
              ))}
              {(analytics?.topFaqs || []).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma FAQ com dados de engajamento ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Problem FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              FAQs para Revisão
            </CardTitle>
            <CardDescription>FAQs com muitos downvotes (candidatas a melhoria)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {(analytics?.problemFaqs || []).map((faq) => (
                <div 
                  key={faq.id} 
                  className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{faq.question_text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[faq.category as keyof typeof CATEGORY_LABELS] || faq.category}
                      </Badge>
                      <span className="text-xs text-red-600 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {faq.downvotes} downvotes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(analytics?.problemFaqs || []).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma FAQ problemática identificada
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar FAQs
          </CardTitle>
          <CardDescription>Pesquise FAQs pelo texto da pergunta ou contexto RAG</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {searchResults.map((faq) => (
                <div 
                  key={faq.id} 
                  className="flex items-center justify-between p-2 bg-muted/30 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{faq.question_text}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {CATEGORY_LABELS[faq.category as keyof typeof CATEGORY_LABELS] || faq.category}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-blue-600 ml-2">
                    Score: {Number(faq.relevance_score).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQAnalyticsDashboard;
