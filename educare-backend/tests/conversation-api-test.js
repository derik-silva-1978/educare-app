const http = require('http');

const BASE_URL = process.env.API_URL || 'http://localhost:3001';
const API_KEY = process.env.API_KEY || 'test-key';
const TEST_PHONE = '+5511999990001';

let passed = 0;
let failed = 0;
let skipped = 0;
const results = [];

async function request(method, path, body = null) {
  const url = new URL(path, BASE_URL);
  const options = {
    method,
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    timeout: 10000
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', (err) => resolve({ status: 0, body: { error: err.message } }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: { error: 'timeout' } }); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function test(name, statusCode, body, checks = {}) {
  const result = { name, status: statusCode, passed: true, details: [] };

  if (checks.expectSuccess !== undefined) {
    if (body.success !== checks.expectSuccess) {
      result.passed = false;
      result.details.push(`Expected success=${checks.expectSuccess}, got ${body.success}`);
    }
  }

  if (checks.expectStatus !== undefined && statusCode !== checks.expectStatus) {
    result.passed = false;
    result.details.push(`Expected HTTP ${checks.expectStatus}, got ${statusCode}`);
  }

  if (checks.expectFields) {
    for (const field of checks.expectFields) {
      if (body[field] === undefined) {
        result.passed = false;
        result.details.push(`Missing field: ${field}`);
      }
    }
  }

  if (checks.expectError && !body.error) {
    result.passed = false;
    result.details.push('Expected error field but none found');
  }

  if (result.passed) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}: ${result.details.join(', ')}`);
  }
  results.push(result);
  return result;
}

async function runTests() {
  console.log('\n========================================');
  console.log('  Educare Conversation API Test Suite');
  console.log('========================================\n');

  console.log('--- Health Check (no auth required) ---');
  {
    const r = await request('GET', '/api/conversation/health');
    test('Health check returns OK', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['services', 'timestamp']
    });
  }

  console.log('\n--- State Machine ---');
  {
    const r = await request('GET', '/api/conversation/state-machine');
    test('Get state machine definition', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['states', 'transitions']
    });
  }
  {
    const r = await request('GET', '/api/conversation/state-machine?state=ENTRY');
    test('Get ENTRY state details', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['valid_transitions']
    });
  }

  console.log('\n--- State CRUD ---');
  {
    const r = await request('GET', '/api/conversation/state?phone=' + encodeURIComponent(TEST_PHONE));
    test('Get state (new user)', r.status, r.body, { expectStatus: 200 });
  }
  {
    const r = await request('PUT', '/api/conversation/state', {
      phone: TEST_PHONE,
      active_context: 'child'
    });
    test('Update state', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('POST', '/api/conversation/state/transition', {
      phone: TEST_PHONE,
      to_state: 'CONTEXT_SELECTION'
    });
    test('Transition to CONTEXT_SELECTION', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('POST', '/api/conversation/state/transition', {
      phone: TEST_PHONE,
      to_state: 'FREE_CONVERSATION'
    });
    test('Transition to FREE_CONVERSATION', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }

  console.log('\n--- Validation (missing params) ---');
  {
    const r = await request('GET', '/api/conversation/state');
    test('Get state without phone returns 400', r.status, r.body, {
      expectStatus: 400,
      expectSuccess: false,
      expectError: true
    });
  }
  {
    const r = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE });
    test('Transition without to_state returns 400', r.status, r.body, {
      expectStatus: 400,
      expectSuccess: false,
      expectError: true
    });
  }

  console.log('\n--- Phone Sanitization ---');
  {
    const r = await request('GET', '/api/conversation/state?phone=11999990001');
    test('Phone without country code is accepted', r.status, r.body, { expectStatus: 200 });
  }
  {
    const r = await request('GET', '/api/conversation/state?phone=(11)+99999-0001');
    test('Phone with special chars is sanitized', r.status, r.body, { expectStatus: 200 });
  }

  console.log('\n--- Buffer ---');
  {
    const r = await request('POST', '/api/conversation/buffer', {
      phone: TEST_PHONE,
      message: 'oi, tudo bem?'
    });
    test('Add to buffer', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('GET', `/api/conversation/buffer/${encodeURIComponent(TEST_PHONE)}`);
    test('Get buffer status', r.status, r.body, {
      expectStatus: 200,
      expectFields: ['messages']
    });
  }
  {
    const r = await request('POST', '/api/conversation/buffer/consume', { phone: TEST_PHONE });
    test('Consume buffer', r.status, r.body, {
      expectStatus: 200,
      expectFields: ['combined_text']
    });
  }
  {
    const r = await request('POST', '/api/conversation/buffer', { phone: TEST_PHONE });
    test('Buffer without message returns 400', r.status, r.body, {
      expectStatus: 400,
      expectSuccess: false
    });
  }

  console.log('\n--- Memory ---');
  {
    const r = await request('POST', '/api/conversation/memory', {
      phone: TEST_PHONE,
      role: 'user_message',
      content: 'Como está o desenvolvimento do meu bebê de 3 meses?',
      active_context: 'child',
      interaction_type: 'conversation'
    });
    test('Save memory', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('POST', '/api/conversation/memory', {
      phone: TEST_PHONE,
      role: 'assistant_response',
      content: 'Aos 3 meses o bebê já sustenta a cabeça e segue objetos com o olhar.',
      active_context: 'child',
      interaction_type: 'conversation'
    });
    test('Save assistant memory', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('POST', '/api/conversation/memory', { phone: TEST_PHONE });
    test('Save memory without required fields returns 400', r.status, r.body, {
      expectStatus: 400,
      expectSuccess: false
    });
  }

  console.log('\n--- Context ---');
  {
    const r = await request('GET', `/api/conversation/context/${encodeURIComponent(TEST_PHONE)}`);
    test('Get raw context', r.status, r.body, { expectStatus: 200 });
  }
  {
    const r = await request('GET', `/api/conversation/context/${encodeURIComponent(TEST_PHONE)}/prompt`);
    test('Get context as prompt', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['prompt', 'context_summary']
    });
  }
  {
    const r = await request('GET', `/api/conversation/context/enriched?phone=${encodeURIComponent(TEST_PHONE)}`);
    test('Get enriched context', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['prompt', 'context_summary']
    });
  }

  console.log('\n--- Feedback ---');
  {
    const r = await request('POST', '/api/conversation/feedback', {
      phone: TEST_PHONE,
      score: 4,
      comment: 'Muito bom!'
    });
    test('Save basic feedback', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('POST', '/api/conversation/feedback/contextual', {
      phone: TEST_PHONE,
      score: 5,
      trigger_event: 'quiz_completed'
    });
    test('Save contextual feedback', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['response_text']
    });
  }
  {
    const r = await request('POST', '/api/conversation/feedback/contextual', {
      phone: TEST_PHONE,
      score: 0
    });
    test('Feedback with invalid score returns 400', r.status, r.body, {
      expectStatus: 400,
      expectSuccess: false
    });
  }
  {
    const r = await request('GET', `/api/conversation/feedback/trigger?phone=${encodeURIComponent(TEST_PHONE)}&trigger_event=quiz_completed`);
    test('Check feedback trigger', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['should_trigger', 'total_feedbacks']
    });
  }

  console.log('\n--- Buttons ---');
  {
    const r = await request('POST', '/api/conversation/buttons/format', {
      phone: TEST_PHONE,
      type: 'context_selection'
    });
    test('Format context selection buttons', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['payload']
    });
  }
  {
    const r = await request('POST', '/api/conversation/buttons/format', {
      phone: TEST_PHONE,
      type: 'feedback'
    });
    test('Format feedback buttons', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true
    });
  }
  {
    const r = await request('POST', '/api/conversation/buttons/resolve', {
      phone: TEST_PHONE,
      button_id: 'ctx_child'
    });
    test('Resolve ctx_child button', r.status, r.body, {
      expectStatus: 200,
      expectFields: ['action']
    });
  }
  {
    const r = await request('POST', '/api/conversation/buttons/resolve', {
      phone: TEST_PHONE,
      button_id: 'fb_4'
    });
    test('Resolve feedback button fb_4', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['action']
    });
  }
  {
    const r = await request('POST', '/api/conversation/buttons/resolve', {
      phone: TEST_PHONE,
      button_id: 'action_quiz'
    });
    test('Resolve action_quiz button', r.status, r.body, {
      expectStatus: 200,
      expectFields: ['action']
    });
  }

  console.log('\n--- Audio Preferences ---');
  {
    const r = await request('POST', '/api/conversation/audio-preference', {
      phone: TEST_PHONE,
      preference: 'audio'
    });
    test('Set audio preference', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true
    });
  }
  {
    const r = await request('GET', `/api/conversation/audio-preference?phone=${encodeURIComponent(TEST_PHONE)}`);
    test('Get audio preference', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['audio_preference']
    });
  }
  {
    const r = await request('POST', '/api/conversation/audio-preference', {
      phone: TEST_PHONE,
      preference: 'invalid'
    });
    test('Invalid audio preference returns 400', r.status, r.body, {
      expectStatus: 400,
      expectSuccess: false
    });
  }

  console.log('\n--- Welcome & Menu ---');
  {
    const r = await request('GET', `/api/conversation/welcome?phone=${encodeURIComponent(TEST_PHONE)}`);
    test('Get welcome message', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['type', 'text', 'buttons']
    });
  }
  {
    const r = await request('GET', `/api/conversation/menu?phone=${encodeURIComponent(TEST_PHONE)}`);
    test('Get contextual menu', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['contextual_menu', 'current_state']
    });
  }

  console.log('\n--- TTS ---');
  {
    const r = await request('GET', '/api/conversation/tts/status');
    test('Get TTS status', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['configured']
    });
  }

  console.log('\n--- Reports ---');
  {
    const r = await request('POST', '/api/conversation/report', {
      phone: TEST_PHONE,
      content: 'Botão de quiz não funciona',
      type: 'problem'
    });
    test('Save support report', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('GET', `/api/conversation/reports?phone=${encodeURIComponent(TEST_PHONE)}`);
    test('Get reports', r.status, r.body, { expectStatus: 200 });
  }

  console.log('\n--- Session & Analytics ---');
  {
    const r = await request('POST', '/api/conversation/session/summary', { phone: TEST_PHONE });
    test('Generate session summary', r.status, r.body, { expectStatus: 200, expectSuccess: true });
  }
  {
    const r = await request('GET', `/api/conversation/analytics?phone=${encodeURIComponent(TEST_PHONE)}`);
    test('Get analytics', r.status, r.body, {
      expectStatus: 200,
      expectSuccess: true,
      expectFields: ['current_session', 'interactions', 'feedback', 'reports']
    });
  }

  console.log('\n\n========================================');
  console.log(`  Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  console.log(`  Total: ${passed + failed + skipped} tests`);
  console.log('========================================\n');

  if (failed > 0) {
    console.log('Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ✗ ${r.name}: ${r.details.join(', ')}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
