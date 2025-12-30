const https = require('https');
const http = require('http');

class WhatsappService {
  /**
   * Enviar dados para webhook com retry logic
   * @param {string} webhookUrl - URL do webhook
   * @param {object} data - Dados a serem enviados
   * @param {object} options - Opções (retries, timeout, etc)
   */
  static async sendToWebhook(webhookUrl, data, options = {}) {
    const {
      maxRetries = 3,
      timeout = 10000,
      backoffMultiplier = 2,
      initialDelay = 1000
    } = options;

    let lastError = null;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await WhatsappService._makeRequest(webhookUrl, data, timeout);
        
        if (response.ok) {
          console.log(`✓ Webhook enviado com sucesso [Tentativa ${attempt}/${maxRetries}]`);
          console.log(`  URL: ${webhookUrl}`);
          console.log(`  Status: ${response.status}`);
          return response;
        }
      } catch (error) {
        lastError = error;
        console.warn(`✗ Erro ao enviar webhook [Tentativa ${attempt}/${maxRetries}]`);
        console.warn(`  URL: ${webhookUrl}`);
        console.warn(`  Erro: ${error.message}`);
        
        // Se é a última tentativa, não fazer retry
        if (attempt === maxRetries) {
          break;
        }
        
        // Aguardar antes de tentar novamente
        console.log(`  Tentando novamente em ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= backoffMultiplier;
      }
    }

    // Todas as tentativas falharam
    const errorMessage = `Falha ao enviar webhook após ${maxRetries} tentativas: ${lastError?.message || 'Erro desconhecido'}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  /**
   * Fazer requisição HTTP/HTTPS
   * @private
   */
  static async _makeRequest(webhookUrl, data, timeout) {
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
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Educare-Backend/1.0'
          },
          timeout: timeout
        };

        const req = protocol.request(options, (res) => {
          let responseData = '';

          res.on('data', (chunk) => {
            responseData += chunk;
          });

          res.on('end', () => {
            const ok = res.statusCode >= 200 && res.statusCode < 300;
            resolve({
              ok,
              status: res.statusCode,
              data: responseData,
              headers: res.headers
            });
          });
        });

        req.on('error', (error) => {
          reject(new Error(`Erro de conexão: ${error.message}`));
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Timeout na requisição (${timeout}ms)`));
        });

        req.write(postData);
        req.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Enviar senha temporária via WhatsApp
   */
  static async sendTemporaryPassword(phone, password, email) {
    const webhookUrl = process.env.PHONE_PASSWORD_WEBHOOK;
    
    if (!webhookUrl) {
      console.warn('⚠ URL do webhook para senhas não configurada no .env');
      console.warn('  Variável esperada: PHONE_PASSWORD_WEBHOOK');
      throw new Error('Webhook não configurado para envio de senhas');
    }

    const data = {
      phone: phone,
      message: `Sua senha temporária para Educare+ é: ${password}`,
      password: password,
      email: email,
      timestamp: new Date().toISOString(),
      type: 'temporary_password'
    };

    try {
      console.log(`📱 Enviando senha temporária para ${phone}`);
      const response = await WhatsappService.sendToWebhook(webhookUrl, data, {
        maxRetries: 3,
        timeout: 15000,
        backoffMultiplier: 1.5,
        initialDelay: 500
      });

      console.log(`✓ Senha temporária enviada com sucesso para ${phone}`);
      return {
        success: true,
        phone: phone,
        email: email,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`✗ Falha ao enviar senha temporária para ${phone}`);
      console.error(`  Erro: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enviar código de verificação via WhatsApp
   */
  static async sendVerificationCode(phone, code) {
    const webhookUrl = process.env.PHONE_VERIFICATION_WEBHOOK;
    
    if (!webhookUrl) {
      console.warn('⚠ URL do webhook para verificação não configurada no .env');
      console.warn('  Variável esperada: PHONE_VERIFICATION_WEBHOOK');
      throw new Error('Webhook não configurado para envio de códigos');
    }

    const data = {
      phone: phone,
      message: `Seu código de verificação para Educare+ é: ${code}`,
      code: code,
      timestamp: new Date().toISOString(),
      type: 'verification_code'
    };

    try {
      console.log(`📱 Enviando código de verificação para ${phone}`);
      const response = await WhatsappService.sendToWebhook(webhookUrl, data, {
        maxRetries: 3,
        timeout: 15000,
        backoffMultiplier: 1.5,
        initialDelay: 500
      });

      console.log(`✓ Código de verificação enviado com sucesso para ${phone}`);
      return {
        success: true,
        phone: phone,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`✗ Falha ao enviar código de verificação para ${phone}`);
      console.error(`  Erro: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enviar mensagem customizada via WhatsApp
   */
  static async sendMessage(phone, message, metadata = {}) {
    const webhookUrl = process.env.PHONE_PASSWORD_WEBHOOK;
    
    if (!webhookUrl) {
      throw new Error('Webhook não configurado');
    }

    const data = {
      phone: phone,
      message: message,
      timestamp: new Date().toISOString(),
      type: 'custom_message',
      ...metadata
    };

    try {
      console.log(`📱 Enviando mensagem para ${phone}`);
      const response = await WhatsappService.sendToWebhook(webhookUrl, data);
      return {
        success: true,
        phone: phone,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`✗ Falha ao enviar mensagem para ${phone}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = WhatsappService;
