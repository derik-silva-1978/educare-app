# Instruções para Deploy em Produção

Este documento contém instruções para fazer o deploy da aplicação Educare em ambiente de produção.

## Requisitos

- Node.js 18+ instalado
- NPM 8+ instalado
- Acesso à VPS via SSH

## Passos para Deploy

### 1. Preparação do Ambiente Local

Antes de fazer o deploy, certifique-se de que a aplicação está funcionando corretamente em ambiente de desenvolvimento:

```bash
npm run dev
```

### 2. Build para Produção

Para criar um build otimizado para produção, use o comando:

```bash
npm run build:prod
```

Este comando irá:
1. Atualizar a base de dados do browserslist
2. Criar um build otimizado para produção
3. Excluir pacotes de desenvolvimento do build final

### 3. Deploy na VPS

#### 3.1. Acesse a VPS via SSH

```bash
ssh usuario@seu-servidor
```

#### 3.2. Navegue até o diretório da aplicação

```bash
cd /home/educare/apps
```

#### 3.3. Atualize o código-fonte

Se estiver usando Git:

```bash
git pull origin main
```

Ou, se estiver fazendo upload manual, use SCP ou SFTP para transferir os arquivos.

#### 3.4. Instale as dependências

```bash
npm install --omit=dev
```

Se encontrar erros de conflito de dependências, use a flag `--legacy-peer-deps`:

```bash
npm install --omit=dev --legacy-peer-deps
```

#### 3.5. Faça o build da aplicação

Para um build normal (ignorando avisos do browserslist):

```bash
npm run build:prod
```

Se encontrar problemas de dependências em ambiente de produção (apenas dependências de produção):

```bash
npm run build:safe
```

Para build na VPS (instala todas as dependências com `--legacy-peer-deps`):

```bash
npm run build:vps
```

#### 3.6. Reinicie o serviço (se necessário)

Se estiver usando PM2:

```bash
pm2 restart educare-app
```

Se estiver usando systemd:

```bash
sudo systemctl restart educare-app
```

## Solução de Problemas Comuns

### Erro de conflito de dependências com @testing-library/react-hooks

Se você encontrar o seguinte erro:

```
npm error ERESOLVE could not resolve
npm error While resolving: @testing-library/react-hooks@8.0.1
npm error Found: @types/react@18.3.12
...
npm error peerOptional @types/react@"^16.9.0 || ^17.0.0" from @testing-library/react-hooks@8.0.1
```

Este erro ocorre porque as bibliotecas de teste estão configuradas para versões mais antigas do React. Para resolver:

1. Use a flag `--legacy-peer-deps` ao instalar as dependências:

```bash
npm install --omit=dev --legacy-peer-deps
```

2. Ou, melhor ainda, certifique-se de que as bibliotecas de teste estão nas devDependencies no package.json, não nas dependencies principais.

### Erro de build relacionado ao @tanstack/react-query-devtools

Se você encontrar o seguinte erro:

```
error during build:
[vite]: Rollup failed to resolve import "@tanstack/react-query-devtools" from "/home/educare/apps/src/components/dev/TanStackDevTools.tsx".
```

Certifique-se de:

1. Usar o comando `npm run build:prod` em vez de `npm run build`
2. Verificar se o pacote `@tanstack/react-query-devtools` está nas devDependencies no package.json
3. Verificar se a configuração do Vite está correta para excluir este pacote do build de produção

### Aviso sobre browserslist desatualizado

Se você encontrar um aviso sobre o browserslist estar desatualizado:

```
Browserslist: browsers data (caniuse-lite) is 12 months old. Please run:
  npx update-browserslist-db@latest
```

Você pode:

1. Ignorar o aviso usando a variável de ambiente (já configurada nos scripts):

```bash
BROWSERSLIST_IGNORE_OLD_DATA=1 vite build
```

2. Atualizar o caniuse-lite manualmente:

```bash
npm run update-browserslist
```

3. Se o comando acima falhar com erro de Bun, use:

```bash
npm install caniuse-lite@latest --no-save
```

## Manutenção

### Verificar logs

```bash
# Se estiver usando PM2
pm2 logs educare-app

# Se estiver usando systemd
journalctl -u educare-app -f
```

### Monitorar desempenho

```bash
# Se estiver usando PM2
pm2 monit
```

## Contato

Em caso de problemas com o deploy, entre em contato com a equipe de desenvolvimento.
