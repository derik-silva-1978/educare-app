const https = require('https');
const http = require('http');

class WhatsappService {
  static get config() {
    return {
      apiUrl: process.env.EVOLUTION_API_URL || 'https://api.educareapp.com.br',
      apiKey: process.env.EVOLUTION_API_KEY,
      instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'educare-chat',
      maxRetries: 3,
      timeout: 15000
    };
  }

  static async sendMessage(phone, text, options = {}) {
    const config = WhatsappService.config;
    
    if (!config.apiKey) {
      console.warn('⚠ EVOLUTION_API_KEY não configurada');
      return WhatsappService._fallbackToWebhook(phone, text);
    }

    const cleanPhone = phone.replace(/\D/g, '');
    
    const url = `${config.apiUrl}/message/sendText/${config.instanceName}`;
    const data = {
      number: cleanPhone,
      text: text,
      delay: options.delay || 200
    };

    try {
      console.log(`📱 Enviando mensagem via Evolution API para ${cleanPhone}`);
      const response = await WhatsappService._makeEvolutionRequest(url, data);
      
      if (response.ok) {
        console.log(`✓ Mensagem enviada com sucesso para ${cleanPhone}`);
        console.log(`  ID: ${response.data?.key?.id || 'N/A'}`);
        return {
          success: true,
          phone: cleanPhone,
          messageId: response.data?.key?.id,
          sentAt: new Date().toISOString()
        };
      } else {
        throw new Error(`Evolution API retornou status ${response.status}`);
      }
    } catch (error) {
      console.error(`✗ Erro ao enviar via Evolution API: ${error.message}`);
      return WhatsappService._fallbackToWebhook(phone, text);
    }
  }

  static async sendTemporaryPassword(phone, password, email) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    let message = `🔐 *Sua senha temporária Educare+*\n\n`;
    message += `Senha: *${password}*\n\n`;
    message += `⏰ Válida por 30 minutos.\n`;
    
    if (email) {
      message += `\n📧 Você pode usar esta senha para entrar com:\n`;
      message += `• Email: ${email}\n`;
      message += `• Telefone: ${phone}`;
    }

    return WhatsappService.sendMessage(cleanPhone, message);
  }

  static async sendVerificationCode(phone, code) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    const message = `🔑 *Código de Verificação Educare+*\n\n` +
      `Código: *${code}*\n\n` +
      `⏰ Válido por 30 minutos.`;

    return WhatsappService.sendMessage(cleanPhone, message);
  }

  static async _makeEvolutionRequest(url, data) {
    const config = WhatsappService.config;
    
    return new Promise((resolve, reject) => {
      try {
        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : http;
        const postData = JSON.stringify(data);

        const options = {
          hostname: urlObj.hostname,
          port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
          path: urlObj.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'apikey': config.apiKey
          },
          timeout: config.timeout
        };

        const req = protocol.request(options, (res) => {
          let responseData = '';

          res.on('data', (chunk) => {
            responseData += chunk;
          });

          res.on('end', () => {
            const ok = res.statusCode >= 200 && res.statusCode < 300;
            let parsedData = null;
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) {
              parsedData = responseData;
            }
            
            resolve({
              ok,
              status: res.statusCode,
              data: parsedData
            });
          });
        });

        req.on('error', (error) => {
          reject(new Error(`Erro de conexão: ${error.message}`));
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Timeout na requisição (${config.timeout}ms)`));
        });

        req.write(postData);
        req.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static async _fallbackToWebhook(phone, message) {
    const webhookUrl = process.env.PHONE_PASSWORD_WEBHOOK;
    
    if (!webhookUrl) {
      console.error('⚠ Nenhum método de envio disponível (Evolution API ou Webhook)');
      throw new Error('Nenhum método de envio de WhatsApp configurado');
    }

    console.log(`📱 Usando webhook fallback para ${phone}`);
    
    const data = {
      phone: phone,
      message: message,
      timestamp: new Date().toISOString()
    };

    return WhatsappService._sendToWebhook(webhookUrl, data);
  }

  static async _sendToWebhook(webhookUrl, data, options = {}) {
    const { maxRetries = 3, timeout = 10000 } = options;
    let lastError = null;
    let delay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await WhatsappService._makeWebhookRequest(webhookUrl, data, timeout);
        
        if (response.ok) {
          console.log(`✓ Webhook enviado com sucesso [Tentativa ${attempt}/${maxRetries}]`);
          return { success: true, phone: data.phone, sentAt: new Date().toISOString() };
        }
      } catch (error) {
        lastError = error;
        console.warn(`✗ Erro webhook [Tentativa ${attempt}/${maxRetries}]: ${error.message}`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }

    throw new Error(`Falha após ${maxRetries} tentativas: ${lastError?.message}`);
  }

  static async _makeWebhookRequest(webhookUrl, data, timeout) {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(webhookUrl);
        const protocol = url.protocol === 'https:' ? https : http;
        const postData = JSON.stringify(data);

        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname + url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: timeout
        };

        const req = protocol.request(options, (res) => {
          let responseData = '';
          res.on('data', (chunk) => { responseData += chunk; });
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              data: responseData
            });
          });
        });

        req.on('error', (error) => reject(error));
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(postData);
        req.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  static async checkConnection() {
    const config = WhatsappService.config;
    
    if (!config.apiKey) {
      return { connected: false, error: 'API Key não configurada' };
    }

    try {
      const url = `${config.apiUrl}/instance/connectionState/${config.instanceName}`;
      const response = await WhatsappService._makeGetRequest(url);
      
      const isOpen = response.data?.instance?.state === 'open';
      return {
        connected: isOpen,
        instanceName: config.instanceName,
        state: response.data?.instance?.state
      };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }

  static async _makeGetRequest(url) {
    const config = WhatsappService.config;
    
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname,
        method: 'GET',
        headers: { 'apikey': config.apiKey },
        timeout: 10000
      };

      const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: JSON.parse(data)
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.end();
    });
  }
}

module.exports = WhatsappService;
