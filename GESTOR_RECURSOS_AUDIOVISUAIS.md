# Gestor de Recursos Audiovisuais - Documentação

## 📋 Visão Geral

Sistema completo de gestão de recursos audiovisuais para perfis **Owner** e **Admin**, permitindo o gerenciamento de diversos tipos de mídia para uso na plataforma Educare+.

**Data de Implementação:** 14/10/2025  
**Status:** ✅ Implementado e Funcional

---

## 🎯 Funcionalidades Implementadas

### Tipos de Recursos Suportados

1. **📝 Texto** - Conteúdo textual formatado
2. **🎵 Áudio** - Arquivos de áudio (MP3, WAV, OGG)
3. **🖼️ Imagem** - Imagens (JPEG, PNG, GIF, WebP, SVG)
4. **📄 PDF** - Documentos PDF
5. **🎬 Vídeo** - Vídeos (MP4, WebM, OGG)
6. **🔗 Link** - URLs externas (YouTube, Vimeo, etc.)

### Funcionalidades Principais

#### ✅ Upload de Arquivos
- Upload de áudio, imagem, PDF e vídeo
- Validação de tipo MIME
- Limite de tamanho configurável (padrão: 10MB)
- Armazenamento seguro no servidor

#### ✅ Text-to-Speech (TTS)
- Integração com ferramentas TTS externas
- Configuração de endpoint personalizado
- Seleção de voz
- Geração sob demanda

#### ✅ Gerenciamento Completo
- Criar, editar, visualizar e deletar recursos
- Filtros por tipo, categoria e status
- Busca por título e descrição
- Paginação de resultados

#### ✅ Categorização e Organização
- Sistema de categorias customizáveis
- Tags para busca avançada
- Faixa etária recomendada (em meses)
- Status ativo/inativo
- Recursos públicos ou privados

#### ✅ Estatísticas e Métricas
- Total de recursos por tipo
- Contador de visualizações
- Recursos ativos vs inativos
- Recursos públicos

---

## 🏗️ Arquitetura Técnica

### Backend (Node.js + Express)

#### 1. Banco de Dados

**Tabela:** `media_resources`

```sql
Campos principais:
- id (UUID)
- title (string, obrigatório)
- description (text)
- resource_type (enum: text, audio, image, pdf, video, link)
- content (text) - para texto e links
- file_url (string) - URL do arquivo
- file_name (string)
- file_size (integer)
- mime_type (string)
- tts_enabled (boolean)
- tts_endpoint (string)
- tts_voice (string)
- category (string)
- tags (array)
- age_range_min (integer)
- age_range_max (integer)
- is_active (boolean)
- is_public (boolean)
- view_count (integer)
- created_by (UUID, FK para users)
- updated_by (UUID, FK para users)
- created_at, updated_at (timestamps)
```

**Índices criados:**
- resource_type
- category
- is_active
- created_by
- created_at

#### 2. API Endpoints

**Base URL:** `/api/media-resources`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/` | Listar recursos com filtros | Owner, Admin |
| GET | `/stats` | Estatísticas dos recursos | Owner, Admin |
| GET | `/category/:category` | Recursos por categoria | Owner, Admin |
| GET | `/:id` | Buscar por ID | Owner, Admin |
| POST | `/` | Criar recurso | Owner, Admin |
| PUT | `/:id` | Atualizar recurso | Owner, Admin |
| DELETE | `/:id` | Deletar recurso | Owner, Admin |
| POST | `/:id/tts` | Gerar áudio via TTS | Owner, Admin |

#### 3. Arquivos Criados

**Backend:**
```
educare-backend/
├── migrations/
│   └── 20251014-create-media-resources.js
├── src/
│   ├── models/
│   │   └── MediaResource.js
│   ├── controllers/
│   │   └── mediaResourceController.js
│   ├── routes/
│   │   └── mediaResourceRoutes.js
│   └── middleware/
│       └── authorization.js
```

### Frontend (React + TypeScript)

#### 1. Tipos TypeScript

**Arquivo:** `src/types/mediaResource.ts`

```typescript
- MediaResource (interface completa)
- MediaResourceFormData (dados do formulário)
- MediaResourceFilters (filtros de busca)
- MediaResourceStats (estatísticas)
- ResourceType (enum de tipos)
```

#### 2. Componentes

```
src/
├── components/admin/media-resources/
│   ├── MediaResourceForm.tsx - Formulário de criação/edição
│   └── MediaResourceList.tsx - Lista com filtros
├── pages/admin/
│   └── MediaResourcesManagement.tsx - Página principal
└── services/
    └── mediaResourceService.ts - Serviço de API
