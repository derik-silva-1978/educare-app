const crypto = require('crypto');

const BABY_DEV_DOMAINS = {
  motor: {
    keywords: [
      'motor', 'movimento', 'andar', 'engatinhar', 'sentar', 'rolar', 'pegar',
      'segurar', 'coordenação', 'equilíbrio', 'passo', 'ficar de pé', 'erguer',
      'sustentar cabeça', 'motora', 'motricidade', 'rastejar', 'escalar',
      'motor fino', 'motor grosso', 'pinça', 'empilhar', 'encaixar',
      'caminhar', 'correr', 'pular', 'chutar', 'arremessar', 'desenhar',
      'recortar', 'abotoar', 'amarrar', 'escrever', 'manipular'
    ],
    weight: 1.0
  },
  cognitivo: {
    keywords: [
      'cognitivo', 'pensar', 'aprender', 'resolver', 'problema', 'explorar',
      'descobrir', 'curiosidade', 'memória', 'atenção', 'concentração',
      'causa e efeito', 'permanência do objeto', 'classificar', 'ordenar',
      'contar', 'número', 'forma', 'cor', 'tamanho', 'comparar',
      'raciocínio', 'lógica', 'imaginação', 'criatividade', 'brincar de faz de conta',
      'encaixe', 'quebra-cabeça', 'cognição', 'inteligência', 'compreensão'
    ],
    weight: 1.0
  },
  linguagem: {
    keywords: [
      'linguagem', 'falar', 'palavra', 'frase', 'comunicar', 'comunicação',
      'balbuciar', 'balbucio', 'gesto', 'apontar', 'nomear', 'vocabulário',
      'contar história', 'conversar', 'ouvir', 'escutar', 'compreender',
      'expressar', 'cantar', 'rima', 'livro', 'leitura', 'ler',
      'língua', 'som', 'sílaba', 'fonema', 'articulação', 'pronúncia',
      'narrativa', 'diálogo', 'pergunta', 'resposta verbal'
    ],
    weight: 1.0
  },
  social: {
    keywords: [
      'social', 'interação', 'brincar junto', 'compartilhar', 'dividir',
      'amizade', 'colega', 'grupo', 'cooperar', 'cooperação', 'turno',
      'esperar a vez', 'regra', 'convivência', 'socialização', 'outro',
      'pessoas', 'sorriso social', 'estranho', 'adaptação', 'creche',
      'escola', 'família', 'irmão', 'relacionamento', 'vínculo',
      'brincadeira coletiva', 'jogo simbólico', 'papel social'
    ],
    weight: 1.0
  },
  emocional: {
    keywords: [
      'emocional', 'emoção', 'sentimento', 'chorar', 'rir', 'medo',
      'raiva', 'alegria', 'tristeza', 'frustração', 'ansiedade',
      'autoestima', 'confiança', 'segurança', 'apego', 'separação',
      'autorregulação', 'regulação emocional', 'birra', 'pirraça',
      'temperamento', 'humor', 'empatia', 'consolar', 'acalmar',
      'resiliência', 'autonomia emocional', 'expressar sentimentos',
      'reconhecer emoções', 'lidar com frustração'
    ],
    weight: 1.0
  },
  sensorial: {
    keywords: [
      'sensorial', 'sentido', 'tato', 'visão', 'audição', 'olfato',
      'paladar', 'textura', 'som', 'luz', 'cor', 'cheiro', 'sabor',
      'propriocepção', 'vestibular', 'estimulação sensorial', 'exploração',
      'tocar', 'olhar', 'ouvir', 'experimentar', 'sensação',
      'percepção', 'reflexo', 'estímulo', 'resposta sensorial',
      'sensibilidade', 'integração sensorial', 'coordenação visomotora'
    ],
    weight: 1.0
  }
};

