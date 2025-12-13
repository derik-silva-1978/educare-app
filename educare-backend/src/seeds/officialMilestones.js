/**
 * Seed Data: Marcos Oficiais do Desenvolvimento Infantil
 * Baseado na Caderneta da Criança do Ministério da Saúde (Brasil)
 * Faixa: 0-60 meses (0-5 anos)
 * Descrições estendidas (2-3 linhas) conforme expectativas do MS
 */

const officialMilestonesData = [
  // === MOTOR - 0 a 12 meses ===
  { 
    title: 'Movimenta os membros de forma assimétrica', 
    description: 'O recém-nascido apresenta movimentos espontâneos e descoordenados dos braços e pernas, típicos do período neonatal. Os reflexos primitivos ainda estão presentes e os movimentos variam entre os lados do corpo, evidenciando o desenvolvimento dos padrões neuromotores iniciais.',
    category: 'motor', 
    target_month: 0, 
    min_month: 0, 
    max_month: 1, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Ergue a cabeça quando deitado de bruços', 
    description: 'Quando colocado de bruços (posição prona), o bebê consegue levantar brevemente a cabeça do apoio. Este movimento indica o início do controle cervical necessário para os marcos posteriores de sustentação cefálica.',
    category: 'motor', 
    target_month: 1, 
    min_month: 1, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Sustenta a cabeça', 
    description: 'Quando colocado de bruços, o bebê consegue levantar a cabeça a 45-90 graus e apoiar-se nos antebraços. Quando puxado para sentar, mantém a cabeça alinhada com o tronco, demonstrando controle cervical adequado para a idade.',
    category: 'motor', 
    target_month: 3, 
    min_month: 2, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Rola de barriga para baixo e vice-versa', 
    description: 'O bebê consegue virar-se sozinho de barriga para cima (supino) para barriga para baixo (prono) e vice-versa. Este movimento coordenado demonstra controle do tronco e preparação para marcos de mobilidade futuros como engatinhar.',
    category: 'motor', 
    target_month: 4, 
    min_month: 3, 
    max_month: 6, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Senta com apoio', 
    description: 'O bebê consegue permanecer sentado quando apoiado nas mãos ou encostado em almofadas, mantendo a cabeça e tronco eretos com auxílio. O apoio é essencial para manter a postura, ainda não tendo controle postural independente.',
    category: 'motor', 
    target_month: 5, 
    min_month: 4, 
    max_month: 7, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Senta sem apoio', 
    description: 'O bebê consegue sentar-se sozinho sem necessidade de apoio das mãos ou encosto, mantendo equilíbrio e postura estável por períodos prolongados. Alcançado este marco, a criança ganha autonomia para explorar o ambiente em posição sentada.',
    category: 'motor', 
    target_month: 6, 
    min_month: 5, 
    max_month: 9, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Engatinha', 
    description: 'O bebê locomove-se apoiando-se nas mãos e joelhos, coordenando movimentos alternados de braços e pernas de forma fluida. O engatinhar é um marco importante de mobilidade que possibilita maior exploração do ambiente e desenvolvimento de força muscular.',
    category: 'motor', 
    target_month: 8, 
    min_month: 6, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Fica de pé com apoio', 
    description: 'O bebê consegue manter-se em pé segurando-se em móveis, grades do berço ou nas mãos do cuidador, demonstrando força nas pernas e preparo para os próximos marcos de locomoção independente.',
    category: 'motor', 
    target_month: 9, 
    min_month: 7, 
    max_month: 11, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Anda com apoio', 
    description: 'O bebê consegue dar passos laterais ou para frente segurando-se em móveis ou nas mãos do cuidador (marcha lateral ou apoiada). Este marco precede os primeiros passos independentes e é crítico para o desenvolvimento motor grosso.',
    category: 'motor', 
    target_month: 10, 
    min_month: 9, 
    max_month: 12, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Primeiros passos sem apoio', 
    description: 'A criança consegue dar os primeiros passos independentes sem segurar em nada, ainda com base alargada e alguma instabilidade. É um marco fundamental que marca o início da deambulação autônoma e maior exploração do ambiente.',
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
    description: 'A criança caminha com passos mais coordenados e seguros, com menor base de apoio e braços em posição mais natural ao lado do corpo. A marcha torna-se progressivamente mais eficiente e permite explorações mais autônomas do ambiente.',
    category: 'motor', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  },
  { 
    title: 'Sobe escadas com apoio', 
    description: 'A criança consegue subir degraus segurando-se no corrimão ou na mão do adulto, colocando os dois pés em cada degrau antes de avançar. Esta habilidade denota melhor força nas pernas e coordenação motora.',
    category: 'motor', 
    target_month: 18, 
    min_month: 15, 
    max_month: 21, 
    source: 'caderneta_crianca_ms', 
    order_index: 12 
  },
  { 
    title: 'Corre com coordenação', 
    description: 'A criança corre de forma coordenada, com capacidade de parar, mudar de direção e desviar de obstáculos. A corrida implica maior complexidade neuromuscular e prediz bom desenvolvimento motor grosso.',
    category: 'motor', 
    target_month: 24, 
    min_month: 18, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 13 
  },
  { 
    title: 'Chuta bola', 
    description: 'A criança consegue chutar uma bola para frente com um dos pés, demonstrando coordenação e equilíbrio dinâmico em pé só momentaneamente. Este movimento exige coordenação bilateral e força muscular aprimorada.',
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
    description: 'A criança consegue saltar com os dois pés juntos, saindo do chão e aterrissando de forma coordenada. Pular exige força, equilíbrio e coordenação complexa, indicando desenvolvimento motor grosso significativo.',
    category: 'motor', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 15 
  },
  { 
    title: 'Sobe e desce escadas alternando os pés', 
    description: 'A criança consegue subir e descer escadas colocando um pé em cada degrau alternadamente, como um adulto, ainda podendo precisar de corrimão. Este padrão alternado é mais maduro que colocar os dois pés no mesmo degrau.',
    category: 'motor', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 16 
  },
  { 
    title: 'Anda de triciclo', 
    description: 'A criança consegue pedalar um triciclo, coordenando o movimento das pernas com a direção dos braços. Esta atividade complexa combina força, coordenação bilateral e planejamento motor refinado.',
    category: 'motor', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 17 
  },
  { 
    title: 'Pula em um pé só', 
    description: 'A criança consegue saltar apoiando-se em apenas um pé, mantendo equilíbrio por alguns saltos consecutivos. Pular em um pé é um marco avançado de equilíbrio e força unilateral que prepara para atividades esportivas futuras.',
    category: 'motor', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 18 
  },
  { 
    title: 'Pega e arremessa bola com direção', 
    description: 'A criança consegue pegar uma bola lançada e arremessá-la de volta com alguma precisão na direção pretendida. Esta habilidade bilateral coordenada indica desenvolvimento neuromuscular avançado.',
    category: 'motor', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 19 
  },
  { 
    title: 'Anda de bicicleta com rodinhas', 
    description: 'A criança consegue pedalar uma bicicleta com rodinhas de apoio, mantendo direção e velocidade controladas. Este marco complexo integra múltiplas habilidades motoras e prediz boa coordenação para atividades esportivas.',
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
    description: 'O bebê demonstra preferência visual por rostos humanos, fixando o olhar especialmente nos olhos e boca do cuidador. Esta preferência inata facilita a ligação emocional e a comunicação social essencial para o desenvolvimento.',
    category: 'cognitivo', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Acompanha objetos com os olhos', 
    description: 'O bebê consegue seguir visualmente um objeto colorido ou em movimento, girando a cabeça para acompanhá-lo. Esta habilidade indica desenvolvimento visual adequado e início da atenção visual dirigida.',
    category: 'cognitivo', 
    target_month: 2, 
    min_month: 1, 
    max_month: 3, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Reconhece rostos familiares', 
    description: 'O bebê demonstra reconhecer rostos de pessoas próximas, reagindo de forma diferente a familiares e estranhos. O reconhecimento facial é fundamental para o apego seguro e desenvolvimento socioafetivo.',
    category: 'cognitivo', 
    target_month: 3, 
    min_month: 2, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Busca objetos parcialmente escondidos', 
    description: 'O bebê procura por um brinquedo que foi parcialmente coberto por um pano, demonstrando início da noção de permanência do objeto. Este marco cognitivo é crucial para o desenvolvimento da memória e representação mental.',
    category: 'cognitivo', 
    target_month: 6, 
    min_month: 5, 
    max_month: 8, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Permanência do objeto (busca objetos escondidos)', 
    description: 'O bebê procura ativamente por um objeto que foi completamente escondido, compreendendo que ele continua existindo mesmo sem vê-lo. A permanência do objeto é um marco cognitivo fundamental da teoria piagetiana do desenvolvimento.',
    category: 'cognitivo', 
    target_month: 9, 
    min_month: 8, 
    max_month: 12, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Usa objetos funcionalmente (colher, copo)', 
    description: 'O bebê demonstra compreender a função dos objetos, usando-os de forma apropriada, como levar a colher à boca ou beber do copo. O uso funcional indica compreensão causal e raciocínio elementar.',
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
    description: 'A criança consegue empilhar de 2 a 3 blocos ou cubos, demonstrando coordenação motora fina e compreensão de relações espaciais. A construção é uma atividade cognitiva que envolve planejamento e execução motora.',
    category: 'cognitivo', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Identifica partes do corpo', 
    description: 'A criança consegue apontar ou nomear partes do corpo quando solicitada (olhos, nariz, boca, mãos, pés). O reconhecimento corporal é fundamental para a autoimagem e desenvolvimento da consciência de si mesmo.',
    category: 'cognitivo', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Faz rabiscos espontâneos', 
    description: 'A criança rabisca espontaneamente com giz de cera ou lápis, fazendo marcas no papel de forma intencional. O rabisco é o primeiro passo para o desenvolvimento da escrita e expressa iniciativa criativa.',
    category: 'cognitivo', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Empilha 6 ou mais blocos', 
    description: 'A criança consegue empilhar 6 ou mais blocos em uma torre, demonstrando melhor coordenação, planejamento motor e compreensão de equilíbrio. Construções mais complexas indicam desenvolvimento cognitivo e motor avançado.',
    category: 'cognitivo', 
    target_month: 24, 
    min_month: 20, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Nomeia cores básicas', 
    description: 'A criança consegue identificar e nomear cores básicas como vermelho, azul, amarelo e verde. O reconhecimento de cores indica discriminação visual refinada e desenvolvimento da linguagem descritiva.',
    category: 'cognitivo', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  },
  { 
    title: 'Conta até 10', 
    description: 'A criança consegue contar verbalmente de 1 a 10 na sequência correta e pode associar números a quantidades pequenas. A contagem é um marco importante do desenvolvimento cognitivo que prepara para conceitos matemáticos futuros.',
    category: 'cognitivo', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 12 
  },
  { 
    title: 'Reconhece letras e números', 
    description: 'A criança consegue identificar e nomear algumas letras do alfabeto e números, especialmente os do próprio nome. O reconhecimento de símbolos é essencial para o desenvolvimento da leitura e escrita posteriores.',
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
    description: 'O bebê demonstra resposta a sons como vozes, músicas ou barulhos, podendo se assustar, acalmar-se ou virar-se na direção do som. A resposta auditiva é essencial para o desenvolvimento da audição e posterior linguagem.',
    category: 'linguagem', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Emite sons (gugu, gaga)', 
    description: 'O bebê produz vocalizações como "gugu", "agá", explorando sons com a voz de forma prazerosa. Estas vocalizações iniciais indicam desenvolvimento vocal adequado e preparação para a fala futura.',
    category: 'linguagem', 
    target_month: 2, 
    min_month: 1, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Vira-se na direção de sons', 
    description: 'O bebê localiza a fonte sonora virando a cabeça na direção de vozes ou sons, demonstrando audição funcional e atenção auditiva desenvolvida. Este comportamento facilita a ligação com cuidadores.',
    category: 'linguagem', 
    target_month: 4, 
    min_month: 3, 
    max_month: 6, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Balbucia (mama, papa sem significado)', 
    description: 'O bebê produz sequências de sílabas repetidas como "mama", "papa", "dada", ainda sem atribuir significado específico. O balbucio é estágio fundamental no desenvolvimento da linguagem receptiva e expressiva.',
    category: 'linguagem', 
    target_month: 6, 
    min_month: 5, 
    max_month: 9, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Responde ao próprio nome', 
    description: 'O bebê demonstra reconhecer seu nome, virando-se ou reagindo quando chamado. O reconhecimento do próprio nome indica compreensão linguística em desenvolvimento e formação da identidade.',
    category: 'linguagem', 
    target_month: 8, 
    min_month: 6, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Fala primeira palavra com significado', 
    description: 'O bebê usa sua primeira palavra de forma consistente e com significado, como "mamã" para a mãe ou "au-au" para cachorro. A primeira palavra marca o início da linguagem simbólica e comunicação intencional.',
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
    description: 'A criança usa de 3 a 6 palavras com significado, além de "mamã" e "papá", para se comunicar. A expansão do vocabulário indica desenvolvimento linguístico adequado e facilitação da comunicação.',
    category: 'linguagem', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Aponta para objetos desejados', 
    description: 'A criança usa o gesto de apontar para indicar o que deseja ou para mostrar algo de interesse, combinando com vocalizações. O apontar é um gesto comunicativo importante que precede a linguagem verbal refinada.',
    category: 'linguagem', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Combina duas palavras', 
    description: 'A criança forma pequenas frases de duas palavras como "qué água", "mamã dá", demonstrando início da sintaxe e expressão de ideias mais complexas. Dois-palavras é marco importante da linguagem expressiva.',
    category: 'linguagem', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Vocabulário de 50+ palavras', 
    description: 'A criança possui vocabulário expressivo de mais de 50 palavras e compreende muito mais do que consegue falar. Este marco indica explosão linguística típica do segundo ano de vida.',
    category: 'linguagem', 
    target_month: 24, 
    min_month: 18, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Forma frases de 3-4 palavras', 
    description: 'A criança constrói frases mais complexas com 3 a 4 palavras, expressando ideias e necessidades de forma mais clara e gramaticalmente adequada. As frases expandidas indicam desenvolvimento sintático progressivo.',
    category: 'linguagem', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  },
  { 
    title: 'Fala compreensível para estranhos', 
    description: 'A maior parte da fala da criança (75% ou mais) pode ser compreendida por pessoas que não convivem com ela. A inteligibilidade da fala é crucial para a comunicação efetiva na escola e ambientes sociais.',
    category: 'linguagem', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 12 
  },
  { 
    title: 'Conta histórias simples', 
    description: 'A criança consegue narrar eventos do dia-a-dia ou recontar histórias simples com sequência lógica de início, meio e fim. A narrativa indica desenvolvimento da linguagem expressiva e pensamento sequencial refinado.',
    category: 'linguagem', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 13 
  },
  { 
    title: 'Fala com gramática correta', 
    description: 'A criança utiliza estruturas gramaticais corretas na maior parte das frases, incluindo conjugação verbal e concordância. A gramática adequada indica desenvolvimento linguístico avançado e preparação para a alfabetização.',
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
    description: 'O bebê responde com um sorriso quando alguém sorri para ele ou fala de forma carinhosa, demonstrando interação social e capacidade emocional. O sorriso social é fundamental para o apego seguro.',
    category: 'social', 
    target_month: 2, 
    min_month: 1, 
    max_month: 3, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Ri alto', 
    description: 'O bebê ri de forma audível e expressiva em resposta a brincadeiras, cócegas ou interações prazerosas. A risa compartilhada é indicador importante de bem-estar socioafetivo e interação segura.',
    category: 'social', 
    target_month: 4, 
    min_month: 3, 
    max_month: 5, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Distingue familiares de estranhos', 
    description: 'O bebê demonstra comportamentos diferentes com pessoas conhecidas e desconhecidas, podendo estranhar ou mostrar preferência. Esta discriminação social indica desenvolvimento do apego e consciência social emergente.',
    category: 'social', 
    target_month: 6, 
    min_month: 5, 
    max_month: 8, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Brinca de esconde-esconde', 
    description: 'O bebê participa ativamente de brincadeiras de esconder o rosto, demonstrando alegria e antecipação. Esta brincadeira desenvolve vínculo e compreensão inicial de sequências sociais previsíveis.',
    category: 'social', 
    target_month: 8, 
    min_month: 7, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Dá tchau', 
    description: 'O bebê acena com a mão em resposta a "tchau" ou quando alguém se despede, demonstrando compreensão de gestos sociais. O gesto de despedida indica compreensão de rotinas sociais e imitação significativa.',
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
    description: 'A criança imita ações do cotidiano como varrer, falar ao telefone ou cuidar de bonecas, demonstrando aprendizado por observação e compreensão de papéis sociais. A imitação é mecanismo fundamental de aprendizado social.',
    category: 'social', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Brinca perto de outras crianças', 
    description: 'A criança brinca ao lado de outras crianças (jogo paralelo), ainda sem interagir diretamente, mas demonstrando interesse. O jogo paralelo é estágio normativo que precede a interação direta em brincadeiras cooperativas.',
    category: 'social', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Brinca junto com outras crianças', 
    description: 'A criança começa a interagir diretamente com outras crianças em brincadeiras, compartilhando brinquedos e atividades. O jogo cooperativo marca transição importante para competência social peer e aprendizado colaborativo.',
    category: 'social', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Faz amizades', 
    description: 'A criança demonstra preferência por determinados colegas, buscando brincar com eles e desenvolvendo vínculos de amizade. A amizade indica desenvolvimento de habilidades sociais e capacidade de relacionamento interpessoal.',
    category: 'social', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Segue regras de jogos', 
    description: 'A criança compreende e segue regras simples de jogos e brincadeiras em grupo, aguardando sua vez. A compreensão de regras é fundamental para participação efetiva em contextos escolares e comunitários.',
    category: 'social', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Coopera em atividades em grupo', 
    description: 'A criança participa de atividades cooperativas, trabalhando em conjunto com outras crianças para um objetivo comum. A cooperação indica desenvolvimento avançado de habilidades sociais e capacidade de trabalho em equipe.',
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
    description: 'O bebê acalma-se quando pego no colo, embalado ou ouvindo a voz do cuidador, demonstrando vínculo e regulação emocional. O conforto quando acolhido é indicador fundamental de apego seguro e bem-estar.',
    category: 'emocional', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Expressa alegria', 
    description: 'O bebê demonstra alegria de forma clara através de sorrisos, gargalhadas e movimentos corporais animados. A expressão de alegria indica regulação emocional positiva e bem-estar geral adequado.',
    category: 'emocional', 
    target_month: 3, 
    min_month: 2, 
    max_month: 4, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Demonstra ansiedade com estranhos', 
    description: 'O bebê mostra desconforto ou choro na presença de pessoas desconhecidas, demonstrando discriminação social e apego. A ansiedade com estranhos é comportamento normativo do segundo semestre de vida.',
    category: 'emocional', 
    target_month: 8, 
    min_month: 6, 
    max_month: 10, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Mostra preferência por cuidador principal', 
    description: 'O bebê demonstra clara preferência pelo cuidador principal, buscando-o em momentos de estresse ou para conforto. A preferência pelo cuidador é sinal importante de formação segura de apego.',
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
    description: 'A criança expressa frustração através de birras ou choro quando não consegue o que deseja, fase normal do desenvolvimento. A frustração adequadamente expressa permite exploração de regulação emocional com apoio do adulto.',
    category: 'emocional', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 5 
  },
  { 
    title: 'Fase do "não" (oposição)', 
    description: 'A criança usa frequentemente a palavra "não" e demonstra comportamento opositor, parte normal do desenvolvimento da autonomia e autoafirmação. O comportamento opositor é fase esperada da diferenciação do "eu".',
    category: 'emocional', 
    target_month: 24, 
    min_month: 18, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Expressa vergonha e orgulho', 
    description: 'A criança demonstra emoções autoconscientes como vergonha quando erra e orgulho quando consegue realizar algo. As emoções autoconscientes indicam desenvolvimento cognitivo e social avançado.',
    category: 'emocional', 
    target_month: 30, 
    min_month: 24, 
    max_month: 36, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Nomeia emoções básicas', 
    description: 'A criança consegue identificar e nomear emoções básicas como feliz, triste, com raiva, com medo, em si e nos outros. O reconhecimento de emoções é fundamental para inteligência emocional e regulação posterior.',
    category: 'emocional', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Regula emoções com ajuda do adulto', 
    description: 'A criança começa a conseguir acalmar-se com orientação verbal do adulto, usando estratégias como respirar fundo. A regulação com suporte adulto é pré-requisito para regulação autônoma futura.',
    category: 'emocional', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Demonstra empatia', 
    description: 'A criança mostra preocupação genuína com os sentimentos dos outros e tenta confortar quem está triste ou machucado. A empatia é habilidade socioemocional avançada que prediz competência social posterior.',
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
    description: 'O bebê consegue fixar o olhar em objetos ou rostos a uma distância de 20-30 cm, demonstrando acuidade visual básica. A fixação visual é essencial para processamento visual inicial e interação social.',
    category: 'sensorial', 
    target_month: 1, 
    min_month: 0, 
    max_month: 2, 
    source: 'caderneta_crianca_ms', 
    order_index: 1 
  },
  { 
    title: 'Segue objetos com os olhos', 
    description: 'O bebê acompanha visualmente um objeto em movimento horizontal e vertical, demonstrando coordenação oculomotora adequada. O seguimento visual é indicador importante de integridade visual e neurológica.',
    category: 'sensorial', 
    target_month: 2, 
    min_month: 1, 
    max_month: 3, 
    source: 'caderneta_crianca_ms', 
    order_index: 2 
  },
  { 
    title: 'Leva objetos à boca para explorar', 
    description: 'O bebê explora objetos levando-os à boca, usando os lábios e língua como fonte de informação tátil. A exploração oral é mecanismo normal de aprendizado sensorial nesta faixa etária.',
    category: 'sensorial', 
    target_month: 4, 
    min_month: 3, 
    max_month: 6, 
    source: 'caderneta_crianca_ms', 
    order_index: 3 
  },
  { 
    title: 'Transfere objetos entre as mãos', 
    description: 'O bebê consegue passar um objeto de uma mão para outra, demonstrando coordenação bilateral e controle motor fino inicial. A transferência bimanual indica integração sensório-motora em desenvolvimento.',
    category: 'sensorial', 
    target_month: 6, 
    min_month: 5, 
    max_month: 8, 
    source: 'caderneta_crianca_ms', 
    order_index: 4 
  },
  { 
    title: 'Usa movimento de pinça (polegar-indicador)', 
    description: 'O bebê pega objetos pequenos usando a ponta do polegar e do indicador (pinça superior), demonstrando motricidade fina refinada. A pinça tripé é fundamental para futuras habilidades de manipulação e escrita.',
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
    description: 'A criança consegue virar páginas de livros de papelão ou tecido, embora ainda virando várias páginas de uma vez. O interesse por livros indica desenvolvimento cognitivo e suporte para alfabetização posterior.',
    category: 'sensorial', 
    target_month: 15, 
    min_month: 12, 
    max_month: 18, 
    source: 'caderneta_crianca_ms', 
    order_index: 6 
  },
  { 
    title: 'Segura lápis e faz rabiscos', 
    description: 'A criança segura giz de cera ou lápis grosso e faz marcas no papel de forma intencional, usando preensão palmar adequada. A expressão gráfica é pré-requisito para desenvolvimento da escrita.',
    category: 'sensorial', 
    target_month: 18, 
    min_month: 15, 
    max_month: 24, 
    source: 'caderneta_crianca_ms', 
    order_index: 7 
  },
  { 
    title: 'Vira páginas uma a uma', 
    description: 'A criança consegue virar páginas de livro de papel uma de cada vez, demonstrando controle motor fino aprimorado. O manuseio de páginas indica desenvolvimento adequado de motricidade fina para a idade.',
    category: 'sensorial', 
    target_month: 24, 
    min_month: 20, 
    max_month: 30, 
    source: 'caderneta_crianca_ms', 
    order_index: 8 
  },
  { 
    title: 'Usa tesoura com supervisão', 
    description: 'A criança consegue fazer cortes simples com tesoura sem ponta, demonstrando coordenação bimanual avançada e controle motor refinado. O uso de tesoura é importante para atividades de pré-escrita.',
    category: 'sensorial', 
    target_month: 36, 
    min_month: 30, 
    max_month: 42, 
    source: 'caderneta_crianca_ms', 
    order_index: 9 
  },
  { 
    title: 'Desenha figuras reconhecíveis', 
    description: 'A criança desenha figuras que podem ser identificadas como pessoas, casas ou animais, com formas e detalhes básicos. O desenho representativo é marco importante de expressão criativa e desenvolvimento cognitivo.',
    category: 'sensorial', 
    target_month: 48, 
    min_month: 42, 
    max_month: 54, 
    source: 'caderneta_crianca_ms', 
    order_index: 10 
  },
  { 
    title: 'Escreve algumas letras', 
    description: 'A criança consegue reproduzir algumas letras, especialmente as do próprio nome, com preensão tripé adequada do lápis. A escrita inicial de letras indica preparação adequada para alfabetização formal.',
    category: 'sensorial', 
    target_month: 60, 
    min_month: 48, 
    max_month: 60, 
    source: 'caderneta_crianca_ms', 
    order_index: 11 
  }
];

module.exports = officialMilestonesData;
