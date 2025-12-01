
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTitibot } from '../TitibotProvider';
import { 
  PanelBottom, 
  PanelRight, 
  CornerDownRight, 
  CornerDownLeft 
} from "lucide-react";

const TitibotPositionSettings: React.FC = () => {
  const { position, setPosition } = useTitibot();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Posição do Titibot</h3>
      <RadioGroup 
        value={position} 
        onValueChange={(value) => setPosition(value as 'bottom-right' | 'bottom-left' | 'right-side')}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-accent/10 data-[state=checked]:border-primary data-[state=checked]:bg-accent/20">
          <RadioGroupItem value="bottom-right" id="position-bottom-right" className="mr-1" />
          <Label htmlFor="position-bottom-right" className="flex items-center cursor-pointer w-full">
            <CornerDownRight className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Canto inferior direito</span>
            <div className="ml-auto p-1 bg-muted/40 rounded-md">
              <div className="w-12 h-8 relative border border-muted rounded-md">
                <div className="absolute w-2 h-2 bg-primary rounded-full bottom-1 right-1"></div>
              </div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-accent/10 data-[state=checked]:border-primary data-[state=checked]:bg-accent/20">
          <RadioGroupItem value="bottom-left" id="position-bottom-left" className="mr-1" />
          <Label htmlFor="position-bottom-left" className="flex items-center cursor-pointer w-full">
            <CornerDownLeft className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Canto inferior esquerdo</span>
            <div className="ml-auto p-1 bg-muted/40 rounded-md">
              <div className="w-12 h-8 relative border border-muted rounded-md">
                <div className="absolute w-2 h-2 bg-primary rounded-full bottom-1 left-1"></div>
              </div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-accent/10 data-[state=checked]:border-primary data-[state=checked]:bg-accent/20">
          <RadioGroupItem value="right-side" id="position-right-side" className="mr-1" />
          <Label htmlFor="position-right-side" className="flex items-center cursor-pointer w-full">
            <PanelRight className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Lateral direita</span>
            <div className="ml-auto p-1 bg-muted/40 rounded-md">
              <div className="w-12 h-8 relative border border-muted rounded-md">
                <div className="absolute w-2 h-2 bg-primary rounded-full right-1 top-[50%] translate-y-[-50%]"></div>
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
      
      <div className="mt-2 text-xs text-muted-foreground rounded-md bg-muted/30 p-2">
        <span className="flex items-center">
          <PanelBottom className="h-3 w-3 mr-1" />
          Escolha a posição que mais se adapta à sua tela e navegação
        </span>
      </div>
    </div>
  );
};

export default TitibotPositionSettings;
