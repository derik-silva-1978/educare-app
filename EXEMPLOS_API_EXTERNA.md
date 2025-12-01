# 📘 Exemplos Práticos - API Externa Educare+

Exemplos de uso da API externa em diferentes linguagens e cenários.

---

## 🔑 Autenticação

Todas as requisições precisam incluir a API key:

**Via Query Parameter:**
```
?api_key=SUA_API_KEY_AQUI
```

**Via Header:**
```
X-API-Key: SUA_API_KEY_AQUI
```

---

## 🌐 cURL (Terminal)

### **1. Listar Planos de Assinatura**

```bash
curl -X GET "https://api.educareapp.com/api/external/subscription-plans?api_key=SUA_API_KEY" \
  -H "Content-Type: application/json"
```

### **2. Criar Usuário**

```bash
curl -X POST "https://api.educareapp.com/api/external/users?api_key=SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+5511999999999",
    "password": "senha123",
    "role": "user",
    "plan_id": "uuid-do-plano",
    "subscription_status": "trial",
    "trial_days": 7
  }'
```

### **3. Buscar Usuário por Telefone**

```bash
curl -X GET "https://api.educareapp.com/api/external/users/search?api_key=SUA_API_KEY&phone=+5511999999999" \
  -H "Content-Type: application/json"
```

### **4. Buscar Crianças de um Usuário**

```bash
curl -X GET "https://api.educareapp.com/api/external/users/search/children?api_key=SUA_API_KEY&phone=+5511999999999" \
  -H "Content-Type: application/json"
```

### **5. Buscar Perguntas Não Respondidas**

```bash
curl -X GET "https://api.educareapp.com/api/external/children/UUID_DA_CRIANCA/unanswered-questions?api_key=SUA_API_KEY" \
  -H "Content-Type: application/json"
```

### **6. Salvar Resposta de Pergunta**

```bash
curl -X POST "https://api.educareapp.com/api/external/children/UUID_DA_CRIANCA/save-answer?api_key=SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "uuid-da-pergunta",
    "answer": 2,
    "answer_text": "Sim, consegue fazer",
    "metadata": {
      "source": "whatsapp",
      "timestamp": "2025-10-18T12:00:00Z"
    }
  }'
```

---

## 🐍 Python

### **Setup**

```python
import requests
import json

API_BASE_URL = "https://api.educareapp.com"
API_KEY = "SUA_API_KEY_AQUI"

headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY
}
```

### **1. Listar Planos**

```python
def get_subscription_plans():
    url = f"{API_BASE_URL}/api/external/subscription-plans"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return data['data']
    else:
        print(f"Erro: {response.status_code}")
        return None

# Uso
plans = get_subscription_plans()
for plan in plans:
    print(f"{plan['name']}: R$ {plan['price']}")
```

### **2. Criar Usuário**

```python
def create_user(name, email, phone, password, plan_id=None):
    url = f"{API_BASE_URL}/api/external/users"
    
    payload = {
        "name": name,
        "email": email,
        "phone": phone,
        "password": password,
        "role": "user"
    }
    
    if plan_id:
        payload["plan_id"] = plan_id
        payload["subscription_status"] = "trial"
        payload["trial_days"] = 7
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 201:
        data = response.json()
        return data['data']
    else:
        error = response.json()
        print(f"Erro: {error.get('error', 'Erro desconhecido')}")
        return None

# Uso
user = create_user(
    name="Maria Santos",
    email="maria@example.com",
    phone="+5511988888888",
    password="senha123",
    plan_id="uuid-do-plano"
)

if user:
    print(f"Usuário criado: {user['user']['id']}")
```

### **3. Buscar Usuário**

```python
def search_user_by_phone(phone):
    url = f"{API_BASE_URL}/api/external/users/search"
    params = {"phone": phone}
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        return data['data']
    elif response.status_code == 404:
        print("Usuário não encontrado")
        return None
    else:
        print(f"Erro: {response.status_code}")
        return None

# Uso
user_data = search_user_by_phone("+5511999999999")
if user_data:
    print(f"Usuário: {user_data['user']['name']}")
    print(f"Assinatura: {user_data['subscription']['status']}")
```

### **4. Fluxo Completo - Chatbot**

