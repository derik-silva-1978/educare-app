const pgvectorService = require('./pgvectorService');

const BUFFER_TTL_MS = parseInt(process.env.BUFFER_TTL_MS || '12000', 10);
const MIN_MESSAGE_LENGTH = parseInt(process.env.BUFFER_MIN_LENGTH || '15', 10);
const MAX_BUFFER_SIZE = parseInt(process.env.BUFFER_MAX_SIZE || '20', 10);

const SHORT_MESSAGE_RESPONSE = 'Oi 😊\nMe conta um pouquinho mais pra eu conseguir te ajudar melhor.';

const CLEAR_INTENT_PATTERNS = [
  /^\/\w+/,
  /^(sair|exit|quit|parar|menu|ajuda|help)$/i,
  /^[1-5]$/,
  /^(ctx_child|ctx_mother|fb_\d|action_\w+)$/,
  /\?$/
];

function hasClearIntent(text) {
  if (!text) return false;
  const trimmed = text.trim();
  return CLEAR_INTENT_PATTERNS.some(pattern => pattern.test(trimmed));
}

function isReadyToProcess(messages, bufferStartedAt) {
  if (!messages || messages.length === 0) return false;

  const combined = messages.join(' ').trim();

  if (hasClearIntent(combined)) return true;

  if (combined.length >= MIN_MESSAGE_LENGTH) return true;

  if (bufferStartedAt) {
    const elapsed = Date.now() - new Date(bufferStartedAt).getTime();
    if (elapsed >= BUFFER_TTL_MS) return true;
  }

  return false;
}

async function addMessage(userPhone, messageText) {
  const stateResult = await pgvectorService.getConversationState(userPhone);

  let currentMessages = [];
  let bufferStartedAt = null;

  if (stateResult.success && stateResult.state) {
    currentMessages = stateResult.state.buffer_messages || [];
    bufferStartedAt = stateResult.state.buffer_started_at;
  }

  if (currentMessages.length >= MAX_BUFFER_SIZE) {
    currentMessages = currentMessages.slice(-MAX_BUFFER_SIZE + 1);
  }

  const trimmedText = messageText.trim();
  currentMessages.push(trimmedText);

  if (!bufferStartedAt) {
    bufferStartedAt = new Date().toISOString();
  }

  await pgvectorService.updateConversationState(userPhone, {
    buffer_messages: currentMessages,
    buffer_started_at: bufferStartedAt
  });

  const ready = isReadyToProcess(currentMessages, bufferStartedAt);

  return {
    success: true,
    ready_to_process: ready,
    buffer_count: currentMessages.length,
    combined_text: ready ? currentMessages.join(' ').trim() : null,
    needs_prompt: !ready && trimmedText.length < MIN_MESSAGE_LENGTH,
    prompt_message: !ready && trimmedText.length < MIN_MESSAGE_LENGTH ? SHORT_MESSAGE_RESPONSE : null
  };
}

async function getBuffer(userPhone) {
  const stateResult = await pgvectorService.getConversationState(userPhone);

  if (!stateResult.success || !stateResult.state) {
    return {
      success: true,
      messages: [],
      combined_text: '',
      ready_to_process: false,
      buffer_age_ms: 0
    };
  }

  const messages = stateResult.state.buffer_messages || [];
  const bufferStartedAt = stateResult.state.buffer_started_at;
  const bufferAge = bufferStartedAt ? Date.now() - new Date(bufferStartedAt).getTime() : 0;
  const ready = isReadyToProcess(messages, bufferStartedAt);

  return {
    success: true,
    messages,
    combined_text: messages.join(' ').trim(),
    ready_to_process: ready,
    buffer_count: messages.length,
    buffer_age_ms: bufferAge,
    ttl_remaining_ms: bufferStartedAt ? Math.max(0, BUFFER_TTL_MS - bufferAge) : BUFFER_TTL_MS
  };
}

async function clearBuffer(userPhone) {
  await pgvectorService.updateConversationState(userPhone, {
    buffer_messages: [],
    buffer_started_at: null
  });

  return { success: true };
}

async function consumeBuffer(userPhone) {
  const bufferResult = await getBuffer(userPhone);

  if (!bufferResult.success || bufferResult.messages.length === 0) {
    return {
      success: true,
      combined_text: '',
      message_count: 0
    };
  }

  const combined = bufferResult.combined_text;
  const count = bufferResult.messages.length;

  await clearBuffer(userPhone);

  return {
    success: true,
    combined_text: combined,
    message_count: count
  };
}

module.exports = {
  addMessage,
  getBuffer,
  clearBuffer,
  consumeBuffer,
  isReadyToProcess,
  hasClearIntent,
  BUFFER_TTL_MS,
  MIN_MESSAGE_LENGTH
};
