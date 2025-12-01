
export const validateUUID = (uuid?: string): string | null => {
  if (!uuid) return null;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(uuid) ? uuid : null;
};

export const generateUUID = (): string => {
  return crypto.randomUUID();
};
