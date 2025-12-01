
export const useFormProgress = (formData: Record<string, any>, requiredFields: string[]) => {
  const calculateProgress = () => {
    const filledFields = requiredFields.filter(field => {
      const value = formData[field];
      if (field.includes('date') && value instanceof Date) return true;
      return value !== undefined && value !== '' && value !== null;
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  return calculateProgress();
};
