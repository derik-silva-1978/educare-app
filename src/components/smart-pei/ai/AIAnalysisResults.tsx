
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIAnalysisResult } from '@/utils/ai-service';
import { Lightbulb, TrendingUp, CheckCircle, AlertTriangle, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AIAnalysisResultsProps {
  analysisResult: AIAnalysisResult;
  title?: string;
  showConfidenceScore?: boolean;
}

export const AIAnalysisResults: React.FC<AIAnalysisResultsProps> = ({ 
  analysisResult,
  title = "Análise com IA",
  showConfidenceScore = true
}) => {
  const confidencePercentage = analysisResult.confidenceScore 
    ? Math.round(analysisResult.confidenceScore * 100) 
    : null;
    
  const getConfidenceColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.5) return 'text-amber-500';
    return 'text-red-500';
  };
  
  return (
    <Card className="ai-analysis-results">
      <CardHeader className="border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {showConfidenceScore && confidencePercentage !== null && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground mb-1">Nível de confiança</span>
              <div className="flex items-center gap-2">
                <Progress 
                  value={confidencePercentage} 
                  className="h-2 w-20" 
                />
                <span className={`text-sm font-medium ${getConfidenceColor(analysisResult.confidenceScore)}`}>
                  {confidencePercentage}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="summary">
          <p className="text-sm text-muted-foreground mb-1">Sumário</p>
          <p>{analysisResult.summary}</p>
        </div>
        
        {analysisResult.crossDomainInsights && analysisResult.crossDomainInsights.length > 0 && (
          <div className="cross-domain-insights">
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 mr-2 text-purple-500" />
              <h3 className="font-medium">Insights Integrados</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm pl-5">
              {analysisResult.crossDomainInsights.map((insight, index) => (
                <li key={`insight-${index}`}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
        
        {analysisResult.strengths.length > 0 && (
          <div className="strengths">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <h3 className="font-medium">Pontos Fortes</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm pl-5">
              {analysisResult.strengths.map((strength, index) => (
                <li key={`strength-${index}`}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        
        {analysisResult.challenges.length > 0 && (
          <div className="challenges">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              <h3 className="font-medium">Desafios</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm pl-5">
              {analysisResult.challenges.map((challenge, index) => (
                <li key={`challenge-${index}`}>{challenge}</li>
              ))}
            </ul>
          </div>
        )}
        
        {analysisResult.recommendations.length > 0 && (
          <div className="recommendations">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
              <h3 className="font-medium">Recomendações</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm pl-5">
              {analysisResult.recommendations.map((recommendation, index) => (
                <li key={`recommendation-${index}`}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
        
        {analysisResult.nextSteps.length > 0 && (
          <div className="next-steps">
            <div className="flex items-center mb-2">
              <ArrowRight className="h-4 w-4 mr-2 text-purple-500" />
              <h3 className="font-medium">Próximos Passos</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm pl-5">
              {analysisResult.nextSteps.map((step, index) => (
                <li key={`step-${index}`}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisResults;
