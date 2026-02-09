# Guia de Deploy - Educare+

## O que vamos fazer

Vamos colocar o Educare+ no ar em 2 etapas simples:
1. Subir a aplicacao no Portainer
2. Verificar se esta tudo funcionando

**Nao precisa criar subdominio!** O frontend e o backend funcionam no mesmo
endereco `educareapp.com.br`. O Traefik direciona automaticamente:
- `educareapp.com.br` → Abre o site (frontend)
- `educareapp.com.br/api/*` → Vai para o servidor (backend)

Configuracoes do Traefik ja confirmadas:
- Entrypoints: `web` (porta 80) e `websecure` (porta 443)
- Cert Resolver: `letsencryptresolver`
- Rede: `educarenet`
- Modo: Docker Swarm

---

## ETAPA 1 — Subir a aplicacao no Portainer

### Passo 1.1 — Criar os volumes necessarios

Antes de subir a stack, precisamos criar os volumes para armazenar os dados.

1. No Portainer, no menu lateral, clique em **"Volumes"**
2. Crie os 3 volumes abaixo (clique em **"Add volume"** para cada um):

   | Nome do Volume    |
   |-------------------|
   | `postgres_data`   |
   | `uploads_data`    |
   | `backend_logs`    |

   Para cada um: digite o nome, deixe o driver como **"local"** e clique em **"Create the volume"**.

### Passo 1.2 — Abrir a tela de Stacks

1. Acesse o Portainer no navegador
2. No menu lateral, clique em **"Stacks"**
3. Clique no botao **"+ Add stack"** (Adicionar stack)

### Passo 1.3 — Configurar a Stack

1. No campo **"Name"** (Nome), digite: `educare`

2. Em **"Build method"**, selecione: **"Repository"**

3. Preencha os campos do repositorio:

   | Campo                    | O que preencher                                          |
   |--------------------------|----------------------------------------------------------|
   | **Repository URL**       | O link do seu repositorio no GitHub                      |
   | **Repository reference** | `refs/heads/main` (ou o nome da sua branch principal)    |
   | **Compose path**         | `docker-compose.yml`                                     |

4. Se o repositorio for **privado**, ative a opcao **"Authentication"** e
   coloque seu nome de usuario do GitHub e um token de acesso.

### Passo 1.4 — Criar o Token do GitHub (se o repositorio for privado)

Se precisar criar um token de acesso do GitHub:

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Em **"Note"**, escreva: `portainer-educare`
4. Em **"Expiration"**, escolha **"No expiration"** (ou uma data que preferir)
5. Marque a opcao: **repo** (acesso completo ao repositorio)
6. Clique em **"Generate token"**
7. Copie o token gerado (ele so aparece uma vez!)
8. Volte ao Portainer e cole no campo de autenticacao

### Passo 1.5 — Preencher as Variaveis de Ambiente

Role a tela para baixo ate a secao **"Environment variables"**.

Clique em **"Advanced mode"** para poder colar tudo de uma vez.

Cole o texto abaixo e substitua os valores entre COLCHETES pelos seus dados reais:

```
DB_USERNAME=postgres
DB_PASSWORD=[CRIE_UMA_SENHA_FORTE_AQUI]
DB_DATABASE=educareapp

JWT_SECRET=[CRIE_UMA_FRASE_LONGA_ALEATORIA_AQUI]
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=[CRIE_OUTRA_FRASE_LONGA_DIFERENTE]
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=https://educareapp.com.br
BACKEND_URL=https://educareapp.com.br
APP_URL=https://educareapp.com.br
VITE_API_URL=
CORS_ORIGINS=https://educareapp.com.br,https://www.educareapp.com.br

OPENAI_API_KEY=[SUA_CHAVE_OPENAI]
GEMINI_API_KEY=[SUA_CHAVE_GEMINI]

QDRANT_URL=[SUA_URL_QDRANT]
QDRANT_API_KEY=[SUA_CHAVE_QDRANT]

STRIPE_SECRET_KEY=[SUA_CHAVE_STRIPE_SECRET]
STRIPE_PUBLISHABLE_KEY=[SUA_CHAVE_STRIPE_PUBLIC]
STRIPE_WEBHOOK_SECRET=[SEU_WEBHOOK_SECRET_STRIPE]

EVOLUTION_API_URL=[URL_DA_SUA_EVOLUTION_API]
EVOLUTION_API_KEY=[SUA_CHAVE_EVOLUTION]
EVOLUTION_INSTANCE_NAME=educare-chat

N8N_API_KEY=[SUA_CHAVE_N8N]
N8N_REST_API_KEY=[SUA_CHAVE_N8N_REST]
EXTERNAL_API_KEY=[SUA_CHAVE_EXTERNAL_API]

OWNER_PHONE=[SEU_NUMERO_COM_DDI_E_DDD]
```

**IMPORTANTE:** A variavel `VITE_API_URL` deve ficar VAZIA (sem valor).
Isso faz o frontend usar caminhos relativos, que e o correto para esta arquitetura.

**Onde encontrar cada chave:**

