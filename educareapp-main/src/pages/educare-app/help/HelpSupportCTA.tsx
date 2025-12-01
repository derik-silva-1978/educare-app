
import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HelpSupportCTA: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-primary/5 rounded-lg p-6 text-center ${className || ''}`}>
    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
    <h2 className="text-xl font-semibold mb-2">Ainda precisa de ajuda?</h2>
    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
      Nossa equipe de suporte está disponível para ajudar com qualquer dúvida.
    </p>
    <Button asChild>
      <a href="mailto:suporte@educare.com">Entrar em Contato</a>
    </Button>
  </div>
);
