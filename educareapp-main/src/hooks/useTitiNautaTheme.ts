import { useState, useEffect } from 'react';

export type ThemeColor = 'green' | 'blue' | 'purple' | 'orange' | 'pink';

export interface Theme {
  name: ThemeColor;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  text: string;
  background: string;
  headerBackground: string;
  headerText: string;
  messageBackground: string;
  messageText: string;
  userMessageBackground: string;
  userMessageText: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
}

const themes: Record<ThemeColor, Theme> = {
  green: {
    name: 'green',
    primary: '#22c55e',
    primaryHover: '#16a34a',
    primaryLight: '#dcfce7',
    text: '#1f2937',
    background: '#e5e7eb',
    headerBackground: '#22c55e',
    headerText: '#ffffff',
    messageBackground: '#ffffff',
    messageText: '#1f2937',
    userMessageBackground: '#22c55e',
    userMessageText: '#ffffff',
    inputBackground: '#ffffff',
    inputBorder: '#e5e7eb',
    inputText: '#1f2937'
  },
  blue: {
    name: 'blue',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    text: '#1f2937',
    background: '#e5e7eb',
    headerBackground: '#3b82f6',
    headerText: '#ffffff',
    messageBackground: '#ffffff',
    messageText: '#1f2937',
    userMessageBackground: '#3b82f6',
    userMessageText: '#ffffff',
    inputBackground: '#ffffff',
    inputBorder: '#e5e7eb',
    inputText: '#1f2937'
  },
  purple: {
    name: 'purple',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primaryLight: '#ede9fe',
    text: '#1f2937',
    background: '#e5e7eb',
    headerBackground: '#8b5cf6',
    headerText: '#ffffff',
    messageBackground: '#ffffff',
    messageText: '#1f2937',
    userMessageBackground: '#8b5cf6',
    userMessageText: '#ffffff',
    inputBackground: '#ffffff',
    inputBorder: '#e5e7eb',
    inputText: '#1f2937'
  },
  orange: {
    name: 'orange',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#ffedd5',
    text: '#1f2937',
    background: '#e5e7eb',
    headerBackground: '#f97316',
    headerText: '#ffffff',
    messageBackground: '#ffffff',
    messageText: '#1f2937',
    userMessageBackground: '#f97316',
    userMessageText: '#ffffff',
    inputBackground: '#ffffff',
    inputBorder: '#e5e7eb',
    inputText: '#1f2937'
  },
  pink: {
    name: 'pink',
    primary: '#ec4899',
    primaryHover: '#db2777',
    primaryLight: '#fce7f3',
    text: '#1f2937',
    background: '#e5e7eb',
    headerBackground: '#ec4899',
    headerText: '#ffffff',
    messageBackground: '#ffffff',
    messageText: '#1f2937',
    userMessageBackground: '#ec4899',
    userMessageText: '#ffffff',
    inputBackground: '#ffffff',
    inputBorder: '#e5e7eb',
    inputText: '#1f2937'
  }
};

export const useTitiNautaTheme = (childId: string) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.green);

  // Carregar tema do localStorage
  useEffect(() => {
    if (!childId) return;
    
    try {
      const storedTheme = localStorage.getItem(`titinauta_theme_${childId}`);
      if (storedTheme && themes[storedTheme as ThemeColor]) {
        setCurrentTheme(themes[storedTheme as ThemeColor]);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  }, [childId]);

  // Salvar tema no localStorage
  const setTheme = (themeName: ThemeColor) => {
    if (!childId) return;
    
    try {
      localStorage.setItem(`titinauta_theme_${childId}`, themeName);
      setCurrentTheme(themes[themeName]);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  return {
    currentTheme,
    setTheme,
    availableThemes: Object.keys(themes) as ThemeColor[]
  };
};

export default useTitiNautaTheme;