const MOTHER_DEV_DOMAINS = {
  nutricao: {
    keywords: [
      'nutrição', 'alimentação', 'dieta', 'comer', 'refeição', 'alimento',
      'vitamina', 'mineral', 'ferro', 'cálcio', 'ácido fólico', 'proteína',
      'carboidrato', 'gordura', 'fibra', 'hidratação', 'água', 'peso',
      'emagrecer', 'engordar', 'IMC', 'caloria', 'nutriente',
      'suplemento', 'suplementação', 'alimentar', 'comida', 'prato',
      'receita', 'cozinhar', 'preparo', 'restrição alimentar', 'intolerância',
      'alergia alimentar', 'glúten', 'lactose', 'vegetariana', 'vegana'
    ],
    weight: 1.0
  },
  saude_mental: {
    keywords: [
      'saúde mental', 'depressão', 'ansiedade', 'estresse', 'angústia',
      'tristeza', 'choro', 'humor', 'irritabilidade', 'insônia',
      'baby blues', 'depressão pós-parto', 'psicose', 'pânico',
      'terapia', 'psicólogo', 'psiquiatra', 'medicação', 'antidepressivo',
      'autoestima', 'identidade', 'maternidade', 'culpa', 'solidão',
      'isolamento', 'rede de apoio', 'relação conjugal', 'sexualidade',
      'vínculo mãe-bebê', 'mindfulness', 'meditação', 'relaxamento',
      'bem-estar emocional', 'saúde emocional', 'equilíbrio emocional'
    ],
    weight: 1.0
  },
  recuperacao: {
    keywords: [
      'recuperação', 'pós-parto', 'puerpério', 'cesárea', 'cicatriz',
      'ponto', 'sangramento', 'lóquios', 'útero', 'involução uterina',
      'diástase', 'abdômen', 'assoalho pélvico', 'períneo', 'episiotomia',
      'fisioterapia', 'reabilitação', 'dor', 'desconforto', 'inflamação',
      'infecção', 'febre', 'complicação', 'emergência', 'hospital',
      'consulta pós-parto', 'revisão', 'cicatrização', 'cuidado pós-parto',
      'recuperação física', 'corpo pós-parto', 'hormônios'
    ],
    weight: 1.0
  },
  amamentacao: {
    keywords: [
      'amamentação', 'amamentar', 'leite materno', 'mama', 'peito',
      'seio', 'mamilo', 'bico', 'pega', 'sucção', 'lactação',
      'produção de leite', 'livre demanda', 'ordenha', 'bomba',
      'armazenamento', 'congelamento', 'descongelamento', 'bico de silicone',
      'complemento', 'fórmula', 'mamadeira', 'copo', 'colher',
      'desmame', 'introdução alimentar', 'mastite', 'ingurgitamento',
      'fissura', 'candidíase', 'dor ao amamentar', 'posição',
      'banco de leite', 'doação de leite', 'relactação', 'lactante'
    ],
    weight: 1.0
  },
  saude_fisica: {
    keywords: [
      'saúde física', 'exercício', 'atividade física', 'ginástica',
      'caminhada', 'yoga', 'pilates', 'alongamento', 'musculação',
      'postura', 'coluna', 'lombar', 'dor nas costas', 'articulação',
      'pressão arterial', 'hipertensão', 'diabetes gestacional',
      'tireoide', 'anemia', 'exame', 'ultrassom', 'hemograma',
      'vacina', 'imunização', 'contraceptivo', 'anticoncepcional',
      'menstruação', 'ciclo menstrual', 'retorno da menstruação',
      'queda de cabelo', 'pele', 'estria', 'varizes', 'hemorroidas'
    ],
    weight: 1.0
  },
  autocuidado: {
    keywords: [
      'autocuidado', 'cuidar de si', 'tempo para si', 'descanso',
      'sono', 'dormir', 'rotina', 'organização', 'planejamento',
      'lazer', 'hobby', 'prazer', 'beleza', 'vaidade', 'cabelo',
      'maquiagem', 'roupa', 'autoconhecimento', 'limites', 'dizer não',
      'rede de apoio', 'pedir ajuda', 'delegar', 'parceiro', 'família',
      'trabalho', 'carreira', 'retorno ao trabalho', 'licença maternidade',
      'equilíbrio', 'qualidade de vida', 'bem-estar', 'autocuidado materno',
      'ritual', 'momento para mãe', 'pausa', 'respiro'
    ],
    weight: 1.0
  }
};

