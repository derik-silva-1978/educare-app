const fs = require('fs');
const path = require('path');

const originalBlueprintPath = path.join(__dirname, '../../..', 'attached_assets/Educare+ Ch@t_1764633105780.json');
const outputPath = path.join(__dirname, '..', 'n8n-educare-integrated.json');

const originalBlueprint = JSON.parse(fs.readFileSync(originalBlueprintPath, 'utf8'));

const educareApiNodes = [
  {
    "parameters": {
      "method": "GET",
      "url": "={{$env.EDUCARE_API_URL || 'https://educare-api.example.com/api/external'}}/users/search",
      "sendQuery": true,
      "queryParameters": {
        "parameters": [
          {
            "name": "phone",
            "value": "={{$node['Dados'].json.user}}"
          },
          {
            "name": "api_key",
            "value": "={{$env.EXTERNAL_API_KEY}}"
          }
        ]
      },
      "options": {
        "timeout": 10000,
        "response": {
          "response": {
            "neverError": true
          }
        }
      }
    },
    "id": "educare-search-user-001",
    "name": "Educare: Search User",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [800, 1600],
    "notesInFlow": true,
    "notes": "Busca usuário pelo telefone na API Externa Educare+"
  },
  {
    "parameters": {
      "conditions": {
        "options": {
          "caseSensitive": true,
          "leftValue": "",
          "typeValidation": "loose",
          "version": 2
        },
        "conditions": [
          {
            "id": "check-user-found",
            "leftValue": "={{$json.success}}",
            "rightValue": true,
            "operator": {
              "type": "boolean",
              "operation": "equals"
            }
          }
        ],
        "combinator": "and"
      },
      "options": {}
    },
    "id": "educare-check-user-002",
    "name": "Educare: User Found?",
    "type": "n8n-nodes-base.if",
    "typeVersion": 2.2,
    "position": [1000, 1600]
  },
  {
    "parameters": {
      "method": "GET",
      "url": "={{$env.EDUCARE_API_URL || 'https://educare-api.example.com/api/external'}}/users/by-phone/{{$node['Dados'].json.user}}/active-child",
      "sendHeaders": true,
      "headerParameters": {
        "parameters": [
          {
            "name": "X-API-Key",
            "value": "={{$env.EXTERNAL_API_KEY}}"
          }
        ]
      },
      "options": {
        "timeout": 10000,
        "response": {
          "response": {
            "neverError": true
          }
        }
      }
    },
    "id": "educare-get-child-003",
    "name": "Educare: Get Active Child",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [1200, 1500]
  },
  {
    "parameters": {
      "method": "GET",
      "url": "={{$env.EDUCARE_API_URL || 'https://educare-api.example.com/api/external'}}/children/{{$json.data.active_child.id}}/unanswered-questions",
      "sendQuery": true,
      "queryParameters": {
        "parameters": [
          {
            "name": "api_key",
            "value": "={{$env.EXTERNAL_API_KEY}}"
          },
          {
            "name": "limit",
            "value": "1"
          }
        ]
      },
      "options": {
        "timeout": 10000,
        "response": {
          "response": {
            "neverError": true
          }
        }
      }
    },
    "id": "educare-get-questions-004",
    "name": "Educare: Get Questions",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [1400, 1500]
  },
  {
    "parameters": {
      "jsCode": `const message = $node['Dados'].json['body.mensagem.body']?.toLowerCase().trim() || '';
const userData = $node['Educare: Search User']?.json?.data?.user || null;
const childData = $node['Educare: Get Active Child']?.json?.data?.active_child || null;
const questionsData = $node['Educare: Get Questions']?.json?.data?.questions || [];

const answerMap = {
  '1': 0, 'um': 0, 'nao': 0, 'não': 0, 'nunca': 0, 'raramente': 0,
  '2': 1, 'dois': 1, 'as vezes': 1, 'às vezes': 1, 'parcialmente': 1,
  '3': 2, 'tres': 2, 'três': 2, 'sim': 2, 'sempre': 2, 'frequentemente': 2
};

const greetings = ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'começar', 'iniciar', 'oi titi'];
const helpWords = ['ajuda', 'help', 'como', 'duvida', 'dúvida'];
const progressWords = ['progresso', 'quanto falta', 'status', 'avanço'];

let type = 'chat';
let answerValue = null;

if (answerMap.hasOwnProperty(message)) {
  type = 'answer';
  answerValue = answerMap[message];
} else if (greetings.some(g => message.includes(g))) {
  type = 'greeting';
} else if (helpWords.some(h => message.includes(h))) {
  type = 'help';
} else if (progressWords.some(p => message.includes(p))) {
  type = 'progress';
}

return {
  messageType: type,
  answerValue: answerValue,
  originalMessage: message,
  hasUser: !!userData,
  hasChild: !!childData,
  hasQuestions: questionsData.length > 0,
  currentQuestion: questionsData[0] || null,
  childId: childData?.id,
  childName: childData?.name,
  childAge: childData?.age_months,
  userPhone: $node['Dados'].json.user
};`
    },
    "id": "educare-parse-message-005",
    "name": "Educare: Parse Message",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [1600, 1500]
  },
  {
    "parameters": {
      "rules": {
        "values": [
          {
            "conditions": {
              "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 1 },
              "conditions": [{ "leftValue": "={{$json.messageType}}", "rightValue": "answer", "operator": { "type": "string", "operation": "equals" } }],
              "combinator": "and"
            },
            "renameOutput": true,
            "outputKey": "answer"
          },
          {
            "conditions": {
              "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 1 },
              "conditions": [{ "leftValue": "={{$json.messageType}}", "rightValue": "greeting", "operator": { "type": "string", "operation": "equals" } }],
              "combinator": "and"
            },
            "renameOutput": true,
            "outputKey": "greeting"
          },
          {
            "conditions": {
              "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 1 },
              "conditions": [{ "leftValue": "={{$json.messageType}}", "rightValue": "progress", "operator": { "type": "string", "operation": "equals" } }],
              "combinator": "and"
            },
            "renameOutput": true,
            "outputKey": "progress"
          },
          {
            "conditions": {
              "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 1 },
              "conditions": [{ "leftValue": "={{$json.messageType}}", "rightValue": "help", "operator": { "type": "string", "operation": "equals" } }],
              "combinator": "and"
            },
            "renameOutput": true,
            "outputKey": "help"
          }
        ]
      },
      "options": { "fallbackOutput": "extra" }
    },
    "id": "educare-route-006",
    "name": "Educare: Route Message",
    "type": "n8n-nodes-base.switch",
    "typeVersion": 3,
    "position": [1800, 1500]
  },
  {
    "parameters": {
      "method": "POST",
      "url": "={{$env.EDUCARE_API_URL || 'https://educare-api.example.com/api/external'}}/children/{{$node['Educare: Parse Message'].json.childId}}/save-answer",
      "sendHeaders": true,
      "headerParameters": {
        "parameters": [
          { "name": "Content-Type", "value": "application/json" },
          { "name": "X-API-Key", "value": "={{$env.EXTERNAL_API_KEY}}" }
        ]
      },
      "sendBody": true,
      "specifyBody": "json",
      "jsonBody": `{
  "question_id": "{{$node['Educare: Parse Message'].json.currentQuestion.id}}",
  "answer": {{$node['Educare: Parse Message'].json.answerValue}},
  "answer_text": "{{$node['Educare: Parse Message'].json.originalMessage}}",
  "metadata": {
    "source": "whatsapp",
    "timestamp": "{{$now.toISO()}}",
    "session_id": "{{$node['Educare: Parse Message'].json.userPhone}}"
  }
}`,
      "options": { "timeout": 10000 }
    },
    "id": "educare-save-answer-007",
    "name": "Educare: Save Answer",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [2000, 1300]
  },
  {
    "parameters": {
      "method": "GET",
      "url": "={{$env.EDUCARE_API_URL || 'https://educare-api.example.com/api/external'}}/children/{{$node['Educare: Parse Message'].json.childId}}/progress",
      "sendQuery": true,
      "queryParameters": {
        "parameters": [{ "name": "api_key", "value": "={{$env.EXTERNAL_API_KEY}}" }]
      },
      "options": { "timeout": 10000 }
    },
    "id": "educare-get-progress-008",
    "name": "Educare: Get Progress",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "position": [2200, 1300]
  },
  {
    "parameters": {
      "jsCode": `const childName = $node['Educare: Parse Message'].json.childName || 'seu filho';
const progress = $json.data?.progress || {};
const question = $node['Educare: Parse Message'].json.currentQuestion;
const answerValue = $node['Educare: Parse Message'].json.answerValue;

const feedbackMap = {
  0: question?.domain_feedback_1 || 'Obrigada pela sua resposta.',
  1: question?.domain_feedback_2 || 'Obrigada pela sua resposta.',
  2: question?.domain_feedback_3 || 'Que ótimo! Obrigada pela sua resposta.'
};

const feedback = feedbackMap[answerValue] || 'Obrigada pela resposta!';

let msg = '✨ ' + feedback + '\\n\\n';
msg += '📊 Progresso de ' + childName + ': ' + (progress.progress_percentage || 0) + '%\\n';

if (progress.unanswered_questions > 0) {
  msg += '📝 Perguntas restantes: ' + progress.unanswered_questions + '\\n\\n';
  msg += 'Envie *oi* para a próxima pergunta! 💜';
} else {
  msg += '\\n🎉 Parabéns! Você completou todas as perguntas desta fase!';
}

return { message: msg, sessionId: $node['Dados'].json.user };`
    },
    "id": "educare-format-answer-009",
    "name": "Educare: Format Answer",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [2400, 1300]
  },
  {
    "parameters": {
      "jsCode": `const childName = $node['Educare: Parse Message'].json.childName || 'seu bebê';
const hasQuestions = $node['Educare: Parse Message'].json.hasQuestions;
const question = $node['Educare: Parse Message'].json.currentQuestion;

let msg = 'Olá! 👋 Eu sou a TitiNauta, sua assistente para acompanhar o desenvolvimento de ' + childName + '!\\n\\n';

if (hasQuestions && question) {
  msg += 'Vamos continuar nossa jornada? 🚀\\n\\n';
  msg += 'Responda com:\\n';
  msg += '1️⃣ - Não/Raramente\\n';
  msg += '2️⃣ - Às vezes\\n';
  msg += '3️⃣ - Sim/Frequentemente\\n\\n';
  msg += '📝 *Pergunta:*\\n' + question.domain_question;
} else {
  msg += '🎉 Parabéns! Você já respondeu todas as perguntas disponíveis!\\n\\n';
  msg += 'Continue acompanhando o desenvolvimento de ' + childName + ' no app Educare+.';
}

return { message: msg, sessionId: $node['Dados'].json.user };`
    },
    "id": "educare-format-greeting-010",
    "name": "Educare: Format Greeting",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [2000, 1500]
  },
  {
    "parameters": {
      "jsCode": `const childName = $node['Educare: Parse Message'].json.childName || 'seu filho';

let msg = '👋 Olá! Precisa de ajuda?\\n\\n';
msg += 'Aqui estão suas opções:\\n\\n';
msg += '📝 *Responder perguntas:* Envie 1, 2 ou 3\\n';
msg += '  • 1 = Não/Raramente\\n';
msg += '  • 2 = Às vezes\\n';
msg += '  • 3 = Sim/Frequentemente\\n\\n';
msg += '🏠 *Ver próxima pergunta:* Envie "oi"\\n';
msg += '📊 *Ver progresso:* Envie "progresso"\\n\\n';
msg += 'Estou aqui para ajudar você a acompanhar o desenvolvimento de ' + childName + '! 💜';

return { message: msg, sessionId: $node['Dados'].json.user };`
    },
    "id": "educare-format-help-011",
    "name": "Educare: Format Help",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [2000, 1700]
  },
  {
    "parameters": {
      "jsCode": `let msg = 'Olá! 👋\\n\\n';
msg += 'Não encontrei seu cadastro no Educare+.\\n\\n';
msg += 'Para começar sua jornada de acompanhamento do desenvolvimento infantil, acesse:\\n';
msg += '🔗 https://educareapp.com/register\\n\\n';
msg += 'Use este mesmo número de telefone para se cadastrar! 📱\\n\\n';
msg += 'Após o cadastro, envie "oi" para começarmos! 💜';

return { message: msg, sessionId: $node['Dados'].json.user };`
    },
    "id": "educare-not-found-012",
    "name": "Educare: User Not Found",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [1200, 1700]
  }
];

const educareConnections = {
  "Educare: Search User": {
    "main": [[{ "node": "Educare: User Found?", "type": "main", "index": 0 }]]
  },
  "Educare: User Found?": {
    "main": [
      [{ "node": "Educare: Get Active Child", "type": "main", "index": 0 }],
      [{ "node": "Educare: User Not Found", "type": "main", "index": 0 }]
    ]
  },
  "Educare: Get Active Child": {
    "main": [[{ "node": "Educare: Get Questions", "type": "main", "index": 0 }]]
  },
  "Educare: Get Questions": {
    "main": [[{ "node": "Educare: Parse Message", "type": "main", "index": 0 }]]
  },
  "Educare: Parse Message": {
    "main": [[{ "node": "Educare: Route Message", "type": "main", "index": 0 }]]
  },
  "Educare: Route Message": {
    "main": [
      [{ "node": "Educare: Save Answer", "type": "main", "index": 0 }],
      [{ "node": "Educare: Format Greeting", "type": "main", "index": 0 }],
      [{ "node": "Educare: Get Progress", "type": "main", "index": 0 }],
      [{ "node": "Educare: Format Help", "type": "main", "index": 0 }],
      [{ "node": "AI Agent1", "type": "main", "index": 0 }]
    ]
  },
  "Educare: Save Answer": {
    "main": [[{ "node": "Educare: Get Progress", "type": "main", "index": 0 }]]
  },
  "Educare: Get Progress": {
    "main": [[{ "node": "Educare: Format Answer", "type": "main", "index": 0 }]]
  }
};

originalBlueprint.nodes = [...originalBlueprint.nodes, ...educareApiNodes];

originalBlueprint.connections = { ...originalBlueprint.connections, ...educareConnections };

originalBlueprint.name = "Educare+ TitiNauta Integrated";
originalBlueprint.meta = {
  ...originalBlueprint.meta,
  description: "Blueprint integrado com API Externa Educare+ para WhatsApp via Evolution API",
  updatedAt: new Date().toISOString()
};

fs.writeFileSync(outputPath, JSON.stringify(originalBlueprint, null, 2), 'utf8');

console.log('✅ Blueprint integrado criado com sucesso!');
console.log(`📁 Arquivo: ${outputPath}`);
console.log(`📊 Total de nós: ${originalBlueprint.nodes.length}`);