```

#### 3. Rotas Adicionadas

```typescript
// Admin
/educare-app/admin/media-resources

// Owner
/educare-app/owner/media-resources
```

---

## 🚀 Como Usar

### 1. Executar Migração do Banco

```bash
cd educare-backend
npm run db:migrate
```

### 2. Acessar o Sistema

1. Fazer login como **Owner** ou **Admin**
2. Navegar para:
   - Admin: `/educare-app/admin/media-resources`
   - Owner: `/educare-app/owner/media-resources`

### 3. Criar Novo Recurso

1. Clicar em **"Novo Recurso"**
2. Preencher informações básicas:
   - Título (obrigatório)
   - Descrição
   - Tipo de recurso
3. Adicionar conteúdo:
   - **Texto/Link:** Digitar no campo de conteúdo
   - **Arquivo:** Fazer upload do arquivo
4. Configurar TTS (opcional):
   - Habilitar TTS
   - Informar endpoint da ferramenta TTS
   - Selecionar voz
5. Categorizar:
   - Categoria
   - Tags (separadas por vírgula)
   - Faixa etária (meses)
6. Definir configurações:
   - Ativo/Inativo
   - Público/Privado
7. Salvar

### 4. Gerenciar Recursos

- **Filtrar:** Por tipo, categoria ou status
- **Buscar:** Por título ou descrição
- **Visualizar:** Ver detalhes completos
- **Editar:** Modificar informações
- **Deletar:** Remover recurso (com confirmação)
- **Gerar TTS:** Criar áudio a partir de texto (se habilitado)

---

## 🔐 Segurança e Permissões

### Controle de Acesso

- ✅ Apenas **Owner** e **Admin** podem acessar
- ✅ Autenticação via JWT obrigatória
- ✅ Middleware de autorização implementado
- ✅ Validação de roles em todas as rotas

### Upload de Arquivos

- ✅ Validação de tipo MIME
- ✅ Limite de tamanho configurável
- ✅ Armazenamento seguro
- ✅ Nomes de arquivo únicos (timestamp + random)
- ✅ Exclusão automática em caso de erro

### Validações

- ✅ Campos obrigatórios validados
- ✅ URLs validadas
- ✅ Faixa etária entre 0-216 meses
- ✅ TTS requer endpoint quando habilitado
- ✅ Links requerem URL
- ✅ Arquivos requerem upload para tipos específicos

---

## 📊 Exemplos de Uso

### Exemplo 1: Recurso de Texto

```json
{
  "title": "Dicas de Desenvolvimento Motor",
  "description": "Orientações para estimular o desenvolvimento motor",
  "resource_type": "text",
  "content": "1. Estimule o bebê a rolar...\n2. Incentive o engatinhar...",
  "category": "Educacional",
  "tags": ["motor", "desenvolvimento", "bebê"],
  "age_range_min": 0,
  "age_range_max": 12,
  "is_active": true,
  "is_public": true
}
```

### Exemplo 2: Áudio com TTS

```json
{
  "title": "História Infantil - O Patinho Feio",
  "description": "Áudio narrado da história clássica",
  "resource_type": "audio",
  "content": "Era uma vez um patinho diferente...",
  "tts_enabled": true,
  "tts_endpoint": "https://api.elevenlabs.io/v1/text-to-speech",
  "tts_voice": "pt-BR-female-1",
  "category": "Recreativo",
  "tags": ["história", "áudio", "infantil"],
  "age_range_min": 24,
  "age_range_max": 72,
  "is_active": true,
  "is_public": true
}
```

### Exemplo 3: Vídeo do YouTube

```json
{
  "title": "Exercícios de Estimulação Precoce",
  "description": "Vídeo demonstrativo de exercícios",
  "resource_type": "link",
  "content": "https://www.youtube.com/watch?v=exemplo",
  "category": "Terapêutico",
  "tags": ["vídeo", "exercícios", "estimulação"],
  "age_range_min": 0,
  "age_range_max": 36,
  "is_active": true,
  "is_public": false
}
```

### Exemplo 4: PDF Educacional

```json
{
  "title": "Guia de Marcos do Desenvolvimento",
  "description": "PDF com marcos esperados por idade",
  "resource_type": "pdf",
  "file": [arquivo PDF],
  "category": "Educacional",
  "tags": ["guia", "marcos", "desenvolvimento"],
  "age_range_min": 0,
  "age_range_max": 216,
  "is_active": true,
  "is_public": true
}
```

---

## 🔧 Configuração de Variáveis de Ambiente

### Backend (.env)

```bash
# Upload de arquivos
UPLOAD_PATH=/home/educare/uploads
MAX_FILE_SIZE=10485760  # 10MB em bytes

