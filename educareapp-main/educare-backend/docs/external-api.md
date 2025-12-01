# Documentação da API Externa do EducareApp

Esta documentação descreve os endpoints disponíveis para integração externa com o EducareApp.

## Autenticação

Todas as requisições para a API externa devem incluir uma chave de API (API key) válida. A chave pode ser fornecida de duas maneiras:

1. Como parâmetro de query string: `?api_key=sua_chave_api`
2. Como header HTTP: `X-API-Key: sua_chave_api`

### Exemplo:

```
GET /api/external/subscription-plans?api_key=sua_chave_api
```

ou

```
GET /api/external/subscription-plans
X-API-Key: sua_chave_api
```

## Endpoints Disponíveis

### Planos de Assinatura

Retorna todos os planos de assinatura ativos e públicos.

**URL:** `/api/external/subscription-plans`

**Método:** `GET`

**Parâmetros de Query:**
- `api_key` (obrigatório): Chave de API para autenticação

**Resposta de Sucesso:**
- Código: `200 OK`
- Conteúdo:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-plano",
      "name": "Plano Básico",
      "description": "Descrição do plano",
      "price": 29.90,
      "currency": "BRL",
      "billing_cycle": "monthly",
      "trial_days": 7,
      "features": {
        "blogAccess": true,
        "chatSupport": true,
        "basicReports": true,
        "tiriNautaWeb": false,
        // ... outras features
      },
      "limits": {
        "maxQuizzes": 5,
        "maxChildren": 1,
        "maxJourneys": 2,
        "maxDocuments": 10,
        "maxProfessionals": 0
      }
    },
    // ... outros planos
  ]
}
```

**Respostas de Erro:**
- Código: `401 Unauthorized`
  - Conteúdo: `{ "success": false, "error": "API key não fornecida" }`
  - Conteúdo: `{ "success": false, "error": "API key inválida" }`

- Código: `500 Internal Server Error`
  - Conteúdo: `{ "success": false, "error": "Erro ao buscar planos de assinatura" }`

### Listar Usuários

Retorna uma lista de usuários com seus dados de contato, incluindo telefone.

**URL:** `/api/external/users`

**Método:** `GET`

**Parâmetros de Query:**
- `api_key` (obrigatório): Chave de API para autenticação
- `email` (opcional): Filtrar por email
- `phone` (opcional): Filtrar por telefone
- `role` (opcional): Filtrar por papel/função (user, professional, admin, owner)

**Resposta de Sucesso:**
- Código: `200 OK`
- Conteúdo:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-usuario",
      "name": "Nome do Usuário",
      "email": "usuario@exemplo.com",
      "phone": "11999999999",
      "role": "user",
      "status": "active",
      "profile": {
        "id": "uuid-do-perfil",
        "name": "Nome do Perfil",
        "phone": "11999999999",
        "type": "personal",
        "address": "Rua Exemplo, 123",
        "city": "São Paulo",
        "state": "SP",
        "country": "Brasil",
        "zip_code": "01234-567",
        "profession": "Desenvolvedor",
        "specialization": "Frontend"
      }
    },
    // ... outros usuários
  ]
}
```

**Respostas de Erro:**
- Código: `401 Unauthorized`
  - Conteúdo: `{ "success": false, "error": "API key não fornecida" }`
  - Conteúdo: `{ "success": false, "error": "API key inválida" }`

- Código: `500 Internal Server Error`
  - Conteúdo: `{ "success": false, "error": "Erro ao buscar usuários" }`

### Obter Usuário por ID

Retorna os dados de um usuário específico pelo ID, incluindo telefone.

**URL:** `/api/external/users/{id}`

**Método:** `GET`

**Parâmetros de Query:**
- `api_key` (obrigatório): Chave de API para autenticação

**Parâmetros de Path:**
- `id` (obrigatório): ID do usuário

**Resposta de Sucesso:**
- Código: `200 OK`
- Conteúdo:
```json
{
  "success": true,
  "data": {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "phone": "11999999999",
    "role": "user",
    "status": "active",
    "profile": {
      "id": "uuid-do-perfil",
      "name": "Nome do Perfil",
      "phone": "11999999999",
      "type": "personal",
      "address": "Rua Exemplo, 123",
      "city": "São Paulo",
      "state": "SP",
      "country": "Brasil",
      "zip_code": "01234-567",
      "profession": "Desenvolvedor",
      "specialization": "Frontend"
    }
  }
}
```

