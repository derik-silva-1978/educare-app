
// Placeholder for backward compatibility
// The quiz import system has been removed, only Journey Bot remains

export const importQuizData = () => {
  console.warn('Quiz import functionality has been removed. Use Journey Bot instead.');
  return Promise.resolve([]);
};

export const validateQuizData = () => {
  console.warn('Quiz validation functionality has been removed. Use Journey Bot instead.');
  return { isValid: false, errors: ['Quiz system has been removed'] };
};
