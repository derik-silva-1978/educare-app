const http = require('http');

const BASE_URL = 'http://localhost:3001';
const API_KEY = 'educare_external_api_key_2025';
const TEST_PHONE = '5511999990001';
const TEST_PHONE_2 = '5511999990002';

let passed = 0;
let failed = 0;
let errors = [];

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function assert(testName, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    const msg = `  ✗ ${testName}${detail ? ' — ' + detail : ''}`;
    errors.push(msg);
    console.log(msg);
  }
}

async function testAuthMiddleware() {
  console.log('\n═══ 1. API KEY MIDDLEWARE ═══');
  const noKey = await new Promise((resolve) => {
    const req = http.request({ hostname: 'localhost', port: 3001, path: '/api/conversation/state?phone=' + TEST_PHONE, method: 'GET', headers: { 'Content-Type': 'application/json' } }, (res) => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    }); req.end();
  });
  assert('Rejects request without API key', noKey.status === 401);

  const badKey = await new Promise((resolve) => {
    const req = http.request({ hostname: 'localhost', port: 3001, path: '/api/conversation/state?phone=' + TEST_PHONE, method: 'GET', headers: { 'Content-Type': 'application/json', 'x-api-key': 'wrong' } }, (res) => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    }); req.end();
  });
  assert('Rejects invalid API key', badKey.status === 401);

  const good = await request('GET', `/api/conversation/state?phone=${TEST_PHONE}`);
  assert('Accepts valid API key', good.status === 200);
}

async function testStateManagement() {
  console.log('\n═══ 2. STATE MANAGEMENT ═══');
  const get = await request('GET', `/api/conversation/state?phone=${TEST_PHONE}`);
  assert('GET /state?phone returns 200', get.status === 200);
  assert('Returns success + state object', get.body?.success === true && get.body?.state !== undefined);

  const currentState = get.body?.state?.state;
  if (currentState && currentState !== 'ENTRY') {
    if (currentState === 'EXIT') {
      await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE, to_state: 'ENTRY' });
    } else {
      const validTransitions = (await request('GET', `/api/conversation/state-machine?state=${currentState}`)).body?.valid_transitions || [];
      if (validTransitions.includes('EXIT')) {
        await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE, to_state: 'EXIT' });
        await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE, to_state: 'ENTRY' });
      }
    }
  }

  const tr = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE, to_state: 'CONTEXT_SELECTION' });
  assert('Transition ENTRY→CONTEXT_SELECTION succeeds', tr.body?.success === true, JSON.stringify(tr.body?.error));

  const verify = await request('GET', `/api/conversation/state?phone=${TEST_PHONE}`);
  assert('State persisted as CONTEXT_SELECTION', verify.body?.state?.state === 'CONTEXT_SELECTION', `Got: ${verify.body?.state?.state}`);
}

async function testStateMachineEnforcement() {
  console.log('\n═══ 3. STATE MACHINE TRANSITIONS ═══');
  const p2State = await request('GET', `/api/conversation/state?phone=${TEST_PHONE_2}`);
  const p2Current = p2State.body?.state?.state;
  if (p2Current && p2Current !== 'ENTRY') {
    if (p2Current === 'EXIT') {
      await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'ENTRY' });
    } else {
      const vt = (await request('GET', `/api/conversation/state-machine?state=${p2Current}`)).body?.valid_transitions || [];
      if (vt.includes('EXIT')) {
        await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'EXIT' });
        await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'ENTRY' });
      }
    }
  }
  await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'CONTEXT_SELECTION' });

  const valid1 = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'FREE_CONVERSATION' });
  assert('CONTEXT_SELECTION → FREE_CONVERSATION valid', valid1.body?.success === true);

  const invalid1 = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'ENTRY' });
  assert('FREE_CONVERSATION → ENTRY rejected', invalid1.body?.success === false, JSON.stringify(invalid1.body?.error));

  const valid2 = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'QUIZ_FLOW' });
  assert('FREE_CONVERSATION → QUIZ_FLOW valid', valid2.body?.success === true);

  const valid3 = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'FEEDBACK' });
  assert('QUIZ_FLOW → FEEDBACK valid', valid3.body?.success === true);

  const valid4 = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'EXIT' });
  assert('FEEDBACK → EXIT valid', valid4.body?.success === true);

  const valid5 = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE_2, to_state: 'ENTRY' });
  assert('EXIT → ENTRY valid (re-entry)', valid5.body?.success === true);
}

async function testStateMetadata() {
  console.log('\n═══ 4. STATE UPDATE WITH METADATA ═══');
  const up = await request('PUT', '/api/conversation/state', {
    phone: TEST_PHONE, active_context: 'child', assistant_name: 'TitiNauta', journey_week: 12
  });
  assert('PUT /state updates metadata', up.body?.success === true, JSON.stringify(up.body?.error));

  const v = await request('GET', `/api/conversation/state?phone=${TEST_PHONE}`);
  assert('Active context persisted as child', v.body?.state?.active_context === 'child', `Got: ${v.body?.state?.active_context}`);
  assert('Journey week persisted as 12', v.body?.state?.journey_week === 12, `Got: ${v.body?.state?.journey_week}`);
}