const BABY_DOMAIN_VALUES = Object.keys(BABY_DEV_DOMAINS);
const MOTHER_DOMAIN_VALUES = Object.keys(MOTHER_DEV_DOMAINS);

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\sáàãâéêíóôõúü]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyByRules(text, trail) {
  if (!text || !trail) return { domain: null, confidence: 0, source: 'rule' };

  const normalized = normalizeText(text);
  const domains = trail === 'baby' ? BABY_DEV_DOMAINS : MOTHER_DEV_DOMAINS;
  const scores = {};

  for (const [domain, config] of Object.entries(domains)) {
    let score = 0;
    for (const keyword of config.keywords) {
      const normalizedKeyword = normalizeText(keyword);
      if (normalized.includes(normalizedKeyword)) {
        score += config.weight;
      }
    }
    scores[domain] = score;
  }

  const entries = Object.entries(scores).filter(([, s]) => s > 0);
  if (entries.length === 0) {
    return { domain: null, confidence: 0, source: 'rule' };
  }

  entries.sort((a, b) => b[1] - a[1]);
  const [topDomain, topScore] = entries[0];
  const secondScore = entries.length > 1 ? entries[1][1] : 0;

  const totalKeywords = domains[topDomain].keywords.length;
  const rawConfidence = Math.min(topScore / Math.max(totalKeywords * 0.15, 1), 1.0);
  const ambiguityPenalty = secondScore > 0 ? (1 - (secondScore / topScore)) * 0.3 : 0.3;
  const confidence = Math.min(Math.round((rawConfidence + ambiguityPenalty) * 100) / 100, 1.0);

  return {
    domain: topDomain,
    confidence,
    source: 'rule',
    scores
  };
}

function classifyQuiz(quiz, trail) {
  const textParts = [
    quiz.title || '',
    quiz.question || '',
    Array.isArray(quiz.options)
      ? quiz.options.map(o => typeof o === 'string' ? o : (o.text || o.label || '')).join(' ')
      : '',
    quiz.feedback ? (typeof quiz.feedback === 'string' ? quiz.feedback : JSON.stringify(quiz.feedback)) : '',
    quiz.knowledge ? (typeof quiz.knowledge === 'string' ? quiz.knowledge : JSON.stringify(quiz.knowledge)) : ''
  ];

  const fullText = textParts.join(' ');
  return classifyByRules(fullText, trail);
}

function classifyTopic(topic, trail) {
  const textParts = [topic.title || ''];

  if (topic.content) {
    const content = typeof topic.content === 'string' ? JSON.parse(topic.content) : topic.content;
    if (content.microcard) {
      textParts.push(content.microcard.titulo || '');
      if (Array.isArray(content.microcard.itens)) {
        textParts.push(content.microcard.itens.join(' '));
      }
    }
    if (content.acaoTexto) textParts.push(content.acaoTexto);
    if (content.acaoAudio) textParts.push(content.acaoAudio);
  }

  const fullText = textParts.join(' ');
  return classifyByRules(fullText, trail);
}

function computeContentHash(content) {
  if (!content) return null;
  const normalized = typeof content === 'string' ? content : JSON.stringify(content);
  const cleanText = normalizeText(normalized);
  return crypto.createHash('sha256').update(cleanText).digest('hex');
}

function computeQuizHash(quiz) {
  const hashInput = [
    normalizeText(quiz.question || ''),
    normalizeText(quiz.title || ''),
    Array.isArray(quiz.options)
      ? quiz.options.map(o => normalizeText(typeof o === 'string' ? o : (o.text || o.label || ''))).sort().join('|')
      : ''
  ].join('::');

  return crypto.createHash('sha256').update(hashInput).digest('hex');
}

function computeTopicHash(topic) {
  const hashInput = [
    normalizeText(topic.title || ''),
    topic.content ? normalizeText(JSON.stringify(topic.content)) : ''
  ].join('::');

  return crypto.createHash('sha256').update(hashInput).digest('hex');
}

async function checkDuplicateQuiz(JourneyV2Quiz, hash, excludeId = null) {
  if (!hash) return null;
  const where = { content_hash: hash };
  if (excludeId) {
    const { Op } = require('sequelize');
    where.id = { [Op.ne]: excludeId };
  }
  return JourneyV2Quiz.findOne({ where, attributes: ['id', 'title', 'question'] });
}

async function checkDuplicateTopic(JourneyV2Topic, hash, excludeId = null) {
  if (!hash) return null;
  const where = { content_hash: hash };
  if (excludeId) {
    const { Op } = require('sequelize');
    where.id = { [Op.ne]: excludeId };
  }
  return JourneyV2Topic.findOne({ where, attributes: ['id', 'title'] });
}

module.exports = {
  BABY_DEV_DOMAINS,
  MOTHER_DEV_DOMAINS,
  BABY_DOMAIN_VALUES,
  MOTHER_DOMAIN_VALUES,
  normalizeText,
  classifyByRules,
  classifyQuiz,
  classifyTopic,
  computeContentHash,
  computeQuizHash,
  computeTopicHash,
  checkDuplicateQuiz,
  checkDuplicateTopic
};
