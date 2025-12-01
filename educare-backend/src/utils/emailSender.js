/**
 * Utilitário para envio de emails
 * Usa webhook para enviar emails, similar ao sistema de envio de SMS
 */
const https = require('https');

/**
 * Função auxiliar para enviar dados para um webhook via HTTPS
 * @param {string} webhookUrl - URL do webhook
 * @param {object} data - Dados a serem enviados no formato JSON
 * @returns {Promise<object>} - Resposta do webhook
 */
const sendToWebhook = async (webhookUrl, data) => {
  return new Promise((resolve, reject) => {
    try {
      // Converter a URL do webhook em objeto URL para extrair os componentes
      const url = new URL(webhookUrl);
      
      // Preparar os dados para envio
      const postData = JSON.stringify(data);
      
      // Opções da requisição
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      // Criar a requisição
      const req = https.request(options, (res) => {
        let responseData = '';
        
        // Coletar os dados da resposta
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        // Finalizar a requisição quando terminar
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ ok: true, status: res.statusCode, data: responseData });
          } else {
            reject(new Error(`Webhook retornou status ${res.statusCode}`));
          }
        });
      });
      
      // Tratar erros na requisição
      req.on('error', (error) => {
        reject(error);
      });
      
      // Enviar os dados
      req.write(postData);
      req.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Envia um email usando webhook
 * @param {string} to - Email do destinatário
 * @param {string} subject - Assunto do email
 * @param {string} body - Corpo do email (pode ser HTML)
 * @returns {Promise<object>} - Resultado do envio
 */
const sendEmail = async (to, subject, body) => {
  try {
    const webhookUrl = process.env.EMAIL_WEBHOOK;
    
    if (!webhookUrl) {
      throw new Error('URL do webhook para emails não configurada');
    }
    
    console.log(`Enviando email para ${to} com assunto "${subject}"`);
    
    // Preparar dados para envio
    const webhookData = {
      email: to,
      subject: subject,
      message: body
    };
    
    // Enviar para o webhook
    const response = await sendToWebhook(webhookUrl, webhookData);
    
    console.log(`Email enviado com sucesso para ${to}`);
    return { success: true, message: 'Email enviado com sucesso' };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: error.message || 'Erro ao enviar email' };
  }
};

module.exports = {
  sendEmail
};
