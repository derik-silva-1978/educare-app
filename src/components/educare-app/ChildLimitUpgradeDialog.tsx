import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Loader2, Baby, Sparkles } from 'lucide-react';
import { listProductsWithPrices, createCheckoutSession, createCustomerPortalSession, formatPrice, formatInterval, StripeProductWithPrices } from '@/services/api/stripeService';
import { useToast } from '@/hooks/use-toast';

interface ChildLimitUpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  currentLimit?: number;
}

const ChildLimitUpgradeDialog: React.FC<ChildLimitUpgradeDialogProps> = ({
  isOpen,
  onClose,
  currentPlan,
  currentLimit,
}) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<StripeProductWithPrices[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await listProductsWithPrices();
      if (response.success && response.data) {
        setProducts(response.data.filter(p => p.active));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    setIsRedirecting(true);
    try {
      const response = await createCheckoutSession(priceId);
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast({ title: 'Erro', description: 'Não foi possível iniciar o processo de pagamento.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao processar upgrade. Tente novamente.', variant: 'destructive' });
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsRedirecting(true);
    try {
      const response = await createCustomerPortalSession();
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast({ title: 'Erro', description: 'Não foi possível abrir o portal de assinatura.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao abrir portal. Tente novamente.', variant: 'destructive' });
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">Limite de Crianças Atingido</DialogTitle>
              <DialogDescription>
                {currentPlan 
                  ? `Seu plano ${currentPlan} permite até ${currentLimit || 'N'} criança(s).`
                  : 'Você atingiu o limite de crianças do seu plano atual.'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <p className="font-medium text-sm text-purple-800">Faça upgrade para acompanhar mais crianças</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Amplie seu plano para adicionar mais perfis de crianças e aproveitar recursos avançados.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-muted-foreground">Carregando planos...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-3">
              {products.map(product => {
                const monthlyPrice = product.prices.find(p => p.recurring?.interval === 'month' && p.active);
                if (!monthlyPrice) return null;
                
                return (
                  <Card key={product.id} className="border-blue-100 hover:border-blue-300 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{product.name}</h4>
                            {product.metadata?.maxChildren && (
                              <Badge variant="outline" className="text-xs">
                                <Baby className="h-3 w-3 mr-1" />
                                Até {product.metadata.maxChildren} crianças
                              </Badge>
                            )}
                          </div>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                          )}
                          <p className="text-lg font-bold text-blue-600 mt-1">
                            {formatPrice(monthlyPrice.unit_amount, monthlyPrice.currency)}
                            <span className="text-sm font-normal text-muted-foreground">{formatInterval(monthlyPrice.recurring?.interval || 'month')}</span>
                          </p>
                        </div>
                        <Button 
                          onClick={() => handleUpgrade(monthlyPrice.id)}
                          disabled={isRedirecting}
                          size="sm"
                          className="gap-1"
                        >
                          {isRedirecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                          Assinar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              <p>Entre em contato com o suporte para upgrade.</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleManageSubscription} disabled={isRedirecting} className="gap-2">
            Gerenciar Assinatura
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChildLimitUpgradeDialog;
