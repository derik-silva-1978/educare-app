const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const nlpParserService = {
  async parseBiometrics(rawText) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        timeout: 30000,
        messages: [
          {
            role: 'system',
            content: `Você é um parser de dados biométricos de bebês. Extraia peso (em kg) e altura (em cm) do texto.
Retorne APENAS um JSON válido no formato: {"weight": number|null, "height": number|null, "head_circumference": number|null}
Se não encontrar um valor, use null. Converta unidades se necessário (g para kg, m para cm).
Exemplos:
- "peso 8.5kg" → {"weight": 8.5, "height": null, "head_circumference": null}
- "8500g altura 72cm" → {"weight": 8.5, "height": 72, "head_circumference": null}
- "Bebê mede 68 centímetros e pesa 7,2 quilos" → {"weight": 7.2, "height": 68, "head_circumference": null}`
          },
          {
            role: 'user',
            content: rawText
          }
        ],
        temperature: 0,
        max_tokens: 100
      });

      const content = response.choices[0].message.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { weight: null, height: null, head_circumference: null };
    } catch (error) {
      console.error('[NLP Parser] Erro ao parsear biometria:', error.message);
      return { weight: null, height: null, head_circumference: null, error: error.message };
    }
  },

  async parseSleep(rawText) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        timeout: 30000,
        messages: [
          {
            role: 'system',
            content: `Você é um parser de registros de sono de bebês. Extraia horários e duração do texto.
Retorne APENAS um JSON válido no formato: 
{"start_time": "HH:MM"|null, "end_time": "HH:MM"|null, "duration_minutes": number|null, "sleep_type": "night"|"nap"|"unknown", "quality": "good"|"regular"|"poor"|"unknown"}

Exemplos:
- "dormiu às 21h e acordou 6h30" → {"start_time": "21:00", "end_time": "06:30", "duration_minutes": 570, "sleep_type": "night", "quality": "unknown"}
- "soneca de 2 horas" → {"start_time": null, "end_time": null, "duration_minutes": 120, "sleep_type": "nap", "quality": "unknown"}
- "dormiu mal, acordou várias vezes" → {"start_time": null, "end_time": null, "duration_minutes": null, "sleep_type": "unknown", "quality": "poor"}`
          },
          {
            role: 'user',
            content: rawText
          }
        ],
        temperature: 0,
        max_tokens: 150
      });

      const content = response.choices[0].message.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { start_time: null, end_time: null, duration_minutes: null, sleep_type: 'unknown', quality: 'unknown' };
    } catch (error) {
      console.error('[NLP Parser] Erro ao parsear sono:', error.message);
      return { start_time: null, end_time: null, duration_minutes: null, sleep_type: 'unknown', quality: 'unknown', error: error.message };
    }
  },

  async parseAppointment(rawText) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        timeout: 30000,
        messages: [
          {
            role: 'system',
            content: `Você é um parser de agendamentos médicos. Extraia informações de consultas do texto.
Retorne APENAS um JSON válido no formato:
{"doctor_name": string|null, "specialty": string|null, "appointment_date": "YYYY-MM-DD"|null, "appointment_time": "HH:MM"|null, "location": string|null}

Use a data atual como referência: ${new Date().toISOString().split('T')[0]}

Exemplos:
- "consulta com Dr. Silva pediatra dia 15" → {"doctor_name": "Dr. Silva", "specialty": "pediatra", "appointment_date": "2025-01-15", "appointment_time": null, "location": null}
- "neurologista às 14h amanhã" → {"doctor_name": null, "specialty": "neurologista", "appointment_date": "2025-12-12", "appointment_time": "14:00", "location": null}
- "exame de sangue na UBS Centro" → {"doctor_name": null, "specialty": "exame de sangue", "appointment_date": null, "appointment_time": null, "location": "UBS Centro"}`
          },
          {
            role: 'user',
            content: rawText
          }
        ],
        temperature: 0,
        max_tokens: 150
      });

      const content = response.choices[0].message.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { doctor_name: null, specialty: null, appointment_date: null, appointment_time: null, location: null };
    } catch (error) {
      console.error('[NLP Parser] Erro ao parsear consulta:', error.message);
      return { doctor_name: null, specialty: null, appointment_date: null, appointment_time: null, location: null, error: error.message };
    }
  },

  async parseVaccine(rawText) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um parser de registros de vacinas. Extraia informações de vacinas do texto.
Retorne APENAS um JSON válido no formato:
{"vaccine_name": string|null, "dose_number": number|null, "taken_at": "YYYY-MM-DD"|null, "location": string|null, "batch_number": string|null}

Use a data atual como referência: ${new Date().toISOString().split('T')[0]}

Exemplos:
- "tomou BCG ontem" → {"vaccine_name": "BCG", "dose_number": 1, "taken_at": "2025-12-10", "location": null, "batch_number": null}
- "segunda dose da pentavalente" → {"vaccine_name": "Pentavalente", "dose_number": 2, "taken_at": null, "location": null, "batch_number": null}
- "hepatite B na maternidade" → {"vaccine_name": "Hepatite B", "dose_number": 1, "taken_at": null, "location": "maternidade", "batch_number": null}`
          },
          {
            role: 'user',
            content: rawText
          }
        ],
        temperature: 0,
        max_tokens: 150
      });

      const content = response.choices[0].message.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { vaccine_name: null, dose_number: null, taken_at: null, location: null, batch_number: null };
    } catch (error) {
      console.error('[NLP Parser] Erro ao parsear vacina:', error.message);
      return { vaccine_name: null, dose_number: null, taken_at: null, location: null, batch_number: null, error: error.message };
    }
  }
};

module.exports = nlpParserService;
