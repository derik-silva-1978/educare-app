/**
 * Seed Data: Marcos Oficiais do Desenvolvimento Infantil
 * Baseado na Caderneta da Criança do Ministério da Saúde (Brasil)
 * Faixa: 0-60 meses (0-5 anos)
 * Inclui descrições clínicas para orientar curadores
 */

const officialMilestonesData = [
  // === MOTOR - 0 a 12 meses ===
  { 
    title: 'Movimenta os membros de forma assimétrica', 
    description: 'O recém-nascido apresenta movimentos espontâneos e descoordenados dos braços e pernas, típicos do período neonatal. Os reflexos primitivos ainda estão presentes.',
    category: 'motor', 
    target_month: 0, 
    min_month: 0, 
    max_month: 1, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Ergue a cabeça quando deitado de bruços', 
    description: 'Quando colocado de bruços (posição prona), o bebê consegue levantar brevemente a cabeça do apoio, demonstrando início do controle cervical.',
    category: 'motor', 
    target_month: 1, 
    min_month: 1, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Sustenta a cabeça', 
    description: 'Quando colocado de bruços, o bebê consegue levantar a cabeça a 45-90 graus e apoiar-se nos antebraços. Quando puxado para sentar, mantém a cabeça alinhada com o tronco.',
    category: 'motor', 
    target_month: 3, 
    min_month: 2, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Rola de barriga para baixo e vice-versa', 
    description: 'O bebê consegue virar-se sozinho de barriga para cima (supino) para barriga para baixo (prono) e vice-versa, demonstrando controle do tronco.',
    category: 'motor', 
    target_month: 4, 
    min_month: 3, 
    max_month: 6, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Senta com apoio', 
    description: 'O bebê consegue permanecer sentado quando apoiado nas mãos ou encostado em almofadas, mantendo a cabeça e tronco eretos com auxílio.',
    category: 'motor', 
    target_month: 5, 
    min_month: 4, 
    max_month: 7, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Senta sem apoio', 
    description: 'O bebê consegue sentar-se sozinho sem necessidade de apoio das mãos ou encosto, mantendo equilíbrio e postura estável por períodos prolongados.',
    category: 'motor', 
    target_month: 6, 
    min_month: 5, 
    max_month: 9, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Engatinha', 
    description: 'O bebê locomove-se apoiando-se nas mãos e joelhos, coordenando movimentos alternados de braços e pernas de forma fluida.',
    category: 'motor', 
    target_month: 8, 
    min_month: 6, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Fica de pé com apoio', 
    description: 'O bebê consegue manter-se em pé segurando-se em móveis, grades do berço ou nas mãos do cuidador, demonstrando força nas pernas.',
    category: 'motor', 
    target_month: 9, 
    min_month: 7, 
    max_month: 11, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Anda com apoio', 
    description: 'O bebê consegue dar passos laterais ou para frente segurando-se em móveis ou nas mãos do cuidador (marcha lateral ou apoiada).',
    category: 'motor', 
    target_month: 10, 
    min_month: 9, 
    max_month: 12, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Primeiros passos sem apoio', 
    description: 'A criança consegue dar os primeiros passos independentes sem segurar em nada, ainda com base alargada e alguma instabilidade.',
    category: 'motor', 
    target_month: 12, 
    min_month: 10, 
    max_month: 15, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  
  // === MOTOR - 12 a 24 meses ===
  { 
    title: 'Anda sozinho com equilíbrio', 
    description: 'A criança caminha com passos mais coordenados e seguros, com menor base de apoio e braços em posição mais natural ao lado do corpo.',
    category: 'motor', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  },
  { 
    title: 'Sobe escadas com apoio', 
    description: 'A criança consegue subir degraus segurando-se no corrimão ou na mão do adulto, colocando os dois pés em cada degrau antes de avançar.',
    category: 'motor', 
    target_month: 18, 
    min_month: 15, 
    max_month: 21, 
    source: 'caderneta_crianca_ms', 
    order_index: 12 
  },
  { 
    title: 'Corre com coordenação', 
    description: 'A criança corre de forma coordenada, com capacidade de parar, mudar de direção e desviar de obstáculos.',
    category: 'motor', 
    target_month: 24, 
    min_month: 18, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 13 
  },
  { 
    title: 'Chuta bola', 
    description: 'A criança consegue chutar uma bola para frente com um dos pés, demonstrando coordenação e equilíbrio em um pé só momentaneamente.',
    category: 'motor', 
    target_month: 24, 
    min_month: 18, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 14 
  },
  
  // === MOTOR - 24 a 60 meses ===
  { 
    title: 'Pula com os dois pés', 
    description: 'A criança consegue saltar com os dois pés juntos, saindo do chão e aterrissando de forma coordenada.',
    category: 'motor', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 15 
  },
  { 
    title: 'Sobe e desce escadas alternando os pés', 
    description: 'A criança consegue subir e descer escadas colocando um pé em cada degrau alternadamente, como um adulto, ainda podendo precisar de corrimão.',
    category: 'motor', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 16 
  },
  { 
    title: 'Anda de triciclo', 
    description: 'A criança consegue pedalar um triciclo, coordenando o movimento das pernas com a direção dos braços.',
    category: 'motor', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 17 
  },
  { 
    title: 'Pula em um pé só', 
    description: 'A criança consegue saltar apoiando-se em apenas um pé, mantendo equilíbrio por alguns saltos consecutivos.',
    category: 'motor', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 18 
  },
  { 
    title: 'Pega e arremessa bola com direção', 
    description: 'A criança consegue pegar uma bola lançada e arremessá-la de volta com alguma precisão na direção pretendida.',
    category: 'motor', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 19 
  },
  { 
    title: 'Anda de bicicleta com rodinhas', 
    description: 'A criança consegue pedalar uma bicicleta com rodinhas de apoio, mantendo direção e velocidade controladas.',
    category: 'motor', 
    target_month: 60, 
    min_month: 48, 
    max_month: 60, 
    source: 'caderneta_crianca_ms', 
    order_index: 20 
  },

  // === COGNITIVO - 0 a 12 meses ===
  { 
    title: 'Fixa o olhar em rostos', 
    description: 'O bebê demonstra preferência visual por rostos humanos, fixando o olhar especialmente nos olhos e boca do cuidador.',
    category: 'cognitivo', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Acompanha objetos com os olhos', 
    description: 'O bebê consegue seguir visualmente um objeto colorido ou em movimento, girando a cabeça para acompanhá-lo.',
    category: 'cognitivo', 
    target_month: 2, 
    min_month: 1, 
    max_month: 3, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Reconhece rostos familiares', 
    description: 'O bebê demonstra reconhecer rostos de pessoas próximas, reagindo de forma diferente a familiares e estranhos.',
    category: 'cognitivo', 
    target_month: 3, 
    min_month: 2, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Busca objetos parcialmente escondidos', 
    description: 'O bebê procura por um brinquedo que foi parcialmente coberto por um pano, demonstrando início da noção de permanência do objeto.',
    category: 'cognitivo', 
    target_month: 6, 
    min_month: 5, 
    max_month: 8, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Permanência do objeto (busca objetos escondidos)', 
    description: 'O bebê procura ativamente por um objeto que foi completamente escondido, compreendendo que ele continua existindo mesmo sem vê-lo.',
    category: 'cognitivo', 
    target_month: 9, 
    min_month: 8, 
    max_month: 12, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Usa objetos funcionalmente (colher, copo)', 
    description: 'O bebê demonstra compreender a função dos objetos, usando-os de forma apropriada, como levar a colher à boca ou beber do copo.',
    category: 'cognitivo', 
    target_month: 12, 
    min_month: 10, 
    max_month: 15, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  
  // === COGNITIVO - 12 a 60 meses ===
  { 
    title: 'Empilha 2-3 blocos', 
    description: 'A criança consegue empilhar de 2 a 3 blocos ou cubos, demonstrando coordenação motora fina e compreensão de relações espaciais.',
    category: 'cognitivo', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Identifica partes do corpo', 
    description: 'A criança consegue apontar ou nomear partes do corpo quando solicitada (olhos, nariz, boca, mãos, pés).',
    category: 'cognitivo', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Faz rabiscos espontâneos', 
    description: 'A criança rabisca espontaneamente com giz de cera ou lápis, fazendo marcas no papel de forma intencional.',
    category: 'cognitivo', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Empilha 6 ou mais blocos', 
    description: 'A criança consegue empilhar 6 ou mais blocos em uma torre, demonstrando melhor coordenação e planejamento motor.',
    category: 'cognitivo', 
    target_month: 24, 
    min_month: 20, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Nomeia cores básicas', 
    description: 'A criança consegue identificar e nomear cores básicas como vermelho, azul, amarelo e verde.',
    category: 'cognitivo', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  },
  { 
    title: 'Conta até 10', 
    description: 'A criança consegue contar verbalmente de 1 a 10 na sequência correta e pode associar números a quantidades pequenas.',
    category: 'cognitivo', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 12 
  },
  { 
    title: 'Reconhece letras e números', 
    description: 'A criança consegue identificar e nomear algumas letras do alfabeto e números, especialmente os do próprio nome.',
    category: 'cognitivo', 
    target_month: 60, 
    min_month: 48, 
    max_month: 60, 
    source: 'caderneta_crianca_ms', 
    order_index: 13 
  },

  // === LINGUAGEM - 0 a 12 meses ===
  { 
    title: 'Reage a sons', 
    description: 'O bebê demonstra resposta a sons como vozes, músicas ou barulhos, podendo se assustar, acalmar-se ou virar-se na direção do som.',
    category: 'linguagem', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Emite sons (gugu, gaga)', 
    description: 'O bebê produz vocalizações como "gugu", "agá", explorando sons com a voz de forma prazerosa.',
    category: 'linguagem', 
    target_month: 2, 
    min_month: 1, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Vira-se na direção de sons', 
    description: 'O bebê localiza a fonte sonora virando a cabeça na direção de vozes ou sons, demonstrando audição funcional.',
    category: 'linguagem', 
    target_month: 4, 
    min_month: 3, 
    max_month: 6, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Balbucia (mama, papa sem significado)', 
    description: 'O bebê produz sequências de sílabas repetidas como "mama", "papa", "dada", ainda sem atribuir significado específico.',
    category: 'linguagem', 
    target_month: 6, 
    min_month: 5, 
    max_month: 9, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Responde ao próprio nome', 
    description: 'O bebê demonstra reconhecer seu nome, virando-se ou reagindo quando chamado.',
    category: 'linguagem', 
    target_month: 8, 
    min_month: 6, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Fala primeira palavra com significado', 
    description: 'O bebê usa sua primeira palavra de forma consistente e com significado, como "mamã" para a mãe ou "au-au" para cachorro.',
    category: 'linguagem', 
    target_month: 12, 
    min_month: 10, 
    max_month: 15, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  
  // === LINGUAGEM - 12 a 60 meses ===
  { 
    title: 'Vocabulário de 3-6 palavras', 
    description: 'A criança usa de 3 a 6 palavras com significado, além de "mamã" e "papá", para se comunicar.',
    category: 'linguagem', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Aponta para objetos desejados', 
    description: 'A criança usa o gesto de apontar para indicar o que deseja ou para mostrar algo de interesse, combinando com vocalizações.',
    category: 'linguagem', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Combina duas palavras', 
    description: 'A criança forma pequenas frases de duas palavras como "qué água", "mamã dá", demonstrando início da sintaxe.',
    category: 'linguagem', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Vocabulário de 50+ palavras', 
    description: 'A criança possui vocabulário expressivo de mais de 50 palavras e compreende muito mais do que consegue falar.',
    category: 'linguagem', 
    target_month: 24, 
    min_month: 18, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Forma frases de 3-4 palavras', 
    description: 'A criança constrói frases mais complexas com 3 a 4 palavras, expressando ideias e necessidades de forma mais clara.',
    category: 'linguagem', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  },
  { 
    title: 'Fala compreensível para estranhos', 
    description: 'A maior parte da fala da criança (75% ou mais) pode ser compreendida por pessoas que não convivem com ela.',
    category: 'linguagem', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 12 
  },
  { 
    title: 'Conta histórias simples', 
    description: 'A criança consegue narrar eventos do dia-a-dia ou recontar histórias simples com sequência lógica de início, meio e fim.',
    category: 'linguagem', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 13 
  },
  { 
    title: 'Fala com gramática correta', 
    description: 'A criança utiliza estruturas gramaticais corretas na maior parte das frases, incluindo conjugação verbal e concordância.',
    category: 'linguagem', 
    target_month: 60, 
    min_month: 48, 
    max_month: 60, 
    source: 'caderneta_crianca_ms', 
    order_index: 14 
  },

  // === SOCIAL - 0 a 12 meses ===
  { 
    title: 'Sorri em resposta (sorriso social)', 
    description: 'O bebê responde com um sorriso quando alguém sorri para ele ou fala de forma carinhosa, demonstrando interação social.',
    category: 'social', 
    target_month: 2, 
    min_month: 1, 
    max_month: 3, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Ri alto', 
    description: 'O bebê ri de forma audível e expressiva em resposta a brincadeiras, cócegas ou interações prazerosas.',
    category: 'social', 
    target_month: 4, 
    min_month: 3, 
    max_month: 5, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Distingue familiares de estranhos', 
    description: 'O bebê demonstra comportamentos diferentes com pessoas conhecidas e desconhecidas, podendo estranhar ou mostrar preferência.',
    category: 'social', 
    target_month: 6, 
    min_month: 5, 
    max_month: 8, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Brinca de esconde-esconde', 
    description: 'O bebê participa ativamente de brincadeiras de esconder o rosto, demonstrando alegria e antecipação.',
    category: 'social', 
    target_month: 8, 
    min_month: 7, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Dá tchau', 
    description: 'O bebê acena com a mão em resposta a "tchau" ou quando alguém se despede, demonstrando compreensão de gestos sociais.',
    category: 'social', 
    target_month: 10, 
    min_month: 8, 
    max_month: 12, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  
  // === SOCIAL - 12 a 60 meses ===
  { 
    title: 'Imita atividades domésticas', 
    description: 'A criança imita ações do cotidiano como varrer, falar ao telefone ou cuidar de bonecas, demonstrando aprendizado por observação.',
    category: 'social', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Brinca perto de outras crianças', 
    description: 'A criança brinca ao lado de outras crianças (jogo paralelo), ainda sem interagir diretamente, mas demonstrando interesse.',
    category: 'social', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Brinca junto com outras crianças', 
    description: 'A criança começa a interagir diretamente com outras crianças em brincadeiras, compartilhando brinquedos e atividades.',
    category: 'social', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Faz amizades', 
    description: 'A criança demonstra preferência por determinados colegas, buscando brincar com eles e desenvolvendo vínculos de amizade.',
    category: 'social', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Segue regras de jogos', 
    description: 'A criança compreende e segue regras simples de jogos e brincadeiras em grupo, aguardando sua vez.',
    category: 'social', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Coopera em atividades em grupo', 
    description: 'A criança participa de atividades cooperativas, trabalhando em conjunto com outras crianças para um objetivo comum.',
    category: 'social', 
    target_month: 60, 
    min_month: 48, 
    max_month: 60, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  },

  // === EMOCIONAL - 0 a 12 meses ===
  { 
    title: 'Demonstra conforto quando acolhido', 
    description: 'O bebê acalma-se quando pego no colo, embalado ou ouvindo a voz do cuidador, demonstrando vínculo e regulação emocional.',
    category: 'emocional', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Expressa alegria', 
    description: 'O bebê demonstra alegria de forma clara através de sorrisos, gargalhadas e movimentos corporais animados.',
    category: 'emocional', 
    target_month: 3, 
    min_month: 2, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Demonstra ansiedade com estranhos', 
    description: 'O bebê mostra desconforto ou choro na presença de pessoas desconhecidas, demonstrando discriminação social e apego.',
    category: 'emocional', 
    target_month: 8, 
    min_month: 6, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Mostra preferência por cuidador principal', 
    description: 'O bebê demonstra clara preferência pelo cuidador principal, buscando-o em momentos de estresse ou para conforto.',
    category: 'emocional', 
    target_month: 9, 
    min_month: 7, 
    max_month: 12, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  
  // === EMOCIONAL - 12 a 60 meses ===
  { 
    title: 'Demonstra frustração', 
    description: 'A criança expressa frustração através de birras ou choro quando não consegue o que deseja, fase normal do desenvolvimento.',
    category: 'emocional', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Fase do "não" (oposição)', 
    description: 'A criança usa frequentemente a palavra "não" e demonstra comportamento opositor, parte normal do desenvolvimento da autonomia.',
    category: 'emocional', 
    target_month: 24, 
    min_month: 18, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Expressa vergonha e orgulho', 
    description: 'A criança demonstra emoções autoconscientes como vergonha quando erra e orgulho quando consegue realizar algo.',
    category: 'emocional', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Nomeia emoções básicas', 
    description: 'A criança consegue identificar e nomear emoções básicas como feliz, triste, com raiva, com medo, em si e nos outros.',
    category: 'emocional', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Regula emoções com ajuda do adulto', 
    description: 'A criança começa a conseguir acalmar-se com orientação verbal do adulto, usando estratégias como respirar fundo.',
    category: 'emocional', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Demonstra empatia', 
    description: 'A criança mostra preocupação genuína com os sentimentos dos outros e tenta confortar quem está triste ou machucado.',
    category: 'emocional', 
    target_month: 60, 
    min_month: 48, 
    max_month: 60, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },

  // === SENSORIAL - 0 a 12 meses ===
  { 
    title: 'Foca a visão em objetos próximos', 
    description: 'O bebê consegue fixar o olhar em objetos ou rostos a uma distância de 20-30 cm, demonstrando acuidade visual básica.',
    category: 'sensorial', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Segue objetos com os olhos', 
    description: 'O bebê acompanha visualmente um objeto em movimento horizontal e vertical, demonstrando coordenação oculomotora.',
    category: 'sensorial', 
    target_month: 2, 
    min_month: 1, 
    max_month: 3, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Leva objetos à boca para explorar', 
    description: 'O bebê explora objetos levando-os à boca, usando os lábios e língua como fonte de informação tátil.',
    category: 'sensorial', 
    target_month: 4, 
    min_month: 3, 
    max_month: 6, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Transfere objetos entre as mãos', 
    description: 'O bebê consegue passar um objeto de uma mão para outra, demonstrando coordenação bilateral e controle motor fino.',
    category: 'sensorial', 
    target_month: 6, 
    min_month: 5, 
    max_month: 8, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Usa movimento de pinça (polegar-indicador)', 
    description: 'O bebê pega objetos pequenos usando a ponta do polegar e do indicador (pinça superior), demonstrando motricidade fina refinada.',
    category: 'sensorial', 
    target_month: 9, 
    min_month: 8, 
    max_month: 12, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  
  // === SENSORIAL - 12 a 60 meses ===
  { 
    title: 'Vira páginas de livro (várias de uma vez)', 
    description: 'A criança consegue virar páginas de livros de papelão ou tecido, embora ainda virando várias páginas de uma vez.',
    category: 'sensorial', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Segura lápis e faz rabiscos', 
    description: 'A criança segura giz de cera ou lápis grosso e faz marcas no papel de forma intencional, usando preensão palmar.',
    category: 'sensorial', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Vira páginas uma a uma', 
    description: 'A criança consegue virar páginas de livro de papel uma de cada vez, demonstrando controle motor fino aprimorado.',
    category: 'sensorial', 
    target_month: 24, 
    min_month: 20, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Usa tesoura com supervisão', 
    description: 'A criança consegue fazer cortes simples com tesoura sem ponta, demonstrando coordenação bimanual avançada.',
    category: 'sensorial', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Desenha figuras reconhecíveis', 
    description: 'A criança desenha figuras que podem ser identificadas como pessoas, casas ou animais, com formas e detalhes básicos.',
    category: 'sensorial', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Escreve algumas letras', 
    description: 'A criança consegue reproduzir algumas letras, especialmente as do próprio nome, com preensão tripé adequada do lápis.',
    category: 'sensorial', 
    target_month: 60, 
    min_month: 48, 
    max_month: 60, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  }
];

module.exports = officialMilestonesData;
