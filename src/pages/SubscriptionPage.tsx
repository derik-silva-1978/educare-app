import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Settings, AlertCircle, CheckCircle, Clock, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import {
  getMySubscription,
  createCustomerPortalSession,
  listProductsWithPrices,
  formatPrice,
  formatInterval,
  StripeSubscription,
  StripeProductWithPrices,
} from '@/services/api/stripeService';

const SubscriptionPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const [products, setProducts] = useState<StripeProductWithPrices[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  const isOwner = hasRole('owner');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subResponse, productsResponse] = await Promise.all([
        getMySubscription(),
        listProductsWithPrices(),
      ]);

      if (subResponse.success && subResponse.data) {
        setSubscription(subResponse.data.subscription);
      }

      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data);
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados da assinatura',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!isOwner) {
      toast({
        title: 'Acesso restrito',
        description: 'Apenas o proprietário da conta pode gerenciar a assinatura',
        variant: 'destructive',
      });
      return;
    }

    setPortalLoading(true);
    try {
      const response = await createCustomerPortalSession();
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.error || 'Erro ao abrir portal de gerenciamento');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao abrir portal de gerenciamento',
        variant: 'destructive',
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSubscribe = (priceId: string, planId?: string) => {
    navigate(`/payment?priceId=${priceId}${planId ? `&planId=${planId}` : ''}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      active: { label: 'Ativa', variant: 'default', icon: <CheckCircle className="h-4 w-4" /> },
      trialing: { label: 'Teste', variant: 'secondary', icon: <Clock className="h-4 w-4" /> },
      past_due: { label: 'Pagamento Pendente', variant: 'destructive', icon: <AlertCircle className="h-4 w-4" /> },
      canceled: { label: 'Cancelada', variant: 'outline', icon: <XCircle className="h-4 w-4" /> },
      unpaid: { label: 'Não Pago', variant: 'destructive', icon: <XCircle className="h-4 w-4" /> },
      paused: { label: 'Pausada', variant: 'secondary', icon: <Clock className="h-4 w-4" /> },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' as const, icon: null };
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Minha Assinatura | Educare+</title>
      </Helmet>

      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minha Assinatura</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu plano e informações de pagamento
            </p>
          </div>
          {subscription && isOwner && (
            <Button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              variant="outline"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              Gerenciar Assinatura
            </Button>
          )}
        </div>

        {!isOwner && subscription && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Limitado</AlertTitle>
            <AlertDescription>
              Apenas o proprietário da conta pode gerenciar a assinatura. Entre em contato com o administrador para fazer alterações.
            </AlertDescription>
          </Alert>
        )}

        {subscription ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Assinatura Atual
                  </CardTitle>
                  <CardDescription>
                    Detalhes do seu plano ativo
                  </CardDescription>
                </div>
                {getStatusBadge(subscription.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription.items?.data?.[0]?.price && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(
                        subscription.items.data[0].price.unit_amount,
                        subscription.items.data[0].price.currency
                      )}
                      <span className="text-sm font-normal text-muted-foreground">
                        {subscription.items.data[0].price.recurring && 
                          formatInterval(
                            subscription.items.data[0].price.recurring.interval,
                            subscription.items.data[0].price.recurring.interval_count
                          )
                        }
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renovação</p>
                    <p className="text-lg">
                      {subscription.cancel_at_period_end ? (
                        <span className="text-destructive">Cancela em {formatDate(subscription.current_period_end)}</span>
                      ) : (
                        formatDate(subscription.current_period_end)
                      )}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Período atual iniciou em</p>
                  <p>{formatDate(subscription.current_period_start)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Período atual termina em</p>
                  <p>{formatDate(subscription.current_period_end)}</p>
                </div>
              </div>

              {subscription.cancel_at_period_end && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Cancelamento Agendado</AlertTitle>
                  <AlertDescription>
                    Sua assinatura será cancelada em {formatDate(subscription.current_period_end)}.
                    {isOwner && ' Você pode reverter isso no portal de gerenciamento.'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma Assinatura Ativa</CardTitle>
              <CardDescription>
                Escolha um plano para começar a usar todos os recursos do Educare+
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id} className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      {product.description && (
                        <CardDescription>{product.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {product.prices?.map((price) => (
                        <div key={price.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-bold">
                              {formatPrice(price.unit_amount, price.currency)}
                              <span className="text-sm font-normal text-muted-foreground">
                                {price.recurring && formatInterval(price.recurring.interval, price.recurring.interval_count)}
                              </span>
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSubscribe(price.id, product.metadata?.planId)}
                          >
                            Assinar
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum plano disponível no momento.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/pricing')}
                  >
                    Ver Planos
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SubscriptionPage;
