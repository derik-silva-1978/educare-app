-- Migration: Create Chat Tables
-- Date: 2025-01-24
-- Description: Create tables for chat/messaging functionality

-- Create enum for message types
CREATE TYPE enum_chat_messages_type AS ENUM ('text', 'file', 'image', 'ai_summary', 'system');

-- Create enum for message status
CREATE TYPE enum_chat_messages_status AS ENUM ('sent', 'delivered', 'read', 'failed');

-- Create chat_groups table (links teams to children for chat context)
CREATE TABLE IF NOT EXISTS chat_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    child_id UUID NULL, -- Optional: link to specific child
    name VARCHAR(255) NOT NULL,
    description TEXT,
    invite_code VARCHAR(10) UNIQUE NOT NULL DEFAULT UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 8)),
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_group_id UUID NOT NULL REFERENCES chat_groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) NOT NULL, -- 'parent', 'professional', 'ai_assistant'
    message_content TEXT NOT NULL,
    message_type enum_chat_messages_type DEFAULT 'text',
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    reply_to_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    status enum_chat_messages_status DEFAULT 'sent',
    is_ai_processed BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chat_message_reactions table
CREATE TABLE IF NOT EXISTS chat_message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- Create chat_message_reads table (track read status)
CREATE TABLE IF NOT EXISTS chat_message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Create chat_typing_indicators table (for real-time typing)
CREATE TABLE IF NOT EXISTS chat_typing_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_group_id UUID NOT NULL REFERENCES chat_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    is_typing BOOLEAN DEFAULT true,
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(chat_group_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_groups_team_id ON chat_groups(team_id);
CREATE INDEX IF NOT EXISTS idx_chat_groups_child_id ON chat_groups(child_id);
CREATE INDEX IF NOT EXISTS idx_chat_groups_invite_code ON chat_groups(invite_code);

CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_group_id ON chat_messages(chat_group_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_reply_to_id ON chat_messages(reply_to_id);

CREATE INDEX IF NOT EXISTS idx_chat_message_reactions_message_id ON chat_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_message_reactions_user_id ON chat_message_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_message_reads_message_id ON chat_message_reads(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_message_reads_user_id ON chat_message_reads(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_typing_indicators_chat_group_id ON chat_typing_indicators(chat_group_id);
CREATE INDEX IF NOT EXISTS idx_chat_typing_indicators_user_id ON chat_typing_indicators(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_typing_indicators_last_activity ON chat_typing_indicators(last_activity);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_groups_updated_at BEFORE UPDATE ON chat_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO chat_groups (team_id, name, description) 
SELECT 
    t.id,
    'Chat - ' || t.name,
    'Grupo de comunicação da equipe ' || t.name
FROM teams t 
WHERE NOT EXISTS (
    SELECT 1 FROM chat_groups cg WHERE cg.team_id = t.id
)
LIMIT 5;

COMMENT ON TABLE chat_groups IS 'Grupos de chat vinculados às equipes';
COMMENT ON TABLE chat_messages IS 'Mensagens do chat entre membros das equipes';
COMMENT ON TABLE chat_message_reactions IS 'Reações (emojis) às mensagens';
COMMENT ON TABLE chat_message_reads IS 'Controle de leitura das mensagens';
COMMENT ON TABLE chat_typing_indicators IS 'Indicadores de digitação em tempo real';
