
import { useCallback } from 'react';
import { whatsappBotConfig, whatsappBotFlows, WhatsAppBotFlow } from '@/config/whatsapp-bot-config';

export interface UseWhatsAppBotOptions {
  productType?: string;
  customMessage?: string;
  trackingData?: {
    page?: string;
    section?: string;
    buttonId?: string;
  };
}

export const useWhatsAppBot = () => {
  const sendToBot = useCallback((options: UseWhatsAppBotOptions = {}) => {
    const { productType, customMessage, trackingData } = options;
    
    // Determinar qual fluxo usar
    let flow: WhatsAppBotFlow | null = null;
    let message = customMessage || whatsappBotConfig.defaultMessage;
    
    if (productType && whatsappBotFlows[productType]) {
      flow = whatsappBotFlows[productType];
      message = flow.message;
    }
    
    // Construir URL do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    let whatsappUrl = `https://wa.me/${whatsappBotConfig.phoneNumber}?text=${encodedMessage}`;
    
    // Adicionar tracking UTM se habilitado
    if (whatsappBotConfig.utmTracking && flow) {
      const utmParams = new URLSearchParams({
        utm_source: flow.utmSource,
        utm_medium: flow.utmMedium,
        utm_campaign: flow.utmCampaign,
        ...(trackingData?.page && { utm_content: trackingData.page }),
        ...(trackingData?.section && { utm_term: trackingData.section })
      });
      
      // Adicionar parâmetros UTM ao final da URL
      whatsappUrl += `&${utmParams.toString()}`;
    }
    
    // Analytics tracking
    if (whatsappBotConfig.analyticsEnabled) {
      console.log('WhatsApp Bot Analytics:', {
        action: 'whatsapp_bot_click',
        product_type: productType,
        flow_trigger: flow?.trigger,
        tracking_data: trackingData,
        timestamp: new Date().toISOString()
      });
      
      // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
      // Exemplo: gtag('event', 'whatsapp_bot_click', { ... })
    }
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    return {
      success: true,
      url: whatsappUrl,
      flow: flow?.trigger,
      message
    };
  }, []);
  
  const sendCustomMessage = useCallback((message: string, trackingData?: UseWhatsAppBotOptions['trackingData']) => {
    return sendToBot({ customMessage: message, trackingData });
  }, [sendToBot]);
  
  const sendProductFlow = useCallback((productType: string, trackingData?: UseWhatsAppBotOptions['trackingData']) => {
    return sendToBot({ productType, trackingData });
  }, [sendToBot]);
  
  return {
    sendToBot,
    sendCustomMessage,
    sendProductFlow,
    config: whatsappBotConfig,
    flows: whatsappBotFlows
  };
};

export default useWhatsAppBot;