```python
class EducareChatbot:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.educareapp.com"
        self.headers = {
            "Content-Type": "application/json",
            "X-API-Key": api_key
        }
    
    def get_user_by_phone(self, phone):
        """Busca usuário por telefone"""
        url = f"{self.base_url}/api/external/users/search"
        response = requests.get(url, headers=self.headers, params={"phone": phone})
        
        if response.status_code == 200:
            return response.json()['data']
        return None
    
    def get_children(self, phone):
        """Busca crianças do usuário"""
        url = f"{self.base_url}/api/external/users/search/children"
        response = requests.get(url, headers=self.headers, params={"phone": phone})
        
        if response.status_code == 200:
            return response.json()['data']['children']
        return []
    
    def get_unanswered_questions(self, child_id):
        """Busca perguntas não respondidas"""
        url = f"{self.base_url}/api/external/children/{child_id}/unanswered-questions"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()['data']['questions']
        return []
    
    def save_answer(self, child_id, question_id, answer, answer_text):
        """Salva resposta de uma pergunta"""
        url = f"{self.base_url}/api/external/children/{child_id}/save-answer"
        payload = {
            "question_id": question_id,
            "answer": answer,
            "answer_text": answer_text,
            "metadata": {
                "source": "whatsapp",
                "timestamp": datetime.now().isoformat()
            }
        }
        
        response = requests.post(url, headers=self.headers, json=payload)
        return response.status_code == 201
    
    def handle_message(self, phone, message):
        """Processa mensagem do usuário"""
        # 1. Buscar usuário
        user_data = self.get_user_by_phone(phone)
        if not user_data:
            return "Usuário não encontrado. Por favor, cadastre-se primeiro."
        
        # 2. Buscar crianças
        children = self.get_children(phone)
        if not children:
            return "Você ainda não cadastrou nenhuma criança."
        
        # 3. Usar primeira criança (ou implementar seleção)
        child = children[0]
        
        # 4. Buscar próxima pergunta
        questions = self.get_unanswered_questions(child['id'])
        if not questions:
            return "Parabéns! Você respondeu todas as perguntas disponíveis!"
        
        # 5. Retornar próxima pergunta
        next_question = questions[0]
        return f"Pergunta: {next_question['question_text']}"

# Uso
bot = EducareChatbot("SUA_API_KEY")
response = bot.handle_message("+5511999999999", "Olá")
print(response)
```

---

## 📱 JavaScript/Node.js

### **Setup**

```javascript
const axios = require('axios');

const API_BASE_URL = 'https://api.educareapp.com';
const API_KEY = 'SUA_API_KEY_AQUI';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  }
});
```

### **1. Listar Planos**

```javascript
async function getSubscriptionPlans() {
  try {
    const response = await api.get('/api/external/subscription-plans');
    return response.data.data;
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
    return null;
  }
}

// Uso
const plans = await getSubscriptionPlans();
plans.forEach(plan => {
  console.log(`${plan.name}: R$ ${plan.price}`);
});
```

### **2. Criar Usuário**

```javascript
async function createUser(userData) {
  try {
    const response = await api.post('/api/external/users', userData);
    return response.data.data;
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
    return null;
  }
}

// Uso
const newUser = await createUser({
  name: 'Pedro Oliveira',
  email: 'pedro@example.com',
  phone: '+5511977777777',
  password: 'senha123',
  role: 'user',
  plan_id: 'uuid-do-plano',
  subscription_status: 'trial'
});

console.log('Usuário criado:', newUser.user.id);
```

### **3. Webhook após Pagamento**

```javascript
// Exemplo de integração com sistema de pagamentos
async function handlePaymentApproved(paymentData) {
  const userData = {
    name: paymentData.customer.name,
    email: paymentData.customer.email,
    phone: paymentData.customer.phone,
    password: generateRandomPassword(),
    plan_id: paymentData.plan_id,
    subscription_status: 'active',
    external_id: paymentData.transaction_id,
    metadata: {
      payment_method: paymentData.payment_method,
      amount: paymentData.amount
    }
  };
  
  const result = await createUser(userData);
  
  if (result) {
    // Enviar email de boas-vindas
    await sendWelcomeEmail(result.user.email, {
      name: result.user.name,
      plan: result.subscription.plan_name
    });
    
    console.log('Usuário criado após pagamento:', result.user.id);
  }
}
```

---

## 🤖 WhatsApp Bot (Baileys)