# Servidor
PORT=3000
NODE_ENV=production
```

### Frontend (.env)

```bash
VITE_API_URL=https://educare.whatscall.com.br/api
```

---

## 🧪 Testes

### Testar Upload de Arquivo

```bash
curl -X POST http://localhost:3000/api/media-resources \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Teste de Imagem" \
  -F "resource_type=image" \
  -F "file=@/path/to/image.jpg" \
  -F "is_active=true"
```

### Testar Listagem

```bash
curl -X GET "http://localhost:3000/api/media-resources?type=audio&is_active=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Testar TTS

```bash
curl -X POST http://localhost:3000/api/media-resources/RESOURCE_ID/tts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Olá, este é um teste de TTS", "voice": "pt-BR-female"}'
```

---

## 📈 Próximas Melhorias Sugeridas

### Curto Prazo
- [ ] Preview de arquivos na listagem
- [ ] Player de áudio/vídeo integrado
- [ ] Visualizador de PDF inline
- [ ] Drag & drop para upload

### Médio Prazo
- [ ] Integração com CDN (AWS S3, Cloudinary)
- [ ] Compressão automática de imagens
- [ ] Transcodificação de vídeos
- [ ] Múltiplos arquivos por recurso

### Longo Prazo
- [ ] Versionamento de recursos
- [ ] Sistema de aprovação (workflow)
- [ ] Analytics de uso
- [ ] Recomendações baseadas em IA

---

## 🐛 Troubleshooting

### Erro: "Tipo de arquivo não permitido"
**Solução:** Verificar se o tipo MIME do arquivo está na lista de permitidos no `fileFilter` do multer.

### Erro: "Arquivo muito grande"
**Solução:** Ajustar `MAX_FILE_SIZE` no `.env` ou reduzir tamanho do arquivo.

### Erro: "TTS endpoint é obrigatório"
**Solução:** Ao habilitar TTS, sempre fornecer o endpoint da ferramenta.

### Erro: "Acesso negado"
**Solução:** Verificar se o usuário tem role `owner` ou `admin`.

---

## 📞 Suporte

Para dúvidas ou problemas:
- **Email:** dev@educare.com.br
- **Documentação:** `/docs`
- **Issues:** GitHub repository

---

## ✅ Checklist de Implementação

- [x] Migration do banco de dados
- [x] Model Sequelize
- [x] Controller com todas as operações
- [x] Rotas protegidas
- [x] Middleware de autorização
- [x] Upload de arquivos com Multer
- [x] Validação de tipos de arquivo
- [x] Serviço frontend
- [x] Tipos TypeScript
- [x] Componente de formulário
- [x] Componente de listagem
- [x] Página de gerenciamento
- [x] Integração com App.tsx
- [x] Sistema de filtros
- [x] Sistema de busca
- [x] Estatísticas
- [x] Suporte a TTS
- [x] Documentação completa

---

**Implementado por:** Cascade AI  
**Data:** 14/10/2025  
**Versão:** 1.0.0
