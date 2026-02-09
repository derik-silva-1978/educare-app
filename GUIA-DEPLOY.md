# Guia de Deploy - Educare+

## O que vamos fazer

Vamos colocar o Educare+ no ar em 3 etapas simples:
1. Criar o subdomínio da API no Registro.br
2. Subir a aplicação no Portainer
3. Verificar se está tudo funcionando

Configurações do Traefik já confirmadas:
- Entrypoints: `web` (porta 80) e `websecure` (porta 443)
- Cert Resolver: `letsencryptresolver`
- Rede: `educarenet`
- Modo: Docker Swarm

---

## ETAPA 1 — Criar o subdomínio no Registro.br

O site principal já funciona em `educareapp.com.br`. Agora precisamos que
`api.educareapp.com.br` também aponte para o mesmo servidor.

### Passo a passo:

1. Acesse: https://registro.br
2. Faça login com sua conta
3. Clique no domínio **educareapp.com.br**
4. No menu, procure por **"DNS"** ou **"Editar Zona"** e clique
5. Clique no botão **"Nova entrada"** ou **"Adicionar registro"**
6. Preencha os campos assim:

   | Campo         | O que preencher                          |
   |---------------|------------------------------------------|
   | **Tipo**      | `A`                                      |
   | **Nome**      | `api`                                    |
   | **Dados/IP**  | O mesmo IP do seu servidor Contabo       |

7. Clique em **Salvar**

Para encontrar o IP do servidor: é o mesmo número que aparece no registro `A`
do `educareapp.com.br` (algo como `123.456.789.10`).

Aguarde de 10 minutos a 2 horas para o subdomínio funcionar.

---

## ETAPA 2 — Subir a aplicação no Portainer

### Passo 2.1 — Abrir a tela de Stacks

1. Acesse o Portainer no navegador
2. No menu lateral, clique em **"Stacks"**
3. Clique no botão **"+ Add stack"** (Adicionar stack)

### Passo 2.2 — Configurar a Stack

1. No campo **"Name"** (Nome), digite: `educare`

2. Em **"Build method"**, selecione: **"Repository"**

3. Preencha os campos do repositório:

   | Campo                    | O que preencher                                          |
   |--------------------------|----------------------------------------------------------|
   | **Repository URL**       | O link do seu repositório no GitHub                      |
   | **Repository reference** | `refs/heads/main` (ou o nome da sua branch principal)    |
   | **Compose path**         | `docker-compose.yml`                                     |

4. Se o repositório for **privado**, ative a opção **"Authentication"** e
   coloque seu nome de usuário do GitHub e um token de acesso.

### Passo 2.3 — Criar o Token do GitHub (se o repositório for privado)

Se precisar criar um token de acesso do GitHub:

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Em **"Note"**, escreva: `portainer-educare`
4. Em **"Expiration"**, escolha **"No expiration"** (ou uma data que preferir)
5. Marque a opção: **repo** (acesso completo ao repositório)
6. Clique em **"Generate token"**
7. Copie o token gerado (ele só aparece uma vez!)
8. Volte ao Portainer e cole no campo de autenticação

### Passo 2.4 — Preencher as Variáveis de Ambiente

Role a tela para baixo até a seção **"Environment variables"**.

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
BACKEND_URL=https://api.educareapp.com.br
APP_URL=https://educareapp.com.br
VITE_API_URL=https://api.educareapp.com.br
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

### Passo 2.5 — Criar a Stack

1. Revise se todas as variáveis estão preenchidas
2. Na parte inferior, se aparecer a opção **"Enable relative path volumes"**,
   deixe desabilitada
3. Clique no botão **"Deploy the stack"** (Implantar a stack)
4. Aguarde — pode levar de 5 a 15 minutos na primeira vez (o Portainer vai
   baixar o código do GitHub, construir as imagens e iniciar tudo)
5. Quando aparecer tudo verde (status "running"), está pronto!

**Se aparecer um erro dizendo que a imagem não foi encontrada:**
Me mande uma captura de tela do erro que eu te ajudo a resolver.

---

## ETAPA 3 — Verificar se está funcionando

### Verificar os serviços

No Portainer, vá em **"Services"** (menu lateral) e verifique se os 3 serviços
da stack "educare" estão com status **"running 1/1"**:

- `educare_postgres` — Banco de dados
- `educare_backend` — Servidor da aplicação
- `educare_frontend` — Site que os usuários acessam

### Testar os endereços

Abra no navegador:

1. **https://educareapp.com.br** — Deve mostrar a tela de login do Educare+
2. **https://api.educareapp.com.br** — Deve mostrar uma mensagem de resposta
   do servidor

### Se algo der errado

- **Serviço com "0/1" (não está rodando):** Clique no nome do serviço e depois
  em **"Service logs"** para ver o que aconteceu. Me mande uma captura de tela.
- **Site não carrega:** Verifique se o subdomínio do Registro.br já propagou
  (pode levar até 2 horas).
- **Erro de certificado HTTPS:** O Traefik pode levar alguns minutos para gerar
  o certificado. Aguarde 5 minutos e tente novamente.
- **Erro 404 ou "Bad Gateway":** Verifique se os serviços estão rodando e se
  os domínios estão apontando para o IP correto do servidor.

---

## ATUALIZAÇÕES FUTURAS

Quando fizer mudanças no código e quiser atualizar o site:

1. No Portainer, vá em **"Stacks"**
2. Clique na stack **"educare"**
3. Clique no botão **"Pull and redeploy"** (Puxar e reimplantar)
4. Marque a opção **"Re-pull image and redeploy"**
5. Clique em **"Update"**

Pronto! O Portainer vai baixar o código mais recente e atualizar automaticamente.

---

## INFORMAÇÕES CONFIRMADAS DO SEU SERVIDOR

Estas configurações foram verificadas diretamente do seu Portainer:

- **Traefik versão:** v3.4.0
- **Modo:** Docker Swarm
- **Rede compartilhada:** `educarenet`
- **Entrypoint HTTP:** `web` (porta 80, redireciona para HTTPS)
- **Entrypoint HTTPS:** `websecure` (porta 443)
- **Certificados:** Let's Encrypt via resolver `letsencryptresolver`
- **E-mail certificados:** monitor.call@gmail.com

O docker-compose.yml já está configurado com todos esses dados corretos.
