# FASE 1: Gestão de Notícias - PRD

## 📰 Visão Geral
Sistema de publicação de notícias com acesso público, integrado ao Educare+.

## 🎯 Objetivos
1. Permitir Owner/Admin publicar notícias
2. Usuários públicos acessam notícias (sem login necessário)
3. Rastreamento de visualizações
4. SEO-friendly (metatags dinâmicas)

## 📊 Mudanças no Schema

### Nova Tabela: `content_access`
```sql
CREATE TABLE content_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_items(id),
  user_id UUID REFERENCES users(id),
  access_type VARCHAR DEFAULT 'free', -- 'free', 'paid', 'subscription'
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  access_level VARCHAR DEFAULT 'full', -- 'preview', 'full'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Alteração: `content_items`
```sql
ALTER TABLE content_items ADD COLUMN (
  vimeo_video_id VARCHAR,  -- opcional para notícias com vídeo
  is_featured BOOLEAN DEFAULT FALSE,
  read_time_minutes INTEGER,
  seo_slug VARCHAR UNIQUE,
  view_count INTEGER DEFAULT 0
);
```

## 🔌 APIs Necessárias

### GET `/api/content/:id/public`
Retorna notícia completa (público)
```json
{
  "id": "uuid",
  "type": "news",
  "title": "Título",
  "summary": "Resumo",
  "content": "Conteúdo HTML",
  "image_url": "url",
  "view_count": 1234,
  "published_at": "2025-12-15T10:00:00Z",
  "author": { "id": "uuid", "name": "Admin" }
}
```

### GET `/api/content/public?type=news&limit=10`
Lista de notícias (paginado)

### POST `/api/admin/content/:id/view`
Registra visualização

## 💾 Seeding de Dados
Incluir 5 notícias exemplo no banco para testes

## ✅ Checklist Fase 1
- [ ] Schema `content_access` criado
- [ ] Migrações executadas
- [ ] Endpoints GET implementados
- [ ] Frontend NewsDetail.tsx criado
- [ ] Testes E2E passar
