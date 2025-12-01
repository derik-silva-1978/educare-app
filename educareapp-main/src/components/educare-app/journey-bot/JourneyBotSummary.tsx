
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useJourneyBotData } from './JourneyBotDataManager';
import { AnimatedBotAvatar } from './AnimatedBotAvatar';
import { DimensionLabels } from '@/types/journey-bot';
import { Trophy, RotateCcw, ArrowLeft, TrendingUp, Star } from 'lucide-react';

interface JourneyBotSummaryProps {
  onRestart: () => void;
  onBack: () => void;
}

const JourneyBotSummary: React.FC<JourneyBotSummaryProps> = ({
  onRestart,
  onBack
}) => {
  const { session, questions, responses } = useJourneyBotData();

  const getResponseSummary = () => {
    const yesCount = responses.filter(r => r.answer === 1).length;
    const noCount = responses.filter(r => r.answer === 2).length;
    const unknownCount = responses.filter(r => r.answer === 3).length;
    
    return { yesCount, noCount, unknownCount };
  };

  const getDimensionSummary = () => {
    const dimensionCounts: Record<string, { yes: number; no: number; unknown: number }> = {};
    
    responses.forEach(response => {
      if (!dimensionCounts[response.dimension]) {
        dimensionCounts[response.dimension] = { yes: 0, no: 0, unknown: 0 };
      }
      
      if (response.answer === 1) dimensionCounts[response.dimension].yes++;
      else if (response.answer === 2) dimensionCounts[response.dimension].no++;
      else dimensionCounts[response.dimension].unknown++;
    });
    
    return dimensionCounts;
  };

  const summary = getResponseSummary();
  const dimensionSummary = getDimensionSummary();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <AnimatedBotAvatar mood="celebrating" size="xl" />
            </div>
            <CardTitle className="text-3xl text-green-800 flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Jornada Concluída!
            </CardTitle>
            <p className="text-green-700 text-lg">
              Parabéns! Você completou {responses.length} perguntas sobre o desenvolvimento.
            </p>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumo das Respostas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{summary.yesCount}</div>
                <div className="text-sm text-green-700">Consegue fazer</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{summary.noCount}</div>
                <div className="text-sm text-red-700">Ainda não consegue</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-600">{summary.unknownCount}</div>
                <div className="text-sm text-gray-700">Precisa observar</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dimension Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Progresso por Área de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dimensionSummary).map(([dimension, counts]) => (
                <div key={dimension} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {DimensionLabels[dimension as keyof typeof DimensionLabels] || dimension}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {counts.yes + counts.no + counts.unknown} perguntas
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {counts.yes > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        {counts.yes} ✓
                      </Badge>
                    )}
                    {counts.no > 0 && (
                      <Badge className="bg-red-100 text-red-800">
                        {counts.no} ✗
                      </Badge>
                    )}
                    {counts.unknown > 0 && (
                      <Badge className="bg-gray-100 text-gray-800">
                        {counts.unknown} ?
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Nova Avaliação
        </Button>
        
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar ao Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default JourneyBotSummary;
