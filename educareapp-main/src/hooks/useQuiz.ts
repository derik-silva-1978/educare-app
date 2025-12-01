
// This file has been simplified to only support the Journey Bot system
// All legacy quiz functionality has been removed

import { useState } from 'react';

export const useQuiz = () => {
  // Simplified state for compatibility
  const [isLoading] = useState(false);
  
  // Return minimal interface for backward compatibility
  return {
    isLoading,
    error: null,
    // Placeholder functions to prevent build errors
    setCurrentPhaseId: () => {},
    currentQuestionIndex: 0,
    setCurrentQuestionIndex: () => {},
    answers: {},
    updateAnswer: () => {},
    phases: [],
    questions: [],
    quizProgress: {},
    saveProgress: () => {},
    videoSuggestions: [],
    favoriteVideos: [],
    toggleVideoFavorite: () => {}
  };
};
