
import React from 'react';
import { PEIProgress } from '@/hooks/usePEI';
import { TrendingUp, TrendingDown, MinusCircle, Check, AlertCircle, Clock, ArrowRight } from 'lucide-react';

// Convert status to numeric value for charting
export const getProgressValue = (status: PEIProgress['status']): number => {
  const values: Record<PEIProgress['status'], number> = {
    regression: 0,
    no_change: 25,
    minor_progress: 50,
    significant_progress: 75,
    achieved: 100
  };
  return values[status];
};

// Get trend icon based on progress trend
export const getTrendIcon = (trend: 'positive' | 'negative' | 'neutral') => {
  if (trend === 'positive') {
    return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  } else if (trend === 'negative') {
    return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  } else {
    return <MinusCircle className="h-3.5 w-3.5 text-gray-400" />;
  }
};

// Get trend message based on progress trend
export const getTrendMessage = (trend: 'positive' | 'negative' | 'neutral'): string => {
  if (trend === 'positive') {
    return 'Tendência de melhora';
  } else if (trend === 'negative') {
    return 'Tendência de regressão';
  } else {
    return 'Sem alteração significativa';
  }
};

// Get status color based on status
export const getStatusColor = (status: PEIProgress['status']): string => {
  const colors = {
    regression: 'bg-red-500',
    no_change: 'bg-gray-400',
    minor_progress: 'bg-blue-400',
    significant_progress: 'bg-blue-600',
    achieved: 'bg-green-500'
  };
  return colors[status];
};

// Get status icon based on status
export const getStatusIcon = (status: PEIProgress['status']) => {
  switch (status) {
    case 'regression':
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    case 'no_change':
      return <Clock className="h-3 w-3 text-gray-400" />;
    case 'minor_progress':
      return <ArrowRight className="h-3 w-3 text-blue-400" />;
    case 'significant_progress':
      return <TrendingUp className="h-3 w-3 text-blue-600" />;
    case 'achieved':
      return <Check className="h-3 w-3 text-green-500" />;
    default:
      return null;
  }
};

// Get status label based on status
export const getStatusLabel = (status: PEIProgress['status']): string => {
  const labels = {
    regression: 'Regressão',
    no_change: 'Sem Alteração',
    minor_progress: 'Progresso Leve',
    significant_progress: 'Progresso Significativo',
    achieved: 'Objetivo Alcançado'
  };
  return labels[status];
};