async function testStateMachineInfo() {
  console.log('\n═══ 5. STATE MACHINE INFO ═══');
  const all = await request('GET', '/api/conversation/state-machine');
  assert('GET /state-machine returns all states', all.body?.success === true);
  assert('Has 10 states', all.body?.states?.length === 10, `Got: ${all.body?.states?.length}`);
  assert('Has transitions map', typeof all.body?.transitions === 'object');

  const info = await request('GET', '/api/conversation/state-machine?state=ENTRY');
  assert('State info for ENTRY returned', info.body?.success === true);
  assert('ENTRY has valid_transitions array', Array.isArray(info.body?.valid_transitions));
}

async function testMessageBuffer() {
  console.log('\n═══ 6. MESSAGE BUFFER ═══');
  const add1 = await request('POST', '/api/conversation/buffer', { phone: TEST_PHONE, message: 'Olá' });
  assert('Buffer add returns success', add1.body?.success === true, JSON.stringify(add1.body));
  assert('Buffer returns ready_to_process flag', add1.body?.ready_to_process !== undefined);

  const add2 = await request('POST', '/api/conversation/buffer', { phone: TEST_PHONE, message: 'Meu bebê tem 3 meses e começou a sorrir' });
  assert('Second message accepted', add2.body?.success === true);

  const get = await request('GET', `/api/conversation/buffer/${TEST_PHONE}`);
  assert('GET /buffer/:phone returns buffer', get.body?.success === true);
  assert('Buffer has messages', get.body?.buffer_count >= 1 || get.body?.messages?.length >= 1, JSON.stringify(get.body));

  const consume = await request('POST', '/api/conversation/buffer/consume', { phone: TEST_PHONE });
  assert('Consume returns merged text', consume.body?.success === true && consume.body?.combined_text !== undefined,
    JSON.stringify(consume.body));

  const empty = await request('GET', `/api/conversation/buffer/${TEST_PHONE}`);
  assert('Buffer empty after consume', (empty.body?.buffer_count === 0 || empty.body?.messages?.length === 0),
    JSON.stringify(empty.body));
}

async function testConversationContext() {
  console.log('\n═══ 7. CONVERSATION CONTEXT ═══');
  const ctx = await request('GET', `/api/conversation/context/${TEST_PHONE}`);
  assert('GET /context/:phone returns 200', ctx.status === 200);
  assert('Context has state info', ctx.body?.state !== undefined, JSON.stringify(Object.keys(ctx.body || {})));

  const prompt = await request('GET', `/api/conversation/context/${TEST_PHONE}/prompt`);
  assert('GET /context/:phone/prompt returns 200', prompt.status === 200);
  assert('Prompt has formatted text', prompt.body?.prompt !== undefined);
  assert('Prompt includes context_summary', prompt.body?.context_summary !== undefined);
}

async function testWhatsappButtons() {
  console.log('\n═══ 8. WHATSAPP BUTTONS ═══');
  const ctx = await request('POST', '/api/conversation/buttons/format', { phone: TEST_PHONE, type: 'context_selection' });
  assert('Context selection buttons generated', ctx.body?.success === true && ctx.body?.payload !== undefined);

  const fb = await request('POST', '/api/conversation/buttons/format', { phone: TEST_PHONE, type: 'feedback' });
  assert('Feedback buttons generated', fb.body?.success === true);

  const menu = await request('POST', '/api/conversation/buttons/format', { phone: TEST_PHONE, type: 'menu', active_context: 'child' });
  assert('Menu buttons generated', menu.body?.success === true);

  const custom = await request('POST', '/api/conversation/buttons/format', {
    phone: TEST_PHONE, text: 'Escolha:', buttons: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }]
  });
  assert('Custom buttons generated', custom.body?.success === true);
}

async function testFeedback() {
  console.log('\n═══ 9. UX FEEDBACK ═══');
  const fb = await request('POST', '/api/conversation/feedback', {
    phone: TEST_PHONE, score: 4, comment: 'Muito bom!', state: 'FREE_CONVERSATION', active_context: 'child'
  });
  assert('Feedback saved', fb.body?.success === true, JSON.stringify(fb.body));

  const min = await request('POST', '/api/conversation/feedback', { phone: TEST_PHONE, score: 5 });
  assert('Minimal feedback accepted', min.body?.success === true);

  const noScore = await request('POST', '/api/conversation/feedback', { phone: TEST_PHONE });
  assert('Rejects missing score', noScore.status === 400 || noScore.body?.success === false);
}

