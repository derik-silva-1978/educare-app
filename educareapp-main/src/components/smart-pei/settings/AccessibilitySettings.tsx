
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Eye, MousePointer2, Type, Keyboard } from 'lucide-react';

interface AccessibilitySettingsProps {
  onSave: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ onSave }) => {
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    textToSpeech: false,
    keyboardNavigation: true,
    screenReaderOptimized: false,
    animationSpeed: 1,
    fontFamily: 'system'
  });
  
  const handleToggle = (field: string) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };
  
  const handleAnimationSpeedChange = (value: number[]) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      animationSpeed: value[0]
    }));
  };
  
  const handleFontFamilyChange = (value: string) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      fontFamily: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving accessibility settings:', accessibilitySettings);
    onSave();
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Configurações de Acessibilidade</CardTitle>
          <CardDescription>
            Torne o Smart PEI mais acessível para suas necessidades específicas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Recursos visuais</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="high-contrast">Alto contraste</Label>
              </div>
              <Switch 
                id="high-contrast" 
                checked={accessibilitySettings.highContrast} 
                onCheckedChange={() => handleToggle('highContrast')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reduce-motion">Reduzir movimento</Label>
              </div>
              <Switch 
                id="reduce-motion" 
                checked={accessibilitySettings.reduceMotion} 
                onCheckedChange={() => handleToggle('reduceMotion')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="large-text">Texto grande</Label>
              </div>
              <Switch 
                id="large-text" 
                checked={accessibilitySettings.largeText} 
                onCheckedChange={() => handleToggle('largeText')} 
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tecnologias assistivas</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="keyboard-navigation">Navegação por teclado</Label>
              </div>
              <Switch 
                id="keyboard-navigation" 
                checked={accessibilitySettings.keyboardNavigation} 
                onCheckedChange={() => handleToggle('keyboardNavigation')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18.5V19.5M8.5 4.5H15.5M7 15.5H17M9 11.5H15M8 8.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <Label htmlFor="screen-reader">Otimizado para leitor de tela</Label>
              </div>
              <Switch 
                id="screen-reader" 
                checked={accessibilitySettings.screenReaderOptimized} 
                onCheckedChange={() => handleToggle('screenReaderOptimized')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <Label htmlFor="text-to-speech">Texto para fala</Label>
              </div>
              <Switch 
                id="text-to-speech" 
                checked={accessibilitySettings.textToSpeech} 
                onCheckedChange={() => handleToggle('textToSpeech')} 
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Personalizações avançadas</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="animation-speed">Velocidade de animação</Label>
                <span className="text-sm text-muted-foreground">
                  {accessibilitySettings.animationSpeed === 0
                    ? 'Desativado'
                    : accessibilitySettings.animationSpeed === 1
                    ? 'Normal'
                    : accessibilitySettings.animationSpeed > 1
                    ? 'Rápido'
                    : 'Lento'}
                </span>
              </div>
              
              <Slider
                id="animation-speed"
                defaultValue={[accessibilitySettings.animationSpeed]}
                max={2}
                min={0}
                step={0.1}
                onValueChange={handleAnimationSpeedChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Desativado</span>
                <span>Normal</span>
                <span>Rápido</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font-family">Família da fonte</Label>
              <Select
                value={accessibilitySettings.fontFamily}
                onValueChange={handleFontFamilyChange}
              >
                <SelectTrigger id="font-family" className="w-full">
                  <SelectValue placeholder="Escolha uma fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Padrão do sistema</SelectItem>
                  <SelectItem value="sans-serif">Sans Serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="monospace">Monospace</SelectItem>
                  <SelectItem value="dyslexic">Otimizada para dislexia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setAccessibilitySettings({
                highContrast: false,
                reduceMotion: false,
                largeText: false,
                textToSpeech: false,
                keyboardNavigation: true,
                screenReaderOptimized: false,
                animationSpeed: 1,
                fontFamily: 'system'
              });
            }}
          >
            Restaurar padrões
          </Button>
          <Button type="submit">
            Salvar alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AccessibilitySettings;
