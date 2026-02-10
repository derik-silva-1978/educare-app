const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const AUDIO_CACHE_DIR = path.join(process.cwd(), 'uploads', 'audio_cache');
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const MAX_TEXT_LENGTH = 5000;
const REQUEST_TIMEOUT = 30000;

function ensureCacheDir() {
  if (!fs.existsSync(AUDIO_CACHE_DIR)) {
    fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
  }
}

function getTextHash(text) {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex').substring(0, 16);
}

function getCachedAudioPath(textHash) {
  return path.join(AUDIO_CACHE_DIR, `${textHash}.mp3`);
}

function getCachedAudio(text) {
  ensureCacheDir();
  const hash = getTextHash(text);
  const filePath = getCachedAudioPath(hash);

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const maxAge = parseInt(process.env.AUDIO_CACHE_MAX_AGE_HOURS || '168', 10) * 3600000;
    if (Date.now() - stats.mtimeMs < maxAge) {
      return { cached: true, filePath, hash };
    }
    fs.unlinkSync(filePath);
  }

  return { cached: false, filePath: null, hash };
}

async function textToSpeech(text, options = {}) {
  const startTime = Date.now();

  if (!process.env.ELEVENLABS_API_KEY) {
    return {
      success: false,
      error: 'ELEVENLABS_API_KEY não configurada',
      fallback: 'text'
    };
  }

  if (!text || text.trim().length === 0) {
    return { success: false, error: 'Texto vazio' };
  }

  const cleanText = text.trim().substring(0, MAX_TEXT_LENGTH);

  const cached = getCachedAudio(cleanText);
  if (cached.cached) {
    console.log(`[ElevenLabs] Cache hit: ${cached.hash}`);
    return {
      success: true,
      filePath: cached.filePath,
      hash: cached.hash,
      cached: true,
      processing_time_ms: Date.now() - startTime
    };
  }

  try {
    ensureCacheDir();
    const hash = getTextHash(cleanText);
    const outputPath = getCachedAudioPath(hash);
    const voiceId = options.voiceId || VOICE_ID;
    const modelId = options.modelId || MODEL_ID;

    const requestData = JSON.stringify({
      text: cleanText,
      model_id: modelId,
      voice_settings: {
        stability: options.stability || 0.5,
        similarity_boost: options.similarityBoost || 0.75,
        style: options.style || 0.0,
        use_speaker_boost: true
      }
    });

    const audioBuffer = await makeElevenLabsRequest(voiceId, requestData);

    fs.writeFileSync(outputPath, audioBuffer);

    console.log(`[ElevenLabs] Generated: ${hash} (${audioBuffer.length} bytes, ${Date.now() - startTime}ms)`);

    return {
      success: true,
      filePath: outputPath,
      hash,
      cached: false,
      file_size: audioBuffer.length,
      processing_time_ms: Date.now() - startTime
    };
  } catch (error) {
    console.error(`[ElevenLabs] TTS error (${Date.now() - startTime}ms):`, error.message);
    return {
      success: false,
      error: error.message,
      fallback: 'text',
      processing_time_ms: Date.now() - startTime
    };
  }
}

function makeElevenLabsRequest(voiceId, requestData) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Length': Buffer.byteLength(requestData)
      },
      timeout: REQUEST_TIMEOUT
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => { errorData += chunk; });
        res.on('end', () => {
          reject(new Error(`ElevenLabs API error ${res.statusCode}: ${errorData.substring(0, 200)}`));
        });
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', error => reject(error));
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout (${REQUEST_TIMEOUT}ms)`)); });
    req.write(requestData);
    req.end();
  });
}

function cleanCache(maxAgeHours) {
  ensureCacheDir();
  const maxAge = (maxAgeHours || parseInt(process.env.AUDIO_CACHE_MAX_AGE_HOURS || '168', 10)) * 3600000;
  let cleaned = 0;

  try {
    const files = fs.readdirSync(AUDIO_CACHE_DIR);
    for (const file of files) {
      const filePath = path.join(AUDIO_CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      if (Date.now() - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    }
  } catch (error) {
    console.error('[ElevenLabs] Cache cleanup error:', error.message);
  }

  return { cleaned, cache_dir: AUDIO_CACHE_DIR };
}

function getCacheStats() {
  ensureCacheDir();
  try {
    const files = fs.readdirSync(AUDIO_CACHE_DIR);
    let totalSize = 0;

    for (const file of files) {
      const stats = fs.statSync(path.join(AUDIO_CACHE_DIR, file));
      totalSize += stats.size;
    }

    return {
      total_files: files.length,
      total_size_bytes: totalSize,
      total_size_mb: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      cache_dir: AUDIO_CACHE_DIR
    };
  } catch (error) {
    return { total_files: 0, total_size_bytes: 0, total_size_mb: 0, error: error.message };
  }
}

function isConfigured() {
  return !!process.env.ELEVENLABS_API_KEY;
}

module.exports = {
  textToSpeech,
  getCachedAudio,
  cleanCache,
  getCacheStats,
  isConfigured,
  getTextHash
};
