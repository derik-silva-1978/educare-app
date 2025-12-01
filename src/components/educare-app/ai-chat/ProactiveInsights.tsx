
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { useAIAssistant, AIChildContext } from '@/hooks/useAIAssistant';
import { DevelopmentDomain, DomainLabels } from '@/types/assessment';
import { Badge } from '@/components/ui/badge';

interface ProactiveInsightsProps {
  childContext: AIChildContext;
  onInsightClick?: (insight: string) => void;
}

export const ProactiveInsights: React.FC<ProactiveInsightsProps> = ({ 
  childContext,
  onInsightClick 
}) => {
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const { generateInsight } = useAIAssistant();
  
  // Identify domains that need focus (progress < 70%)
  const focusDomains = childContext.developmentAreas
    .filter(area => area.progress < 70)
    .slice(0, 3) // Top 3 areas needing most focus
    .map(area => area.domain);
  
  const generateDomainInsight = async (domain: string) => {
    setIsGenerating(prev => ({ ...prev, [domain]: true }));
    
    try {
      const insight = await generateInsight(childContext, domain);
      if (insight) {
        setInsights(prev => ({ ...prev, [domain]: insight }));
      }
    } catch (error) {
      console.error(`Error generating insight for ${domain}:`, error);
    } finally {
      setIsGenerating(prev => ({ ...prev, [domain]: false }));
    }
  };
  
  const handleInsightClick = (domain: string) => {
    if (insights[domain] && onInsightClick) {
      onInsightClick(insights[domain]);
    }
  };
  
  // Generate one initial insight on component mount
  useEffect(() => {
    if (focusDomains.length > 0 && !insights[focusDomains[0]]) {
      generateDomainInsight(focusDomains[0]);
    }
  }, []);
  
  if (focusDomains.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4 border-slate-300 bg-slate-50">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-sm font-medium text-slate-900">Insights baseados em dados</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-400 font-medium">
            IA Personalizada
          </Badge>
        </div>
        <CardDescription className="text-xs pt-1 text-slate-800 font-medium">
          Sugestões personalizadas baseadas nas avaliações de {childContext.childName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pb-3 space-y-3">
        {focusDomains.map((domain) => (
          <div key={domain} className="rounded-md bg-white p-3 border-2 shadow-sm border-slate-300">
            <div className="flex justify-between items-center mb-1.5">
              <h4 className="text-xs font-medium text-slate-900">
                {DomainLabels[domain] || domain}
              </h4>
              {!insights[domain] ? (
                <Button 
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-slate-800 hover:bg-amber-100 font-medium"
                  onClick={() => generateDomainInsight(domain)}
                  disabled={isGenerating[domain]}
                >
                  {isGenerating[domain] ? (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-1" />
                  )}
                  Gerar
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-amber-700 hover:bg-amber-100 font-medium"
                  onClick={() => handleInsightClick(domain)}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="text-xs text-slate-800">
              {isGenerating[domain] ? (
                <div className="flex items-center justify-center py-2">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2 text-amber-700" />
                  <span className="text-slate-800 font-medium">Gerando insight...</span>
                </div>
              ) : insights[domain] ? (
                <p className="line-clamp-2 text-slate-800">{insights[domain]}</p>
              ) : (
                <p className="italic text-slate-700">Clique em "Gerar" para obter sugestões personalizadas.</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProactiveInsights;
