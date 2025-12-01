
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppearanceSettingsProps {
  onSave: () => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onSave }) => {
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    colorScheme: 'default',
    fontSize: 16,
    compactMode: false
  });
  
  const handleThemeChange = (value: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      theme: value
    }));
  };
  
  const handleFontSizeChange = (value: number[]) => {
    setAppearanceSettings(prev => ({
      ...prev,
      fontSize: value[0]
    }));
  };
  
  const handleColorSchemeChange = (value: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      colorScheme: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving appearance settings:', appearanceSettings);
    onSave();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-white border-b pb-4">
            <CardTitle className="text-slate-900">Personalização de Aparência</CardTitle>
            <CardDescription className="text-slate-600">
              Ajuste o tema, tamanho da fonte e outras configurações visuais
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3 text-slate-800">Tema</h3>
                
                <RadioGroup
                  value={appearanceSettings.theme}
                  onValueChange={handleThemeChange}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="light"
                      id="theme-light"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 text-slate-700"
                    >
                      <Sun className="mb-3 h-6 w-6 text-slate-700" />
                      Claro
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="theme-dark"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 text-slate-700"
                    >
                      <Moon className="mb-3 h-6 w-6 text-slate-700" />
                      Escuro
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="system"
                      id="theme-system"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:text-slate-900 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 text-slate-700"
                    >
                      <Monitor className="mb-3 h-6 w-6 text-slate-700" />
                      Sistema
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size" className="text-slate-800">Tamanho da fonte</Label>
                  <span className="text-sm text-slate-700 font-medium">{appearanceSettings.fontSize}px</span>
                </div>
                
                <Slider
                  id="font-size"
                  defaultValue={[appearanceSettings.fontSize]}
                  max={24}
                  min={12}
                  step={1}
                  onValueChange={handleFontSizeChange}
                  className="[&>.slider-thumb]:bg-blue-600 [&>.slider-track]:bg-blue-200"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>Pequena</span>
                  <span>Normal</span>
                  <span>Grande</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color-scheme" className="text-slate-800">Esquema de cores</Label>
                <Select
                  value={appearanceSettings.colorScheme}
                  onValueChange={handleColorSchemeChange}
                >
                  <SelectTrigger id="color-scheme" className="w-full border-slate-300 bg-white text-slate-900 focus:border-blue-500">
                    <SelectValue placeholder="Escolha um esquema de cores" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-slate-900">
                    <SelectItem value="default" className="text-slate-900">Padrão</SelectItem>
                    <SelectItem value="high-contrast" className="text-slate-900">Alto contraste</SelectItem>
                    <SelectItem value="colorful" className="text-slate-900">Colorido</SelectItem>
                    <SelectItem value="soft" className="text-slate-900">Suave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border border-blue-100 bg-blue-50 p-4 mt-6">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-blue-700" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900">Dica de acessibilidade</h4>
                  <p className="text-sm text-blue-800">
                    Para mais opções de acessibilidade, visite a aba Acessibilidade nas configurações.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4 bg-slate-50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setAppearanceSettings({
                  theme: 'system',
                  colorScheme: 'default',
                  fontSize: 16,
                  compactMode: false
                });
              }}
              className="text-slate-700 hover:text-red-600 hover:bg-red-50"
            >
              Restaurar padrões
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Salvar alterações
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AppearanceSettings;