```javascript
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const axios = require('axios');

const API_KEY = 'SUA_API_KEY';
const API_URL = 'https://api.educareapp.com';

class WhatsAppEducareBot {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      }
    });
  }
  
  async getUserByPhone(phone) {
    try {
      const response = await this.api.get('/api/external/users/search', {
        params: { phone }
      });
      return response.data.data;
    } catch (error) {
      return null;
    }
  }
  
  async getChildren(phone) {
    try {
      const response = await this.api.get('/api/external/users/search/children', {
        params: { phone }
      });
      return response.data.data.children;
    } catch (error) {
      return [];
    }
  }
  
  async getNextQuestion(childId) {
    try {
      const response = await this.api.get(
        `/api/external/children/${childId}/unanswered-questions`
      );
      const questions = response.data.data.questions;
      return questions.length > 0 ? questions[0] : null;
    } catch (error) {
      return null;
    }
  }
  
  async saveAnswer(childId, questionId, answer, answerText) {
    try {
      await this.api.post(
        `/api/external/children/${childId}/save-answer`,
        {
          question_id: questionId,
          answer,
          answer_text: answerText,
          metadata: {
            source: 'whatsapp',
            timestamp: new Date().toISOString()
          }
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  
  async handleMessage(from, message) {
    // Limpar número de telefone
    const phone = '+' + from.replace(/[^\d]/g, '');
    
    // Buscar usuário
    const userData = await this.getUserByPhone(phone);
    if (!userData) {
      return 'Olá! Você ainda não está cadastrado. Acesse nosso site para criar sua conta.';
    }
    
    // Buscar crianças
    const children = await this.getChildren(phone);
    if (children.length === 0) {
      return 'Você ainda não cadastrou nenhuma criança. Acesse o app para adicionar.';
    }
    
    // Usar primeira criança
    const child = children[0];
    
    // Buscar próxima pergunta
    const question = await this.getNextQuestion(child.id);
    if (!question) {
      return 'Parabéns! Você já respondeu todas as perguntas disponíveis! 🎉';
    }
    
    // Retornar pergunta
    return `📋 Pergunta sobre ${child.full_name}:\n\n${question.question_text}\n\nResponda com:\n1 - Não consegue\n2 - Às vezes\n3 - Sim, consegue`;
  }
}

// Inicializar bot
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({ auth: state });
  
  const bot = new WhatsAppEducareBot();
  
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    
    const response = await bot.handleMessage(from, text);
    
    await sock.sendMessage(from, { text: response });
  });
  
  sock.ev.on('creds.update', saveCreds);
}

startBot();
```

---

## 🔄 Fluxo Completo - Sistema de Pagamentos

```javascript
// Exemplo de integração com Stripe/Mercado Pago

const stripe = require('stripe')('sk_test_...');
const educareAPI = axios.create({
  baseURL: 'https://api.educareapp.com',
  headers: {
    'X-API-Key': 'SUA_API_KEY'
  }
});

// 1. Usuário escolhe plano no site
app.post('/checkout', async (req, res) => {
  const { planId, customerData } = req.body;
  
  // Buscar plano no Educare
  const plans = await educareAPI.get('/api/external/subscription-plans');
  const plan = plans.data.data.find(p => p.id === planId);
  
  // Criar sessão de checkout no Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'brl',
        product_data: {
          name: plan.name,
          description: plan.description
        },
        unit_amount: plan.price * 100
      },
      quantity: 1
    }],
    mode: 'subscription',
    success_url: 'https://seusite.com/success',
    cancel_url: 'https://seusite.com/cancel',
    metadata: {
      plan_id: planId,
      customer_email: customerData.email,
      customer_phone: customerData.phone
    }
  });
  
  res.json({ sessionId: session.id });
});

// 2. Webhook do Stripe após pagamento
app.post('/webhook/stripe', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Criar usuário no Educare
    const userData = {
      name: session.customer_details.name,
      email: session.metadata.customer_email,
      phone: session.metadata.customer_phone,
      password: generateRandomPassword(),
      plan_id: session.metadata.plan_id,
      subscription_status: 'active',
      external_id: session.id
    };
    
    const result = await educareAPI.post('/api/external/users', userData);
    
    if (result.data.success) {
      // Enviar credenciais por email
      await sendWelcomeEmail(userData.email, {
        name: userData.name,
        password: userData.password,
        loginUrl: 'https://app.educareapp.com'
      });
    }
  }
  
  res.json({ received: true });
});
```

---

## 📊 Monitoramento e Analytics

```javascript
// Dashboard de parceiro
async function getPartnerStats(partnerId) {
  const api = axios.create({
    baseURL: 'https://api.educareapp.com',
    headers: { 'X-API-Key': 'SUA_API_KEY' }
  });
  
  // Buscar todos os usuários criados pelo parceiro
  const users = await api.get('/api/external/users', {
    params: { external_id: partnerId }
  });
  
  const stats = {
    total_users: users.data.data.length,
    active_subscriptions: 0,
    trial_subscriptions: 0,
    total_revenue: 0
  };
  
  users.data.data.forEach(user => {
    if (user.subscription) {
      if (user.subscription.status === 'active') {
        stats.active_subscriptions++;
        stats.total_revenue += parseFloat(user.subscription.plan.price);
      } else if (user.subscription.status === 'trial') {
        stats.trial_subscriptions++;
      }
    }
  });
  
  return stats;
}

// Uso
const stats = await getPartnerStats('parceiro-123');
console.log(`Total de usuários: ${stats.total_users}`);
console.log(`Assinaturas ativas: ${stats.active_subscriptions}`);
console.log(`Receita mensal: R$ ${stats.total_revenue.toFixed(2)}`);
```

---

## 🎯 Conclusão

Estes exemplos cobrem os casos de uso mais comuns da API Externa do Educare+.

Para mais informações:
- **Documentação completa:** `AVALIACAO_API_EXTERNA.md`
- **Guia de deploy:** `DEPLOY_API_EXTERNA_VPS.md`
- **Swagger UI:** https://api.educareapp.com/api/docs