async function testReports() {
  console.log('\n═══ 10. SUPPORT REPORTS ═══');
  const prob = await request('POST', '/api/conversation/report', {
    phone: TEST_PHONE, type: 'problem', content: 'Botão não funciona', state: 'SUPPORT'
  });
  assert('Problem report saved', prob.body?.success === true, JSON.stringify(prob.body));

  const sug = await request('POST', '/api/conversation/report', {
    phone: TEST_PHONE, type: 'suggestion', content: 'Dicas diárias por áudio'
  });
  assert('Suggestion saved', sug.body?.success === true);

  const list = await request('GET', '/api/conversation/reports');
  assert('GET /reports returns list', list.body?.success === true);
}

async function testMemory() {
  console.log('\n═══ 11. CONVERSATION MEMORY ═══');
  const save = await request('POST', '/api/conversation/memory', {
    phone: TEST_PHONE, role: 'user_message', content: 'Meu bebê começou a engatinhar hoje!',
    active_context: 'child', emotional_tone: 'happy'
  });
  assert('User message saved', save.body?.success === true, JSON.stringify(save.body));

  const save2 = await request('POST', '/api/conversation/memory', {
    phone: TEST_PHONE, role: 'assistant_response',
    content: 'Que maravilha! Engatinhar é um marco importante.',
    active_context: 'child', assistant_name: 'TitiNauta'
  });
  assert('Assistant response saved', save2.body?.success === true, JSON.stringify(save2.body));

  const noRole = await request('POST', '/api/conversation/memory', { phone: TEST_PHONE, content: 'test' });
  assert('Rejects missing role', noRole.status === 400 || noRole.body?.success === false);
}

async function testTTS() {
  console.log('\n═══ 12. TTS SERVICE ═══');
  const status = await request('GET', '/api/conversation/tts/status');
  assert('TTS status returns config', status.body?.configured !== undefined);
  assert('TTS status has cache info', status.body?.cache !== undefined);

  const short = await request('GET', '/api/conversation/tts/audio/abc123');
  assert('Short hash rejected (400)', short.status === 400);

  const valid = await request('GET', '/api/conversation/tts/audio/abcdef0123456789');
  assert('Valid hash returns 404 (no cache)', valid.status === 404);

  const upper = await request('GET', '/api/conversation/tts/audio/ABCDEF0123456789');
  assert('Uppercase hash rejected', upper.status === 400);
}

async function testInputValidation() {
  console.log('\n═══ 13. INPUT VALIDATION ═══');
  const noPhone = await request('POST', '/api/conversation/state/transition', { to_state: 'ENTRY' });
  assert('Transition rejects missing phone', noPhone.status === 400);

  const noState = await request('POST', '/api/conversation/state/transition', { phone: TEST_PHONE });
  assert('Transition rejects missing to_state', noState.status === 400);

  const noMsg = await request('POST', '/api/conversation/buffer', { phone: TEST_PHONE });
  assert('Buffer rejects missing message', noMsg.status === 400);

  const noPhBuf = await request('POST', '/api/conversation/buffer', { message: 'test' });
  assert('Buffer rejects missing phone', noPhBuf.status === 400);

  const noCont = await request('POST', '/api/conversation/report', { phone: TEST_PHONE, type: 'problem' });
  assert('Report rejects missing content', noCont.status === 400);

  const noPhState = await request('GET', '/api/conversation/state');
  assert('GET /state rejects missing phone', noPhState.status === 400);
}

async function testDatabaseVerification() {
  console.log('\n═══ 14. DATABASE TABLES ═══');
  const state = await request('GET', `/api/conversation/state?phone=${TEST_PHONE}`);
  assert('conversation_states table works', state.status === 200 && state.body?.success === true);

  const reports = await request('GET', '/api/conversation/reports');
  assert('support_reports table works', reports.status === 200);

  const ctx = await request('GET', `/api/conversation/context/${TEST_PHONE}`);
  assert('Multi-table query works (context)', ctx.status === 200);
}

async function cleanup() {
  console.log('\n═══ CLEANUP ═══');
  for (const phone of [TEST_PHONE, TEST_PHONE_2]) {
    try { await request('POST', '/api/conversation/state/transition', { phone, to_state: 'EXIT', force: true }); } catch {}
  }
  console.log('  Test data cleanup attempted');
}

async function runAllTests() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     EDUCARE+ PHASE 3 INTEGRATION TEST SUITE     ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`Target: ${BASE_URL} | ${new Date().toISOString()}`);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  try {
    await testAuthMiddleware();
    await testStateManagement();
    await delay(1500);
    await testStateMachineEnforcement();
    await testStateMetadata();
    await testStateMachineInfo();
    await delay(1500);
    await testMessageBuffer();
    await testConversationContext();
    await delay(1500);
    await testWhatsappButtons();
    await testFeedback();
    await testReports();
    await delay(1500);
    await testMemory();
    await testTTS();
    await delay(1500);
    await testInputValidation();
    await testDatabaseVerification();
    await cleanup();
  } catch (e) {
    console.error('\n⚠ Test suite error:', e.message);
  }

  console.log('\n══════════════════════════════════════════════════');
  console.log(`RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('══════════════════════════════════════════════════');
  if (errors.length > 0) {
    console.log('\nFAILED TESTS:');
    errors.forEach(e => console.log(e));
  }
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();