**Respostas de Erro:**
- Código: `401 Unauthorized`
  - Conteúdo: `{ "success": false, "error": "API key não fornecida" }`
  - Conteúdo: `{ "success": false, "error": "API key inválida" }`

- Código: `404 Not Found`
  - Conteúdo: `{ "success": false, "error": "Usuário não encontrado" }`

- Código: `500 Internal Server Error`
  - Conteúdo: `{ "success": false, "error": "Erro ao buscar usuário" }`

### Obter Filhos de um Usuário

Retorna a lista de filhos associados a um usuário específico.

**URL:** `/api/external/users/{id}/children`

**Método:** `GET`

**Parâmetros de Query:**
- `api_key` (obrigatório): Chave de API para autenticação

**Parâmetros de Path:**
- `id` (obrigatório): ID do usuário

**Resposta de Sucesso:**
- Código: `200 OK`
- Conteúdo:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-da-crianca",
      "name": "Nome da Criança",
      "birth_date": "2020-01-15",
      "gender": "male",
      "age_months": 44,
      "profile_id": "uuid-do-perfil",
      "photo_url": "https://exemplo.com/foto.jpg",
      "created_at": "2023-05-10T14:30:00Z",
      "updated_at": "2023-05-10T14:30:00Z"
    },
    // ... outras crianças
  ]
}
```

**Resposta de Sucesso (sem filhos):**
- Código: `200 OK`
- Conteúdo:
```json
{
  "success": true,
  "data": [],
  "message": "Usuário não possui filhos cadastrados"
}
```

**Respostas de Erro:**
- Código: `401 Unauthorized`
  - Conteúdo: `{ "success": false, "error": "API key não fornecida" }`
  - Conteúdo: `{ "success": false, "error": "API key inválida" }`

- Código: `404 Not Found`
  - Conteúdo: `{ "success": false, "error": "Usuário não encontrado" }`
  - Conteúdo: `{ "success": false, "error": "Perfil do usuário não encontrado" }`

- Código: `500 Internal Server Error`
  - Conteúdo: `{ "success": false, "error": "Erro ao buscar filhos do usuário" }`

### Obter Criança por ID

Retorna os dados de uma criança específica pelo ID.

**URL:** `/api/external/children/{id}`

**Método:** `GET`

**Parâmetros de Query:**
- `api_key` (obrigatório): Chave de API para autenticação

**Parâmetros de Path:**
- `id` (obrigatório): ID da criança

**Resposta de Sucesso:**
- Código: `200 OK`
- Conteúdo:
```json
{
  "success": true,
  "data": {
    "id": "uuid-da-crianca",
    "name": "Nome da Criança",
    "birth_date": "2020-01-15",
    "gender": "male",
    "age_months": 44,
    "profile_id": "uuid-do-perfil",
    "photo_url": "https://exemplo.com/foto.jpg",
    "created_at": "2023-05-10T14:30:00Z",
    "updated_at": "2023-05-10T14:30:00Z"
  }
}
```

**Respostas de Erro:**
- Código: `401 Unauthorized`
  - Conteúdo: `{ "success": false, "error": "API key não fornecida" }`
  - Conteúdo: `{ "success": false, "error": "API key inválida" }`

- Código: `404 Not Found`
  - Conteúdo: `{ "success": false, "error": "Criança não encontrada" }`

- Código: `500 Internal Server Error`
  - Conteúdo: `{ "success": false, "error": "Erro ao buscar criança" }`

## Exemplos de Uso

### Exemplo com cURL

```bash
curl -X GET "http://localhost:3001/api/external/subscription-plans?api_key=sua_chave_api"
```

### Exemplo com JavaScript (Axios)

```javascript
const axios = require('axios');

async function getSubscriptionPlans() {
  try {
    const response = await axios.get('http://localhost:3001/api/external/subscription-plans', {
      params: {
        api_key: 'sua_chave_api'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Erro:', error.response ? error.response.data : error.message);
  }
}

getSubscriptionPlans();
```

### Exemplo com Python (Requests)

```python
import requests

api_url = "http://localhost:3001/api/external/subscription-plans"
api_key = "sua_chave_api"

response = requests.get(api_url, params={"api_key": api_key})

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Erro: {response.status_code}")
    print(response.json())
```

## Considerações de Segurança

- Mantenha sua chave de API segura e não a compartilhe publicamente
- A API externa só deve ser acessada por aplicações autorizadas
- Considere implementar limites de taxa (rate limiting) para evitar abusos
- Todas as requisições devem ser feitas via HTTPS em ambiente de produção