| Variavel               | Onde encontrar                                           |
|------------------------|----------------------------------------------------------|
| DB_PASSWORD            | Crie uma senha forte (ex: `Educ@re2026!Segura`)          |
| JWT_SECRET             | Crie uma frase longa (ex: `minha-chave-secreta-educare-2026-muito-longa`) |
| JWT_REFRESH_SECRET     | Crie outra frase diferente da anterior                   |
| OPENAI_API_KEY         | https://platform.openai.com/api-keys                     |
| GEMINI_API_KEY         | https://aistudio.google.com/apikey                       |
| QDRANT_URL             | Painel do Qdrant Cloud                                   |
| QDRANT_API_KEY         | Painel do Qdrant Cloud                                   |
| STRIPE_SECRET_KEY      | https://dashboard.stripe.com/apikeys                     |
| STRIPE_PUBLISHABLE_KEY | https://dashboard.stripe.com/apikeys                     |
| STRIPE_WEBHOOK_SECRET  | https://dashboard.stripe.com/webhooks                    |
| EVOLUTION_API_URL      | URL da sua instancia Evolution API                       |
| EVOLUTION_API_KEY      | Painel da Evolution API                                  |
| N8N_API_KEY            | Configuracoes do n8n                                     |
| N8N_REST_API_KEY       | Configuracoes do n8n                                     |
| EXTERNAL_API_KEY       | Crie uma chave aleatoria para comunicacao entre servicos |
| OWNER_PHONE            | Seu numero de WhatsApp (ex: `5511999998888`)              |

### Passo 1.6 — Criar a Stack

1. Revise se todas as variaveis estao preenchidas
2. Na parte inferior, se aparecer a opcao **"Enable relative path volumes"**,
   deixe desabilitada
3. Clique no botao **"Deploy the stack"** (Implantar a stack)
4. Aguarde — pode levar de 5 a 15 minutos na primeira vez (o Portainer vai
   baixar o codigo do GitHub, construir as imagens e iniciar tudo)
5. Quando aparecer tudo verde (status "running"), esta pronto!

**Se aparecer um erro dizendo que a imagem nao foi encontrada:**
Me mande uma captura de tela do erro que eu te ajudo a resolver.

---

## ETAPA 2 — Verificar se esta funcionando

### Verificar os servicos

No Portainer, va em **"Services"** (menu lateral) e verifique se os 3 servicos
da stack "educare" estao com status **"running 1/1"**:

- `educare_postgres` — Banco de dados
- `educare_backend` — Servidor da aplicacao
- `educare_frontend` — Site que os usuarios acessam

### Testar os enderecos

Abra no navegador:

1. **https://educareapp.com.br** — Deve mostrar a tela de login do Educare+
2. **https://educareapp.com.br/api/auth** — Deve mostrar uma resposta do servidor (confirma que o backend esta funcionando)
3. **https://educareapp.com.br/health** — Deve mostrar o status de saude do servidor

### Se algo der errado

- **Servico com "0/1" (nao esta rodando):** Clique no nome do servico e depois
  em **"Service logs"** para ver o que aconteceu. Me mande uma captura de tela.
- **Erro de certificado HTTPS:** O Traefik pode levar alguns minutos para gerar
  o certificado. Aguarde 5 minutos e tente novamente.
- **Erro 404 ou "Bad Gateway":** Verifique se os servicos estao rodando no
  Portainer. Se o frontend carrega mas o `/api` nao, verifique os logs do backend.

---

## ATUALIZACOES FUTURAS

Quando fizer mudancas no codigo e quiser atualizar o site:

1. No Portainer, va em **"Stacks"**
2. Clique na stack **"educare"**
3. Clique no botao **"Pull and redeploy"** (Puxar e reimplantar)
4. Marque a opcao **"Re-pull image and redeploy"**
5. Clique em **"Update"**

Pronto! O Portainer vai baixar o codigo mais recente e atualizar automaticamente.

---

## INFORMACOES CONFIRMADAS DO SEU SERVIDOR

Estas configuracoes foram verificadas diretamente do seu Portainer:

- **Traefik versao:** v3.4.0
- **Modo:** Docker Swarm
- **Rede compartilhada:** `educarenet`
- **Entrypoint HTTP:** `web` (porta 80, redireciona para HTTPS)
- **Entrypoint HTTPS:** `websecure` (porta 443)
- **Certificados:** Let's Encrypt via resolver `letsencryptresolver`
- **E-mail certificados:** monitor.call@gmail.com

O docker-compose.yml ja esta configurado com todos esses dados corretos.

---

## COMO FUNCIONA O ROTEAMENTO (para referencia)

```
educareapp.com.br
      |
   Traefik
      |
      |--- /api/*      → Backend (porta 5000)
      |--- /uploads/*   → Backend (porta 5000)
      |--- /health      → Backend (porta 5000)
      |--- tudo mais    → Frontend (porta 80)
```

O Traefik usa "prioridade" para decidir: rotas com `/api`, `/uploads` e `/health`
tem prioridade mais alta e vao para o backend. Todo o restante vai para o frontend.
