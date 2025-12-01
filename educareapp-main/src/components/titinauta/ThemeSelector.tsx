import React from 'react';
import { Palette } from 'lucide-react';
import useTitiNautaTheme, { ThemeColor } from '@/hooks/useTitiNautaTheme';

interface ThemeSelectorProps {
  childId: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ childId }) => {
  const { currentTheme, setTheme, availableThemes } = useTitiNautaTheme(childId);
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (theme: ThemeColor) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector">
      <button 
        className="theme-selector-button" 
        onClick={toggleOpen}
        style={{ backgroundColor: currentTheme.primary }}
      >
        <Palette className="h-4 w-4" />
        <span>Tema</span>
      </button>
      
      {isOpen && (
        <div className="theme-selector-dropdown">
          <div className="theme-selector-header">
            <h3>Escolha um tema</h3>
          </div>
          <div className="theme-selector-options">
            {availableThemes.map((theme) => (
              <button
                key={theme}
                className={`theme-option ${currentTheme.name === theme ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme)}
                style={{ backgroundColor: themes[theme].primary }}
              >
                <span className="theme-option-name">{capitalizeFirstLetter(theme)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper para capitalizar primeira letra
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Exportar temas para uso no componente
const themes: Record<ThemeColor, { primary: string }> = {
  green: { primary: '#22c55e' },
  blue: { primary: '#3b82f6' },
  purple: { primary: '#8b5cf6' },
  orange: { primary: '#f97316' },
  pink: { primary: '#ec4899' }
};

export default ThemeSelector;
