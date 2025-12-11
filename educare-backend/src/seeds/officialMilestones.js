/**
 * Seed Data: Marcos Oficiais do Desenvolvimento Infantil
 * Baseado na Caderneta da Criança do Ministério da Saúde (Brasil)
 * Faixa: 0-60 meses (0-5 anos)
 */

const officialMilestonesData = [
  // === MOTOR - 0 a 12 meses ===
  { title: 'Movimenta os membros de forma assimétrica', category: 'motor', target_month: 0, min_month: 0, max_month: 1, source: 'caderneta_crianca_ms', order_index: 1 },
  { title: 'Ergue a cabeça quando deitado de bruços', category: 'motor', target_month: 1, min_month: 1, max_month: 2, source: 'caderneta_crianca_ms', order_index: 2 },
  { title: 'Sustenta a cabeça', category: 'motor', target_month: 3, min_month: 2, max_month: 4, source: 'caderneta_crianca_ms', order_index: 3 },
  { title: 'Rola de barriga para baixo e vice-versa', category: 'motor', target_month: 4, min_month: 3, max_month: 6, source: 'caderneta_crianca_ms', order_index: 4 },
  { title: 'Senta com apoio', category: 'motor', target_month: 5, min_month: 4, max_month: 7, source: 'caderneta_crianca_ms', order_index: 5 },
  { title: 'Senta sem apoio', category: 'motor', target_month: 6, min_month: 5, max_month: 9, source: 'caderneta_crianca_ms', order_index: 6 },
  { title: 'Engatinha', category: 'motor', target_month: 8, min_month: 6, max_month: 10, source: 'caderneta_crianca_ms', order_index: 7 },
  { title: 'Fica de pé com apoio', category: 'motor', target_month: 9, min_month: 7, max_month: 11, source: 'caderneta_crianca_ms', order_index: 8 },
  { title: 'Anda com apoio', category: 'motor', target_month: 10, min_month: 9, max_month: 12, source: 'caderneta_crianca_ms', order_index: 9 },
  { title: 'Primeiros passos sem apoio', category: 'motor', target_month: 12, min_month: 10, max_month: 15, source: 'caderneta_crianca_ms', order_index: 10 },
  
  // === MOTOR - 12 a 24 meses ===
  { title: 'Anda sozinho com equilíbrio', category: 'motor', target_month: 15, min_month: 12, max_month: 18, source: 'caderneta_crianca_ms', order_index: 11 },
  { title: 'Sobe escadas com apoio', category: 'motor', target_month: 18, min_month: 15, max_month: 21, source: 'caderneta_crianca_ms', order_index: 12 },
  { title: 'Corre com coordenação', category: 'motor', target_month: 24, min_month: 18, max_month: 30, source: 'caderneta_crianca_ms', order_index: 13 },
  { title: 'Chuta bola', category: 'motor', target_month: 24, min_month: 18, max_month: 30, source: 'caderneta_crianca_ms', order_index: 14 },
  
  // === MOTOR - 24 a 60 meses ===
  { title: 'Pula com os dois pés', category: 'motor', target_month: 30, min_month: 24, max_month: 36, source: 'caderneta_crianca_ms', order_index: 15 },
  { title: 'Sobe e desce escadas alternando os pés', category: 'motor', target_month: 36, min_month: 30, max_month: 42, source: 'caderneta_crianca_ms', order_index: 16 },
  { title: 'Anda de triciclo', category: 'motor', target_month: 36, min_month: 30, max_month: 42, source: 'caderneta_crianca_ms', order_index: 17 },
  { title: 'Pula em um pé só', category: 'motor', target_month: 48, min_month: 42, max_month: 54, source: 'caderneta_crianca_ms', order_index: 18 },
  { title: 'Pega e arremessa bola com direção', category: 'motor', target_month: 48, min_month: 42, max_month: 54, source: 'caderneta_crianca_ms', order_index: 19 },
  { title: 'Anda de bicicleta com rodinhas', category: 'motor', target_month: 60, min_month: 48, max_month: 60, source: 'caderneta_crianca_ms', order_index: 20 },

  // === COGNITIVO - 0 a 12 meses ===
  { title: 'Fixa o olhar em rostos', category: 'cognitivo', target_month: 1, min_month: 0, max_month: 2, source: 'caderneta_crianca_ms', order_index: 1 },
  { title: 'Acompanha objetos com os olhos', category: 'cognitivo', target_month: 2, min_month: 1, max_month: 3, source: 'caderneta_crianca_ms', order_index: 2 },
  { title: 'Reconhece rostos familiares', category: 'cognitivo', target_month: 3, min_month: 2, max_month: 4, source: 'caderneta_crianca_ms', order_index: 3 },
  { title: 'Busca objetos parcialmente escondidos', category: 'cognitivo', target_month: 6, min_month: 5, max_month: 8, source: 'caderneta_crianca_ms', order_index: 4 },
  { title: 'Permanência do objeto (busca objetos escondidos)', category: 'cognitivo', target_month: 9, min_month: 8, max_month: 12, source: 'caderneta_crianca_ms', order_index: 5 },
  { title: 'Usa objetos funcionalmente (colher, copo)', category: 'cognitivo', target_month: 12, min_month: 10, max_month: 15, source: 'caderneta_crianca_ms', order_index: 6 },
  
  // === COGNITIVO - 12 a 60 meses ===
  { title: 'Empilha 2-3 blocos', category: 'cognitivo', target_month: 15, min_month: 12, max_month: 18, source: 'caderneta_crianca_ms', order_index: 7 },
  { title: 'Identifica partes do corpo', category: 'cognitivo', target_month: 18, min_month: 15, max_month: 24, source: 'caderneta_crianca_ms', order_index: 8 },
  { title: 'Faz rabiscos espontâneos', category: 'cognitivo', target_month: 18, min_month: 15, max_month: 24, source: 'caderneta_crianca_ms', order_index: 9 },
  { title: 'Empilha 6 ou mais blocos', category: 'cognitivo', target_month: 24, min_month: 20, max_month: 30, source: 'caderneta_crianca_ms', order_index: 10 },
  { title: 'Nomeia cores básicas', category: 'cognitivo', target_month: 36, min_month: 30, max_month: 42, source: 'caderneta_crianca_ms', order_index: 11 },
  { title: 'Conta até 10', category: 'cognitivo', target_month: 48, min_month: 42, max_month: 54, source: 'caderneta_crianca_ms', order_index: 12 },
  { title: 'Reconhece letras e números', category: 'cognitivo', target_month: 60, min_month: 48, max_month: 60, source: 'caderneta_crianca_ms', order_index: 13 },

  // === LINGUAGEM - 0 a 12 meses ===
  { title: 'Reage a sons', category: 'linguagem', target_month: 1, min_month: 0, max_month: 2, source: 'caderneta_crianca_ms', order_index: 1 },
  { title: 'Emite sons (gugu, gaga)', category: 'linguagem', target_month: 2, min_month: 1, max_month: 4, source: 'caderneta_crianca_ms', order_index: 2 },
  { title: 'Vira-se na direção de sons', category: 'linguagem', target_month: 4, min_month: 3, max_month: 6, source: 'caderneta_crianca_ms', order_index: 3 },
  { title: 'Balbucia (mama, papa sem significado)', category: 'linguagem', target_month: 6, min_month: 5, max_month: 9, source: 'caderneta_crianca_ms', order_index: 4 },
  { title: 'Responde ao próprio nome', category: 'linguagem', target_month: 8, min_month: 6, max_month: 10, source: 'caderneta_crianca_ms', order_index: 5 },
  { title: 'Fala primeira palavra com significado', category: 'linguagem', target_month: 12, min_month: 10, max_month: 15, source: 'caderneta_crianca_ms', order_index: 6 },
  
  // === LINGUAGEM - 12 a 60 meses ===
  { title: 'Vocabulário de 3-6 palavras', category: 'linguagem', target_month: 15, min_month: 12, max_month: 18, source: 'caderneta_crianca_ms', order_index: 7 },
  { title: 'Aponta para objetos desejados', category: 'linguagem', target_month: 15, min_month: 12, max_month: 18, source: 'caderneta_crianca_ms', order_index: 8 },
  { title: 'Combina duas palavras', category: 'linguagem', target_month: 18, min_month: 15, max_month: 24, source: 'caderneta_crianca_ms', order_index: 9 },
  { title: 'Vocabulário de 50+ palavras', category: 'linguagem', target_month: 24, min_month: 18, max_month: 30, source: 'caderneta_crianca_ms', order_index: 10 },
  { title: 'Forma frases de 3-4 palavras', category: 'linguagem', target_month: 30, min_month: 24, max_month: 36, source: 'caderneta_crianca_ms', order_index: 11 },
  { title: 'Fala compreensível para estranhos', category: 'linguagem', target_month: 36, min_month: 30, max_month: 42, source: 'caderneta_crianca_ms', order_index: 12 },
  { title: 'Conta histórias simples', category: 'linguagem', target_month: 48, min_month: 42, max_month: 54, source: 'caderneta_crianca_ms', order_index: 13 },
  { title: 'Fala com gramática correta', category: 'linguagem', target_month: 60, min_month: 48, max_month: 60, source: 'caderneta_crianca_ms', order_index: 14 },

  // === SOCIAL - 0 a 12 meses ===
  { title: 'Sorri em resposta (sorriso social)', category: 'social', target_month: 2, min_month: 1, max_month: 3, source: 'caderneta_crianca_ms', order_index: 1 },
  { title: 'Ri alto', category: 'social', target_month: 4, min_month: 3, max_month: 5, source: 'caderneta_crianca_ms', order_index: 2 },
  { title: 'Distingue familiares de estranhos', category: 'social', target_month: 6, min_month: 5, max_month: 8, source: 'caderneta_crianca_ms', order_index: 3 },
  { title: 'Brinca de esconde-esconde', category: 'social', target_month: 8, min_month: 7, max_month: 10, source: 'caderneta_crianca_ms', order_index: 4 },
  { title: 'Dá tchau', category: 'social', target_month: 10, min_month: 8, max_month: 12, source: 'caderneta_crianca_ms', order_index: 5 },
  
  // === SOCIAL - 12 a 60 meses ===
  { title: 'Imita atividades domésticas', category: 'social', target_month: 15, min_month: 12, max_month: 18, source: 'caderneta_crianca_ms', order_index: 6 },
  { title: 'Brinca perto de outras crianças', category: 'social', target_month: 18, min_month: 15, max_month: 24, source: 'caderneta_crianca_ms', order_index: 7 },
  { title: 'Brinca junto com outras crianças', category: 'social', target_month: 30, min_month: 24, max_month: 36, source: 'caderneta_crianca_ms', order_index: 8 },
  { title: 'Faz amizades', category: 'social', target_month: 36, min_month: 30, max_month: 42, source: 'caderneta_crianca_ms', order_index: 9 },
  { title: 'Segue regras de jogos', category: 'social', target_month: 48, min_month: 42, max_month: 54, source: 'caderneta_crianca_ms', order_index: 10 },
  { title: 'Coopera em atividades em grupo', category: 'social', target_month: 60, min_month: 48, max_month: 60, source: 'caderneta_crianca_ms', order_index: 11 },

  // === EMOCIONAL - 0 a 12 meses ===
  { title: 'Demonstra conforto quando acolhido', category: 'emocional', target_month: 1, min_month: 0, max_month: 2, source: 'caderneta_crianca_ms', order_index: 1 },
  { title: 'Expressa alegria', category: 'emocional', target_month: 3, min_month: 2, max_month: 4, source: 'caderneta_crianca_ms', order_index: 2 },
  { title: 'Demonstra ansiedade com estranhos', category: 'emocional', target_month: 8, min_month: 6, max_month: 10, source: 'caderneta_crianca_ms', order_index: 3 },
  { title: 'Mostra preferência por cuidador principal', category: 'emocional', target_month: 9, min_month: 7, max_month: 12, source: 'caderneta_crianca_ms', order_index: 4 },
  
  // === EMOCIONAL - 12 a 60 meses ===
  { title: 'Demonstra frustração', category: 'emocional', target_month: 15, min_month: 12, max_month: 18, source: 'caderneta_crianca_ms', order_index: 5 },
  { title: 'Fase do "não" (oposição)', category: 'emocional', target_month: 24, min_month: 18, max_month: 30, source: 'caderneta_crianca_ms', order_index: 6 },
  { title: 'Expressa vergonha e orgulho', category: 'emocional', target_month: 30, min_month: 24, max_month: 36, source: 'caderneta_crianca_ms', order_index: 7 },
  { title: 'Nomeia emoções básicas', category: 'emocional', target_month: 36, min_month: 30, max_month: 42, source: 'caderneta_crianca_ms', order_index: 8 },
  { title: 'Regula emoções com ajuda do adulto', category: 'emocional', target_month: 48, min_month: 42, max_month: 54, source: 'caderneta_crianca_ms', order_index: 9 },
  { title: 'Demonstra empatia', category: 'emocional', target_month: 60, min_month: 48, max_month: 60, source: 'caderneta_crianca_ms', order_index: 10 },

  // === SENSORIAL - 0 a 12 meses ===
  { title: 'Foca a visão em objetos próximos', category: 'sensorial', target_month: 1, min_month: 0, max_month: 2, source: 'caderneta_crianca_ms', order_index: 1 },
  { title: 'Segue objetos com os olhos', category: 'sensorial', target_month: 2, min_month: 1, max_month: 3, source: 'caderneta_crianca_ms', order_index: 2 },
  { title: 'Leva objetos à boca para explorar', category: 'sensorial', target_month: 4, min_month: 3, max_month: 6, source: 'caderneta_crianca_ms', order_index: 3 },
  { title: 'Transfere objetos entre as mãos', category: 'sensorial', target_month: 6, min_month: 5, max_month: 8, source: 'caderneta_crianca_ms', order_index: 4 },
  { title: 'Usa movimento de pinça (polegar-indicador)', category: 'sensorial', target_month: 9, min_month: 8, max_month: 12, source: 'caderneta_crianca_ms', order_index: 5 },
  
  // === SENSORIAL - 12 a 60 meses ===
  { title: 'Vira páginas de livro (várias de uma vez)', category: 'sensorial', target_month: 15, min_month: 12, max_month: 18, source: 'caderneta_crianca_ms', order_index: 6 },
  { title: 'Segura lápis e faz rabiscos', category: 'sensorial', target_month: 18, min_month: 15, max_month: 24, source: 'caderneta_crianca_ms', order_index: 7 },
  { title: 'Vira páginas uma a uma', category: 'sensorial', target_month: 24, min_month: 20, max_month: 30, source: 'caderneta_crianca_ms', order_index: 8 },
  { title: 'Usa tesoura com supervisão', category: 'sensorial', target_month: 36, min_month: 30, max_month: 42, source: 'caderneta_crianca_ms', order_index: 9 },
  { title: 'Desenha figuras reconhecíveis', category: 'sensorial', target_month: 48, min_month: 42, max_month: 54, source: 'caderneta_crianca_ms', order_index: 10 },
  { title: 'Escreve algumas letras', category: 'sensorial', target_month: 60, min_month: 48, max_month: 60, source: 'caderneta_crianca_ms', order_index: 11 }
];

module.exports = officialMilestonesData;
